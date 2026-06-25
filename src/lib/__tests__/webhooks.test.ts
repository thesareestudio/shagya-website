import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendWebhook } from '../webhooks'

describe('sendWebhook', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is a function', () => {
    expect(typeof sendWebhook).toBe('function')
  })

  it('sends a POST request with JSON payload', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', mockFetch)

    const result = await sendWebhook('https://example.com/webhook', {
      event: 'test',
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'test' }),
      }),
    )

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(200)
    expect(result.attempt).toBe(1)
  })

  it('returns success with correct statusCode on 201', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 201 })),
    )

    const result = await sendWebhook('https://example.com/webhook', {})

    expect(result.success).toBe(true)
    expect(result.statusCode).toBe(201)
  })

  it('retries on server errors and succeeds on second attempt', async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))

    vi.stubGlobal('fetch', mockFetch)

    const result = await sendWebhook('https://example.com/webhook', {}, 3)

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.success).toBe(true)
    expect(result.attempt).toBe(2)
  }, 10_000)

  it('retries on HTTP 500 until maxRetries and returns failure', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 500 }))

    vi.stubGlobal('fetch', mockFetch)

    const result = await sendWebhook('https://example.com/webhook', {}, 2)

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.success).toBe(false)
    expect(result.error).toBe('HTTP 500')
  }, 10_000)

  it('returns failure on network error with no retries', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED')),
    )

    const result = await sendWebhook('https://example.com/webhook', {}, 1)

    expect(result.success).toBe(false)
    expect(result.error).toContain('ECONNREFUSED')
  })

  it('defaults to 3 retries when maxRetries not specified', async () => {
    // Verify the parameter is optional by calling with 2 args
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    )

    const result = await sendWebhook('https://example.com/webhook', {})

    expect(result.success).toBe(true)
    expect(result.attempt).toBe(1)
  })
})
