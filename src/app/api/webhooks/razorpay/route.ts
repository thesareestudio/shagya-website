import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    // Skip signature check in local development if webhook secret is missing/not set
    if (webhookSecret && signature) {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex')

      if (expected !== signature) {
        return new Response('Invalid webhook signature', { status: 400 })
      }
    }

    const event = JSON.parse(body)
    const payload = await getPayload({ config })

    const paymentEntity = event.payload?.payment?.entity
    if (!paymentEntity) {
      return NextResponse.json({
        received: true,
        note: 'No payment entity found',
      })
    }

    const paymentId = paymentEntity.id
    const orderId = paymentEntity.order_id

    // Find the order by paymentId (or custom note orderId)
    let orderDoc = null
    const ordersByPayment = await payload.find({
      collection: 'orders',
      where: {
        paymentId: { equals: paymentId },
      },
      limit: 1,
    })

    if (ordersByPayment.docs.length > 0) {
      orderDoc = ordersByPayment.docs[0]
    }

    if (!orderDoc) {
      // If we couldn't find by paymentId, search by notes/metadata or skip
      console.log(
        `[Razorpay Webhook] Order not found for payment ID: ${paymentId}`,
      )
      return NextResponse.json({ received: true, note: 'Order not found' })
    }

    switch (event.event) {
      case 'payment.captured':
        await payload.update({
          collection: 'orders',
          id: orderDoc.id,
          data: {
            status: 'confirmed',
          },
        })
        console.log(
          `[Razorpay Webhook] Order ${orderDoc.orderNumber} status updated to confirmed`,
        )
        break

      case 'payment.failed':
        await payload.update({
          collection: 'orders',
          id: orderDoc.id,
          data: {
            status: 'cancelled',
          },
        })
        console.log(
          `[Razorpay Webhook] Order ${orderDoc.orderNumber} status updated to cancelled (payment failed)`,
        )
        break

      case 'refund.processed':
        await payload.update({
          collection: 'orders',
          id: orderDoc.id,
          data: {
            status: 'refunded',
          },
        })
        console.log(
          `[Razorpay Webhook] Order ${orderDoc.orderNumber} status updated to refunded`,
        )
        break

      default:
        console.log(`[Razorpay Webhook] Unhandled event: ${event.event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[Razorpay Webhook Error]:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
