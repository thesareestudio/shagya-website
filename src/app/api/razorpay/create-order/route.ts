import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import Razorpay from 'razorpay'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Find the customer
    const customers = await payload.find({
      collection: 'customers',
      where: {
        betterAuthUserId: { equals: session.user.id },
      },
      limit: 1,
    })

    if (customers.docs.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const customer = customers.docs[0]

    // Find the customer's cart
    const carts = await payload.find({
      collection: 'carts',
      where: {
        customer: { equals: customer.id },
      },
      limit: 1,
    })

    if (
      carts.docs.length === 0 ||
      !carts.docs[0].items ||
      carts.docs[0].items.length === 0
    ) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const cart = carts.docs[0]

    // Calculate subtotal, shipping, discount, total
    const subtotal =
      cart.subtotal ||
      (cart.items || []).reduce((acc: number, item: any) => {
        return acc + (item.unitPrice || 0) * (item.quantity || 1)
      }, 0)

    // Calculate shipping (Free for >= 5000, otherwise 150)
    const shipping = subtotal >= 5000 ? 0 : 150

    // Handle coupon discount
    let discount = 0
    if (cart.coupon) {
      const couponId =
        typeof cart.coupon === 'object' ? cart.coupon.id : cart.coupon
      const coupon = await payload.findByID({
        collection: 'coupons',
        id: couponId,
      })

      if (coupon && coupon.isActive) {
        if (coupon.type === 'percentage') {
          discount = Math.round((subtotal * (coupon.value || 0)) / 100)
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount
          }
        } else if (coupon.type === 'fixed_amount') {
          discount = coupon.value || 0
        }
      }
    }

    const total = Math.max(0, subtotal + shipping - discount)

    // Initialize Razorpay
    const keyId = process.env.RAZORPAY_KEY_ID || ''
    const keySecret = process.env.RAZORPAY_KEY_SECRET || ''

    // If key is dummy or not configured, return a mock order for developer testing
    const isDummyKey =
      !keyId || keyId.startsWith('rzp_test_xxxx') || keySecret === 'change-me'

    if (isDummyKey) {
      const mockOrder = {
        id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
        entity: 'order',
        amount: total * 100,
        amount_paid: 0,
        amount_due: total * 100,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        status: 'created',
        attempts: 0,
        notes: [],
        created_at: Math.floor(Date.now() / 1000),
        isMock: true,
      }

      return NextResponse.json({
        razorpayOrder: mockOrder,
        subtotal,
        shipping,
        discount,
        total,
      })
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount: total * 100, // in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })

    return NextResponse.json({
      razorpayOrder: order,
      subtotal,
      shipping,
      discount,
      total,
    })
  } catch (error: any) {
    console.error('[Razorpay Create Order API Error]:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
