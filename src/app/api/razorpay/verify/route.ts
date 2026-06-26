import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      billingAddress,
      phone,
      isCod = false,
      isMock = false,
    } = await request.json()

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 },
      )
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

    // Find the customer's cart to pull items and compute pricing
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

    const shipping = subtotal >= 5000 ? 0 : 150

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

    // Verification step
    let finalPaymentId = ''
    let orderStatus: 'confirmed' | 'pending' = 'pending'

    if (isCod) {
      finalPaymentId = 'COD'
      orderStatus = 'pending' // COD orders start as pending verification
    } else {
      orderStatus = 'confirmed'
      finalPaymentId = razorpay_payment_id || 'MOCK_PAYMENT'

      if (!isMock) {
        // Run signature verification for live payments
        const keySecret = process.env.RAZORPAY_KEY_SECRET || ''
        const expected = crypto
          .createHmac('sha256', keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex')

        if (expected !== razorpay_signature) {
          return NextResponse.json(
            { error: 'Invalid payment signature' },
            { status: 400 },
          )
        }
      }
    }

    // Map cart items to order items schema
    const orderItems = (cart.items || []).map((item: any) => {
      const productId =
        typeof item.product === 'object' && item.product !== null
          ? item.product.id
          : item.product

      // Determine variant ID (could be relation ID inside variant JSON object or string)
      let variantId = null
      if (item.variant) {
        if (typeof item.variant === 'object') {
          variantId = item.variant.id || null
        } else {
          variantId = item.variant
        }
      }

      return {
        product: productId,
        variant: variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }
    })

    // Create the order
    const order = await payload.create({
      collection: 'orders',
      data: {
        customerEmail: session.user.email,
        phone: phone || customer.phone || '',
        status: orderStatus,
        subtotal,
        shipping,
        discount,
        total,
        paymentId: finalPaymentId,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          country: shippingAddress.country || 'India',
        },
        billingAddress: {
          fullName: billingAddress?.fullName || shippingAddress.fullName,
          phone: billingAddress?.phone || shippingAddress.phone,
          line1: billingAddress?.line1 || shippingAddress.line1,
          line2: billingAddress?.line2 || shippingAddress.line2 || '',
          city: billingAddress?.city || shippingAddress.city,
          state: billingAddress?.state || shippingAddress.state,
          pincode: billingAddress?.pincode || shippingAddress.pincode,
          country:
            billingAddress?.country || shippingAddress.country || 'India',
        },
        items: orderItems,
      },
    })

    // Clear the cart
    await payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        items: [],
        subtotal: 0,
        coupon: null,
      },
    })

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    })
  } catch (error: any) {
    console.error('[Razorpay Verify API Error]:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
