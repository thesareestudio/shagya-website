import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ftsSearch } from '@/lib/fts-search'

/**
 * GET /api/search
 *
 * Full-text search across products and posts using PostgreSQL tsvector
 * columns with GIN indexes. Results are ranked by relevance (ts_rank).
 *
 * Query params:
 *   q     - search query string (required)
 *   limit - results per page (default 20, max 100)
 */

const CACHE_HEADER =
  'public, max-age=60, s-maxage=300, stale-while-revalidate=600'

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q) {
      return NextResponse.json(
        { error: 'Missing search query parameter "q"' },
        { status: 400 },
      )
    }

    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get('limit') || '20', 10)),
    )

    const payload = await getPayload({ config })

    const result = await ftsSearch(payload, q, limit)

    return NextResponse.json(
      {
        docs: result.docs,
        totalDocs: result.totalDocs,
        limit,
        query: q,
      },
      {
        headers: { 'Cache-Control': CACHE_HEADER },
      },
    )
  } catch (error) {
    console.error('[API] GET /api/search error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
