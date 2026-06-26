import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports
// ---------------------------------------------------------------------------

// Mock the Drizzle sql template tag — just returns the strings array
vi.mock('@payloadcms/db-postgres/drizzle', () => ({
  sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings,
    values,
    __isRawQuery: true,
  }),
}))

vi.mock('@payload-config', () => ({
  default: {},
}))

const mockExecute = vi.fn()

vi.mock('payload', async (importOriginal) => {
  const actual: Record<string, unknown> =
    await importOriginal<typeof import('payload')>()
  return {
    ...actual,
    getPayload: vi.fn(() =>
      Promise.resolve({
        db: {
          drizzle: {
            execute: mockExecute,
          },
        },
      }),
    ),
  }
})

let GET_search: (request: Request) => Promise<Response>

beforeEach(async () => {
  vi.clearAllMocks()
  const mod = await import('../search/route')
  GET_search = mod.GET
})

function mockProductRow(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 1,
    type: 'product',
    name: 'Banarasi Silk Saree',
    slug: 'banarasi-silk-saree',
    title: null,
    excerpt: null,
    base_price: 15000,
    compare_at_price: null,
    fabric: 'silk',
    weave: 'banarasi',
    featured_image_id: null,
    rank: 0.35,
    ...overrides,
  }
}

function mockPostRow(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 5,
    type: 'post',
    name: null,
    slug: 'saree-care-guide',
    title: 'Saree Care Guide',
    excerpt: 'How to care for silks',
    base_price: null,
    compare_at_price: null,
    fabric: null,
    weave: null,
    featured_image_id: null,
    rank: 0.2,
    ...overrides,
  }
}

describe('GET /api/search', () => {
  it('returns matching FTS results with product type', async () => {
    mockExecute.mockResolvedValueOnce([
      mockProductRow({
        id: 1,
        name: 'Banarasi Silk Saree',
        base_price: 15000,
      }),
      mockProductRow({
        id: 2,
        name: 'Silk Cotton Blend',
        base_price: 8000,
        slug: 'silk-cotton-blend',
      }),
    ])

    const response = await GET_search(
      new Request('http://localhost/api/search?q=silk'),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.docs).toHaveLength(2)
    expect(body.docs[0]).toHaveProperty('type', 'product')
    expect(body.docs[0]).toHaveProperty('name', 'Banarasi Silk Saree')
    expect(body.docs[0]).toHaveProperty('basePrice', 15000)
    expect(body.docs[1]).toHaveProperty('name', 'Silk Cotton Blend')
    expect(body.docs[0]).toHaveProperty('rank')
    expect(body.totalDocs).toBe(2)
  })

  it('returns both product and post results', async () => {
    mockExecute.mockResolvedValueOnce([
      mockProductRow({ id: 1, name: 'Silk Saree' }),
      mockPostRow({ id: 5, title: 'Saree Care Guide' }),
    ])

    const response = await GET_search(
      new Request('http://localhost/api/search?q=saree'),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.docs).toHaveLength(2)
    expect(body.docs[0]).toHaveProperty('type', 'product')
    expect(body.docs[1]).toHaveProperty('type', 'post')
    expect(body.docs[1]).toHaveProperty('title', 'Saree Care Guide')
  })

  it('returns empty array when no FTS match found', async () => {
    mockExecute.mockResolvedValueOnce([])

    const response = await GET_search(
      new Request('http://localhost/api/search?q=xyznonexistent'),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.docs).toHaveLength(0)
    expect(body.totalDocs).toBe(0)
  })

  it('respects limit query param', async () => {
    mockExecute.mockResolvedValueOnce([])

    await GET_search(new Request('http://localhost/api/search?q=test&limit=5'))

    expect(mockExecute).toHaveBeenCalledTimes(1)
  })

  it('clamps limit to max 100', async () => {
    mockExecute.mockResolvedValueOnce([])

    const response = await GET_search(
      new Request('http://localhost/api/search?q=test&limit=500'),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.limit).toBe(100)
  })

  it('sets Cache-Control headers', async () => {
    mockExecute.mockResolvedValueOnce([])

    const response = await GET_search(
      new Request('http://localhost/api/search?q=test'),
    )

    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    )
  })

  it('returns 400 when q param is missing', async () => {
    const response = await GET_search(
      new Request('http://localhost/api/search'),
    )
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toBe('Missing search query parameter "q"')
  })

  it('returns 400 when q param is empty', async () => {
    const response = await GET_search(
      new Request('http://localhost/api/search?q='),
    )

    expect(response.status).toBe(400)
  })

  it('returns 500 when drizzle.execute fails', async () => {
    mockExecute.mockRejectedValueOnce(new Error('DB connection lost'))

    const response = await GET_search(
      new Request('http://localhost/api/search?q=test'),
    )
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toBe('Internal Server Error')
  })

  it('converts numeric fields from strings to numbers', async () => {
    mockExecute.mockResolvedValueOnce([
      mockProductRow({
        base_price: '12500.50',
        compare_at_price: '15000.00',
      }),
    ])

    const response = await GET_search(
      new Request('http://localhost/api/search?q=silk'),
    )
    const body = await response.json()

    expect(body.docs[0].basePrice).toBe(12500.5)
    expect(body.docs[0].compareAtPrice).toBe(15000)
  })
})
