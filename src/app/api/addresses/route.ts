import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

/**
 * GET /api/addresses
 * Fetch all addresses for the logged-in customer.
 */
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Find customer
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

    // Fetch addresses
    const addresses = await payload.find({
      collection: 'addresses',
      where: {
        customer: { equals: customer.id },
      },
      sort: '-isDefault', // defaults first
    })

    return NextResponse.json({ addresses: addresses.docs })
  } catch (error: any) {
    console.error('[API] GET /api/addresses error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/addresses
 * Create a new address for the logged-in customer.
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
      isDefault,
    } = body

    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Find customer
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

    // If setting as default, unset other defaults
    if (isDefault) {
      const existingDefaults = await payload.find({
        collection: 'addresses',
        where: {
          customer: { equals: customer.id },
          isDefault: { equals: true },
        },
      })

      for (const doc of existingDefaults.docs) {
        await payload.update({
          collection: 'addresses',
          id: doc.id,
          data: { isDefault: false },
        })
      }
    }

    // Create new address
    const newAddress = await payload.create({
      collection: 'addresses',
      data: {
        customer: customer.id,
        fullName,
        phone,
        line1,
        line2: line2 || '',
        city,
        state,
        pincode,
        country: country || 'India',
        isDefault: !!isDefault,
      },
    })

    return NextResponse.json({ address: newAddress })
  } catch (error: any) {
    console.error('[API] POST /api/addresses error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
