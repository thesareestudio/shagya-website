import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, RefreshCw, ShieldCheck, Truck } from 'lucide-react'
import { ProductActions } from '@/components/product/ProductActions'
import { ProductGallery } from '@/components/product/ProductGallery'

const ph = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(text)}&font=lora`

function LexicalRenderer({ content }: { content: any }) {
  if (!content || !content.root || !Array.isArray(content.root.children)) {
    return null
  }
  return (
    <div className="font-body space-y-4 text-sm leading-relaxed text-neutral-600">
      {content.root.children.map((block: any, idx: number) => {
        if (block.type === 'paragraph' && Array.isArray(block.children)) {
          return (
            <p key={idx}>
              {block.children.map((node: any, nIdx: number) => {
                if (node.type === 'text') {
                  return node.text
                }
                return null
              })}
            </p>
          )
        }
        return null
      })}
    </div>
  )
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  if (result.docs.length === 0) {
    return notFound()
  }

  const product = result.docs[0]

  // Resolve cover image and thumbnail URLs
  const imageUrls =
    product.gallery && product.gallery.length > 0
      ? product.gallery.map((g: any) =>
          typeof g.image === 'object' && g.image !== null
            ? g.image.url
            : '/images/placeholder.jpg',
        )
      : [ph(1200, 1500, '69254e', 'f5e8ee', product.name)]

  // Construct a minimal product representation for client store
  const serializableProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug || '',
    basePrice: product.basePrice,
    compareAtPrice: product.compareAtPrice || undefined,
    gallery: product.gallery?.map((g: any) => ({
      image:
        typeof g.image === 'object' && g.image !== null
          ? { url: g.image.url, sizes: g.image.sizes }
          : g.image,
      alt: g.alt || product.name,
    })),
    fabric: product.fabric,
    weave: product.weave,
  }

  return (
    <div className="bg-surface min-h-screen py-10 md:py-16">
      <div className="container-page">
        {/* Back Link */}
        <Link
          href={`/category/${product.fabric}`}
          className="font-display hover:text-brand-700 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to{' '}
          {product.fabric.charAt(0).toUpperCase() +
            product.fabric.slice(1)}{' '}
          Sarees
        </Link>

        {/* Core PDP Grid */}
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery imageUrls={imageUrls} productName={product.name} />
          </div>
          {/* Right Column: Meta & Actions */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              {/* Region and Cluster */}
              <div className="flex items-center gap-2">
                <span className="bg-gold-50 text-gold-700 font-display rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase">
                  {product.weave} Weave
                </span>
                <span className="text-neutral-300">·</span>
                <span className="font-body text-xs font-medium text-neutral-500">
                  {product.occasion || 'Traditional Craft'}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="mt-5 flex items-baseline gap-3 border-b border-neutral-100 pb-6">
                <span className="font-display text-2xl font-semibold text-neutral-900">
                  ₹{product.basePrice.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice &&
                  product.compareAtPrice > product.basePrice && (
                    <>
                      <span className="font-display text-sm text-neutral-400 line-through">
                        ₹{product.compareAtPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="font-display text-xs font-semibold text-green-600">
                        (
                        {Math.round(
                          ((product.compareAtPrice - product.basePrice) /
                            product.compareAtPrice) *
                            100,
                        )}
                        % OFF)
                      </span>
                    </>
                  )}
              </div>

              {/* Actions component */}
              <div className="mt-8">
                <ProductActions product={serializableProduct} />
              </div>
            </div>

            {/* TrustStrip */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-neutral-100 pt-8 text-center text-[11px] text-neutral-500">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-brand-50 text-brand-700 flex h-9 w-9 items-center justify-center rounded-full">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <span className="font-display font-semibold text-neutral-800">
                  Handloom Verified
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-brand-50 text-brand-700 flex h-9 w-9 items-center justify-center rounded-full">
                  <Truck className="h-4.5 w-4.5" />
                </div>
                <span className="font-display font-semibold text-neutral-800">
                  Free India Shipping
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-brand-50 text-brand-700 flex h-9 w-9 items-center justify-center rounded-full">
                  <RefreshCw className="h-4.5 w-4.5" />
                </div>
                <span className="font-display font-semibold text-neutral-800">
                  7-Day Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Specs Section */}
        <div className="mt-16 border-t border-neutral-200 pt-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left: Weave Story */}
            <div className="lg:col-span-7">
              <h3 className="font-display border-b border-neutral-100 pb-3 text-lg font-semibold text-neutral-900">
                The Weave Story
              </h3>
              <div className="mt-5">
                <LexicalRenderer content={product.description} />
              </div>
            </div>

            {/* Right: Technical Specifications */}
            <div className="lg:col-span-5">
              <h3 className="font-display border-b border-neutral-100 pb-3 text-lg font-semibold text-neutral-900">
                Specifications
              </h3>
              <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <table className="font-body w-full border-collapse text-left text-xs text-neutral-600">
                  <tbody className="divide-y divide-neutral-100">
                    <tr className="hover:bg-neutral-50/50">
                      <td className="w-1/3 px-4 py-3.5 font-medium text-neutral-400">
                        Fabric
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-neutral-800 capitalize">
                        {product.fabric}
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3.5 font-medium text-neutral-400">
                        Weave Style
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-neutral-800 capitalize">
                        {product.weave}
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50/50">
                      <td className="px-4 py-3.5 font-medium text-neutral-400">
                        Length
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-neutral-800">
                        {product.length || '5.5'} Metres
                      </td>
                    </tr>
                    {product.blouseType && (
                      <tr className="hover:bg-neutral-50/50">
                        <td className="px-4 py-3.5 font-medium text-neutral-400">
                          Blouse Piece
                        </td>
                        <td className="px-4 py-3.5 text-neutral-800">
                          {product.blouseType}
                        </td>
                      </tr>
                    )}
                    {product.palluDetails && (
                      <tr className="hover:bg-neutral-50/50">
                        <td className="px-4 py-3.5 font-medium text-neutral-400">
                          Pallu details
                        </td>
                        <td className="px-4 py-3.5 text-neutral-800">
                          {product.palluDetails}
                        </td>
                      </tr>
                    )}
                    {product.borderType && (
                      <tr className="hover:bg-neutral-50/50">
                        <td className="px-4 py-3.5 font-medium text-neutral-400">
                          Border
                        </td>
                        <td className="px-4 py-3.5 text-neutral-800">
                          {product.borderType}
                        </td>
                      </tr>
                    )}
                    {product.weavePattern && (
                      <tr className="hover:bg-neutral-50/50">
                        <td className="px-4 py-3.5 font-medium text-neutral-400">
                          Weave technique
                        </td>
                        <td className="px-4 py-3.5 text-neutral-800">
                          {product.weavePattern}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
