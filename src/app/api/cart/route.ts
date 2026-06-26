import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

/**
 * GET /api/cart
 * Returns the authenticated user's cart.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Find the customer linked to this Better Auth user
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

    const customerId = customers.docs[0].id

    // Find the cart for this customer
    const carts = await payload.find({
      collection: 'carts',
      where: {
        customer: { equals: customerId },
      },
      limit: 1,
    })

    if (carts.docs.length === 0) {
      return NextResponse.json({ items: [], subtotal: 0 })
    }

    return NextResponse.json(carts.docs[0])
  } catch (error) {
    console.error('[API] GET /api/cart error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/cart
 * Updates or merges the authenticated user's cart.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, couponId } = await request.json()
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Find the customer linked to this Better Auth user
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

    const customerId = customers.docs[0].id

    // Calculate subtotal
    const subtotal = items.reduce(
      (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 1),
      0,
    )

    // Find existing cart
    const carts = await payload.find({
      collection: 'carts',
      where: {
        customer: { equals: customerId },
      },
      limit: 1,
    })

    let cart
    const data: any = {
      customer: customerId,
      items: items.map((item) => ({
        product:
          typeof item.product === 'object' && item.product !== null
            ? item.product.id
            : item.product,
        variant: item.variant || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      subtotal,
      lastActivity: new Date().toISOString(),
    }

    if (couponId) {
      data.coupon = couponId
    }

    if (carts.docs.length > 0) {
      // Update cart
      cart = await payload.update({
        collection: 'carts',
        id: carts.docs[0].id,
        data,
      })
    } else {
      // Create new cart
      cart = await payload.create({
        collection: 'carts',
        data,
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('[API] POST /api/cart error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
