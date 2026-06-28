import React from 'react'

export function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="/shayga-logo.svg"
        alt="Shayga Logo"
        style={{ height: '32px', width: '32px' }}
      />
      <span
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Shayga
      </span>
    </div>
  )
}
