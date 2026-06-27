'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

const SLUG_META = {
  'order-placed-customer':
    '{{orderNumber}} {{customerName}} {{orderDate}} {{itemsTable}} {{pricingTable}} {{shippingAddressBlock}} {{storeUrl}}',
  'admin-new-order':
    '{{orderNumber}} {{customerName}} {{customerEmail}} {{customerPhone}} {{orderDate}} {{itemsTable}} {{pricingTable}} {{shippingAddressBlock}} {{adminOrderUrl}}',
  'order-confirmed-customer':
    '{{orderNumber}} {{customerName}} {{paymentId}} {{total}} {{storeUrl}}',
  'order-processing-customer': '{{orderNumber}} {{customerName}} {{storeUrl}}',
  'order-shipped-customer': '{{orderNumber}} {{customerName}} {{storeUrl}}',
  'order-delivered-customer': '{{orderNumber}} {{customerName}} {{storeUrl}}',
  'order-cancelled-customer':
    '{{orderNumber}} {{customerName}} {{total}} {{storeUrl}}',
  'admin-order-cancelled':
    '{{orderNumber}} {{customerName}} {{customerEmail}} {{total}} {{adminOrderUrl}}',
  'order-refunded-customer':
    '{{orderNumber}} {{customerName}} {{total}} {{storeUrl}}',
  'admin-order-refunded':
    '{{orderNumber}} {{customerName}} {{customerEmail}} {{total}} {{adminOrderUrl}}',
  'welcome-customer': '{{customerName}} {{storeUrl}}',
  'verify-email': '{{customerName}} {{verificationUrl}} {{storeUrl}}',
  'magic-link': '{{verificationUrl}} {{storeUrl}}',
}

export const EmailBodyDescription: React.FC = () => {
  const slugField = useFormFields(([fields]) => fields.slug)
  const slug = slugField?.value as keyof typeof SLUG_META | undefined

  const variables =
    slug && SLUG_META[slug]
      ? SLUG_META[slug]
      : 'Select a Template Identifier to see available variables.'

  return (
    <div
      style={{
        marginTop: '10px',
        padding: '12px 16px',
        backgroundColor: '#fafafa',
        border: '1px solid #eaeaeb',
        borderLeft: '4px solid #6B2448',
        borderRadius: '4px',
        fontSize: '13px',
        lineHeight: '1.5',
      }}
    >
      <strong style={{ color: '#222' }}>Available Variables:</strong>
      <div
        style={{
          fontFamily: 'monospace',
          color: '#d946ef',
          marginTop: '6px',
          wordWrap: 'break-word',
        }}
      >
        {variables}
      </div>
      <p style={{ marginTop: '8px', marginBottom: 0, color: '#666' }}>
        <em>
          You can use these placeholders inside your HTML body. They will be
          automatically replaced with the actual order or customer data when the
          email is sent.
        </em>
      </p>
    </div>
  )
}
