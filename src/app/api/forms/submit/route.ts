import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * POST /api/forms/submit
 * Handles public form submissions for the Form Builder.
 */
export async function POST(request: Request) {
  try {
    const { formId, data, honeypot } = await request.json()

    if (!formId || !data) {
      return NextResponse.json(
        { error: 'formId and data are required' },
        { status: 400 },
      )
    }

    // Check honeypot spam protection
    if (honeypot && String(honeypot).trim().length > 0) {
      // Quietly return success to spam bots without doing anything
      return NextResponse.json({
        success: true,
        message: 'Spam filtered successfully.',
      })
    }

    const payload = await getPayload({ config })

    // Verify form exists
    const form = await payload.findByID({
      collection: 'forms',
      id: formId,
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Save submission
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        form: formId,
        data,
        honeypot: honeypot || '',
      },
    })

    return NextResponse.json({
      success: true,
      message: form.successMessage || 'Thank you for your submission!',
      submissionId: submission.id,
    })
  } catch (error: any) {
    console.error('[API] Form Submission Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    )
  }
}
