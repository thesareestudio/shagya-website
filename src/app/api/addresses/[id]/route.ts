import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { auth } from '@/lib/auth'

type Props = {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/addresses/[id]
 * Update a specific address.
 */
export async function PUT(request: Request, { params }: Props) {
  try {
    const { id } = await params
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

    // Verify address ownership
    const address = await payload.findByID({
      collection: 'addresses',
      id,
    })

    const addressCustomer =
      typeof address.customer === 'object'
        ? address.customer.id
        : address.customer
    if (addressCustomer !== customer.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      const existingDefaults = await payload.find({
        collection: 'addresses',
        where: {
          customer: { equals: customer.id },
          isDefault: { equals: true },
          id: { not_equals: id },
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

    const updated = await payload.update({
      collection: 'addresses',
      id,
      data: {
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

    return NextResponse.json({ address: updated })
  } catch (error: any) {
    console.error('[API] PUT /api/addresses/[id] error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/addresses/[id]
 * Delete a specific address.
 */
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params
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

    // Verify address ownership
    const address = await payload.findByID({
      collection: 'addresses',
      id,
    })

    const addressCustomer =
      typeof address.customer === 'object'
        ? address.customer.id
        : address.customer
    if (addressCustomer !== customer.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await payload.delete({
      collection: 'addresses',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[API] DELETE /api/addresses/[id] error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
