import { describe, it, expect } from 'vitest'
import { auth } from '../auth'

describe('auth', () => {
  it('creates an auth instance', () => {
    expect(auth).toBeDefined()
  })

  it('has emailAndPassword enabled', () => {
    expect(auth.options.emailAndPassword?.enabled).toBe(true)
  })

  it('has social providers configured', () => {
    expect(auth.options.socialProviders).toBeDefined()
    expect(auth.options.socialProviders?.google).toBeDefined()
    expect(auth.options.socialProviders?.facebook).toBeDefined()
    expect(auth.options.socialProviders?.apple).toBeDefined()
  })

  it('has a secret set', () => {
    expect(auth.options.secret).toBeDefined()
    expect(typeof auth.options.secret).toBe('string')
  })

  it('has database configured', () => {
    expect(auth.options.database).toBeDefined()
  })

  it('has the phone-number plugin configured', () => {
    expect(auth.options.plugins).toBeDefined()
    expect(auth.options.plugins?.length).toBe(1)
    expect(auth.options.plugins?.[0]?.id).toBe('phone-number')
  })
})
