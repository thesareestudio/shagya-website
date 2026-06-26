import type { Payload } from 'payload'
import { sql } from '@payloadcms/db-postgres/drizzle'

export interface FTSResult {
  id: number
  type: 'product' | 'post'
  name: string | null
  slug: string | null
  title: string | null
  excerpt: string | null
  base_price: number | null
  compare_at_price: number | null
  fabric: string | null
  weave: string | null
  featured_image_id: number | null
  rank: number
}

export interface FTSProductResult {
  id: number
  type: 'product'
  name: string
  slug: string
  basePrice: number | null
  compareAtPrice: number | null
  fabric: string | null
  weave: string | null
  rank: number
}

export interface FTSPostResult {
  id: number
  type: 'post'
  title: string
  slug: string
  excerpt: string | null
  rank: number
}

export type FTSUnifiedResult = FTSProductResult | FTSPostResult

interface FTSResponse {
  docs: FTSUnifiedResult[]
  totalDocs: number
  query: string
}

function parseQ(q: string): string {
  return q
    .trim()
    .replace(/[&|!()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function ftsSearch(
  payload: Payload,
  q: string,
  limit = 20,
): Promise<FTSResponse> {
  const cleaned = parseQ(q)
  if (!cleaned) {
    return { docs: [], totalDocs: 0, query: q }
  }

  const db = (
    payload.db as unknown as {
      drizzle: { execute: (q: unknown) => Promise<unknown> }
    }
  ).drizzle
  const rawResult = await db.execute(sql`
    SELECT * FROM (
      SELECT
        p.id, 'product' AS type, p.name, p.slug,
        NULL::text AS title, NULL::text AS excerpt,
        p.base_price, p.compare_at_price,
        p.fabric::text AS fabric, p.weave::text AS weave,
        NULL::integer AS featured_image_id,
        ts_rank(p.search_vector, websearch_to_tsquery('english', ${cleaned})) AS rank
      FROM products p
      WHERE p.search_vector @@ websearch_to_tsquery('english', ${cleaned})
        AND p.status = 'published'

      UNION ALL

      SELECT
        po.id, 'post' AS type, NULL::text AS name, po.slug,
        po.title, po.excerpt,
        NULL::numeric AS base_price, NULL::numeric AS compare_at_price,
        NULL::text AS fabric, NULL::text AS weave,
        po.featured_image_id,
        ts_rank(po.search_vector, websearch_to_tsquery('english', ${cleaned})) AS rank
      FROM posts po
      WHERE po.search_vector @@ websearch_to_tsquery('english', ${cleaned})
        AND po.status = 'published'
    ) AS combined
    ORDER BY rank DESC
    LIMIT ${limit}
  `)

  const rows: FTSResult[] = Array.isArray(rawResult)
    ? rawResult
    : (rawResult as { rows: FTSResult[] }).rows

  const docs: FTSUnifiedResult[] = rows.map((row) => {
    if (row.type === 'product') {
      return {
        id: Number(row.id),
        type: 'product' as const,
        name: row.name ?? '',
        slug: row.slug ?? '',
        basePrice: row.base_price ? Number(row.base_price) : null,
        compareAtPrice: row.compare_at_price
          ? Number(row.compare_at_price)
          : null,
        fabric: row.fabric,
        weave: row.weave,
        rank: Number(row.rank),
      } satisfies FTSProductResult
    }
    return {
      id: Number(row.id),
      type: 'post' as const,
      title: row.title ?? '',
      slug: row.slug ?? '',
      excerpt: row.excerpt,
      rank: Number(row.rank),
    } satisfies FTSPostResult
  })

  return { docs, totalDocs: docs.length, query: q }
}
