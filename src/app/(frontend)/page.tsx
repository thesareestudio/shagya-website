import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'

const ph = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(text)}&font=lora`

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-gold-600 text-xs font-semibold tracking-[0.22em] uppercase">
      {children}
    </p>
  )
}

function ImagePanel({
  src,
  alt,
  className,
  rounded = 'rounded-2xl',
  caption,
  region,
  loading,
}: {
  src: string
  alt: string
  className?: string
  rounded?: string
  caption?: string
  region?: string
  loading?: 'lazy' | 'eager'
}) {
  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 ${rounded} ${className ?? ''}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        unoptimized={src.startsWith('https://placehold.co')}
        loading={loading ?? 'lazy'}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0 3px, oklch(0.13 0.04 346) 3px 4px)',
        }}
      />
      {caption && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-neutral-950/55 to-transparent p-5">
          <div>
            <p className="font-display text-sm font-semibold text-white drop-shadow-sm">
              {caption}
            </p>
            {region && (
              <p className="font-body mt-0.5 text-xs text-white/80">{region}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const WEAVES = [
  {
    name: 'Banarasi',
    origin: 'Varanasi, UP',
    color: '69254e',
    textColor: 'f5e8ee',
  },
  {
    name: 'Kanchipuram',
    origin: 'Kanchipuram, TN',
    color: '7a3a5d',
    textColor: 'f5e8ee',
  },
  {
    name: 'Chanderi',
    origin: 'Chanderi, MP',
    color: 'a97e34',
    textColor: 'fff8ec',
  },
  {
    name: 'Jamdani',
    origin: 'Dhaka, Bengal',
    color: '4a6b5d',
    textColor: 'f0f5f1',
  },
  { name: 'Patola', origin: 'Patan, GJ', color: '8b3a3a', textColor: 'fdf2f0' },
  { name: 'Phulkari', origin: 'Punjab', color: 'c47a4a', textColor: 'fff8ec' },
  {
    name: 'Baluchari',
    origin: 'Murshidabad, WB',
    color: '3a5a7a',
    textColor: 'f0f5f8',
  },
  {
    name: 'Maheshwari',
    origin: 'Maheshwar, MP',
    color: '5a7a5a',
    textColor: 'f0f5f0',
  },
]

function WeaveFilmstrip() {
  return (
    <section
      aria-label="Weaves we carry"
      className="bg-brand-50/40 border-y border-neutral-200 py-5"
    >
      <div className="overflow-hidden">
        <div
          className="filmstrip-track"
          style={
            {
              '--filmstrip-gap': '1.25rem',
              '--filmstrip-duration': '50s',
            } as React.CSSProperties
          }
        >
          {[...WEAVES, ...WEAVES].map((w, i) => (
            <div
              key={`${w.name}-${i}`}
              className="relative flex h-24 w-40 shrink-0 items-end overflow-hidden rounded-lg sm:h-28 sm:w-48"
            >
              <div
                className="absolute inset-0"
                style={{ backgroundColor: `#${w.color}` }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent 0 2px, oklch(1 0 0 / 0.1) 2px 4px), repeating-linear-gradient(90deg, transparent 0 2px, oklch(1 0 0 / 0.05) 2px 4px)',
                }}
              />
              <div className="relative z-10 p-3">
                <p className="font-display text-sm font-semibold text-white drop-shadow-sm">
                  {w.name}
                </p>
                <p className="mt-0.5 text-xs text-white/70">{w.origin}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  const pageRes = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  const homeDoc = pageRes.docs[0]

  const heroHeading =
    homeDoc?.content?.[0]?.blockType === 'hero'
      ? (homeDoc.content[0] as any).heading
      : 'The art of the handwoven drape'

  const heroSubheading =
    homeDoc?.content?.[0]?.blockType === 'hero'
      ? (homeDoc.content[0] as any).subheading
      : 'Sarees woven on wooden looms across India — silk, cotton and heritage weaves, delivered from the maker to you.'

  const productsRes = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    limit: 4,
    sort: '-createdAt',
  })
  const dbProducts = productsRes.docs

  const categoriesRes = await payload.find({
    collection: 'categories',
    limit: 3,
  })
  const dbCategories = categoriesRes.docs

  const postsRes = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 2,
    sort: '-publishedAt',
  })
  const dbPosts = postsRes.docs

  const categoryFallbackImages: Record<string, string> = {
    silk: ph(750, 1000, '69254e', 'f5e8ee', 'Silk'),
    cotton: ph(750, 1000, 'a97e34', 'fff8ec', 'Cotton'),
    handloom: ph(750, 1000, '7a3a5d', 'f5e8ee', 'Handloom'),
  }

  return (
    <div className="bg-surface">
      {/* ============================ HERO ============================ */}
      <section className="container-page pt-16 pb-24 md:pt-28 md:pb-40">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="animate-slide-up max-w-xl lg:col-span-6">
            <Eyebrow>Est. — Handloom, Indian-made</Eyebrow>
            <h1 className="text-hero font-display mt-6 font-semibold tracking-tight text-neutral-900">
              {heroHeading}
            </h1>
            <p className="mt-6 max-w-[55ch] text-lg leading-relaxed text-neutral-600">
              {heroSubheading}
            </p>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link
                href="/category/silk"
                className="bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-400 inline-flex h-13 items-center gap-2 rounded-xl px-7 text-base font-semibold text-white transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]"
              >
                Explore the shop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-base font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Our craft story
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-6 text-sm text-neutral-500">
              <span>
                <span className="font-display font-semibold text-neutral-900">
                  6 clusters
                </span>{' '}
                across India
              </span>
              <span className="h-4 w-px bg-neutral-300" />
              <span>
                <span className="font-display font-semibold text-neutral-900">
                  Maker-traced
                </span>{' '}
                every piece
              </span>
              <span className="hidden h-4 w-px bg-neutral-300 sm:block" />
              <span className="hidden sm:inline">
                <span className="font-display font-semibold text-neutral-900">
                  10 weaves
                </span>{' '}
                and counting
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              {dbProducts[0]?.gallery?.[0]?.image ? (
                <ImagePanel
                  src={
                    typeof dbProducts[0].gallery[0].image === 'object'
                      ? dbProducts[0].gallery[0].image.url ||
                        '/images/placeholder.jpg'
                      : '/images/placeholder.jpg'
                  }
                  alt={dbProducts[0].name}
                  caption={dbProducts[0].name}
                  region={dbProducts[0].weave}
                  className="aspect-[4/5] w-full shadow-xl"
                  loading="eager"
                />
              ) : (
                <ImagePanel
                  src={ph(800, 1000, '69254e', 'f5e8ee', 'Kanchipuram Silk')}
                  alt="A handwoven Kanchipuram silk saree in wine and gold"
                  caption="Kanchipuram silk"
                  region="Tamil Nadu"
                  className="aspect-[4/5] w-full shadow-xl"
                  loading="eager"
                />
              )}
              <div className="rule-gold absolute -inset-x-3 -bottom-3 hidden h-px md:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ====================== WEAVE FILMSTRIP ====================== */}
      <WeaveFilmstrip />

      {/* ====================== SHOP BY CRAFT ====================== */}
      <section className="container-page scroll-reveal py-24 md:py-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Browse the collections</Eyebrow>
            <h2 className="text-headline font-display mt-4 font-semibold tracking-tight text-neutral-900">
              Find your weave
            </h2>
          </div>
          <Link
            href="/collections"
            className="group font-display text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          >
            All collections
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-5 sm:gap-6 md:grid-cols-3">
          {dbCategories.slice(0, 3).map((cat) => {
            const slug = cat.slug || cat.name.toLowerCase()
            const img =
              (cat.image && typeof cat.image === 'object'
                ? cat.image.sizes?.card?.url || cat.image.url
                : typeof cat.image === 'string'
                  ? cat.image
                  : null) ||
              categoryFallbackImages[slug] ||
              ph(750, 1000, '7a3a5d', 'f5e8ee', cat.name)

            return (
              <Link
                key={cat.id}
                href={`/category/${slug}`}
                className="group relative block overflow-hidden rounded-2xl"
              >
                <ImagePanel
                  src={img}
                  alt={`${cat.name} sarees`}
                  className="aspect-[3/4] w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  rounded="rounded-2xl"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-neutral-950/55 to-transparent p-6">
                  <div>
                    <p className="font-display text-lg font-semibold text-white">
                      {cat.name}
                    </p>
                    <p className="font-body mt-0.5 text-xs text-white/80">
                      {cat.description || 'Explore our handwoven selection'}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-white/25">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ====================== CRAFT STORY ====================== */}
      <section className="scroll-reveal border-y border-neutral-200 bg-neutral-50/60">
        <div className="container-page grid items-center gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <ImagePanel
              src={ph(800, 800, '7a3a5d', 'f5e8ee', 'On the loom')}
              alt="An artisan weaving a saree on a wooden handloom"
              caption="On the loom"
              region="Varanasi"
              className="aspect-square w-full shadow-lg"
            />
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>From the loom</Eyebrow>
            <h2 className="text-headline font-display mt-4 font-semibold tracking-tight text-neutral-900">
              Six hands, one saree
            </h2>
            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-neutral-600">
              A single Banarasi can take eighteen days and three artisans — the
              weaver, the border-maker, the draw-boy. We work directly with
              these clusters, so the hand that wove it is the hand that&apos;s
              paid for it.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-6 border-t border-neutral-200 pt-6">
              <div>
                <p className="font-display text-2xl font-semibold text-neutral-900">
                  18
                </p>
                <p className="font-body mt-1 text-xs text-neutral-500">
                  days per Banarasi
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-neutral-900">
                  3
                </p>
                <p className="font-body mt-1 text-xs text-neutral-500">
                  artisans per saree
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-neutral-900">
                  6
                </p>
                <p className="font-body mt-1 text-xs text-neutral-500">
                  weaving clusters
                </p>
              </div>
            </div>
            <Link
              href="/blog"
              className="group font-display text-brand-700 hover:text-brand-800 mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              Read the journal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================== CURATED PICKS ====================== */}
      <section className="container-page scroll-reveal py-24 md:py-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>New this week</Eyebrow>
            <h2 className="text-headline font-display mt-4 font-semibold tracking-tight text-neutral-900">
              Quietly chosen
            </h2>
          </div>
          <Link
            href="/category/silk"
            className="group font-display text-brand-700 hover:text-brand-800 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          >
            View all sarees
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {dbProducts.slice(0, 4).map((p) => {
            const imageUrl =
              p.gallery?.[0]?.image && typeof p.gallery[0].image === 'object'
                ? p.gallery[0].image.sizes?.card?.url || p.gallery[0].image.url
                : ph(600, 800, '69254e', 'f5e8ee', p.name)

            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                  <ImagePanel
                    src={imageUrl || ''}
                    alt={p.name}
                    className="aspect-[3/4] w-full"
                    rounded="rounded-xl"
                  />
                </div>
                <div className="mt-4 px-1">
                  <p className="font-display group-hover:text-brand-700 text-base font-semibold text-neutral-900 transition-colors">
                    {p.name}
                  </p>
                  <p className="font-body mt-0.5 text-xs text-neutral-500">
                    {p.weave} · {p.fabric}
                  </p>
                  <div className="text-brand-700 font-display mt-2 flex flex-wrap items-baseline gap-2 text-sm font-semibold">
                    <span>₹{p.basePrice.toLocaleString('en-IN')}</span>
                    {p.compareAtPrice && p.compareAtPrice > p.basePrice && (
                      <>
                        <span className="text-xs font-normal text-neutral-400 line-through">
                          ₹{p.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ====================== PROMISE BAND ====================== */}
      <section className="bg-brand-950">
        <div className="rule-gold" />
        <div className="container-page py-24 text-center md:py-32">
          <Eyebrow>A note from Shagya</Eyebrow>
          <h2 className="text-headline font-display mx-auto mt-6 max-w-3xl font-semibold tracking-tight text-white">
            Every saree is signed by its maker
          </h2>
          <p className="mx-auto mt-6 max-w-[55ch] text-lg leading-relaxed text-neutral-300">
            Handloom-verified. Maker-traced. No middleman markup, no warehouse
            mystery stock — just the cloth, the cluster it came from, and a fair
            price on both sides.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              href="/category/silk"
              className="text-brand-800 hover:bg-gold-200 focus-visible:ring-gold-300 inline-flex h-13 items-center gap-2 rounded-xl bg-white px-7 text-base font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              Begin browsing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-base font-medium text-neutral-300 transition-colors hover:text-white"
            >
              Meet the weavers
            </Link>
          </div>
        </div>
      </section>

      {/* =================== JOURNAL + NEWSLETTER =================== */}
      <section className="scroll-reveal border-b border-neutral-200">
        <div className="container-page py-24 md:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            {/* Journal */}
            <div className="lg:col-span-7">
              <Eyebrow>From the journal</Eyebrow>
              <h2 className="text-headline font-display mt-4 font-semibold tracking-tight text-neutral-900">
                Worth knowing
              </h2>
              <ul className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
                {dbPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex items-center justify-between gap-4 py-6 transition-colors"
                    >
                      <div>
                        <p className="font-display group-hover:text-brand-700 text-lg font-semibold text-neutral-900 transition-colors">
                          {post.title}
                        </p>
                        <p className="font-body mt-1 text-xs text-neutral-500">
                          {post.excerpt
                            ? post.excerpt.substring(0, 90) + '...'
                            : 'Read post'}
                        </p>
                      </div>
                      <ArrowUpRight className="group-hover:text-brand-700 h-5 w-5 shrink-0 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm md:p-10">
                <div className="rule-gold mb-6" />
                <Eyebrow>Letters on craft</Eyebrow>
                <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
                  A weekly note from the loom
                </h3>
                <p className="mt-3 max-w-[45ch] text-sm leading-relaxed text-neutral-600">
                  One weave, one maker, one thing worth knowing. No marketing
                  noise, no newsletters-that-are-really-sales-pitches.
                  Unsubscribe anytime.
                </p>
                <form
                  className="mt-6 flex flex-col gap-3"
                  action="/api/newsletter"
                  method="post"
                >
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="font-body focus:border-brand-500 h-12 flex-1 rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-900 transition-colors outline-none placeholder:text-neutral-400"
                  />
                  <button
                    type="submit"
                    className="bg-brand-600 font-display hover:bg-brand-700 focus-visible:ring-brand-400 inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="mt-4 text-xs text-neutral-400">
                  No spam. One email a week. Unsubscribe in one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
