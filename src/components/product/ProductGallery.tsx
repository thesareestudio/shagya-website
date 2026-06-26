'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  imageUrls: string[]
  productName: string
}

export function ProductGallery({
  imageUrls,
  productName,
}: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="font-body relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 text-sm text-neutral-400 shadow-sm">
        No images available
      </div>
    )
  }

  const activeUrl = imageUrls[activeIdx] || '/images/placeholder.jpg'

  return (
    <div className="flex flex-col gap-4">
      {/* Main Preview Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm transition-all duration-300">
        <Image
          src={activeUrl}
          alt={productName}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          unoptimized={activeUrl.startsWith('https://placehold.co')}
        />
        {/* subtle border overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-neutral-900/5" />
      </div>

      {/* Thumbnails if multiple images exist */}
      {imageUrls.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {imageUrls.map((url, idx) => {
            const isActive = idx === activeIdx
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`focus-visible:ring-gold-500 relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl bg-neutral-50 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isActive
                    ? 'ring-gold-500 scale-[0.98] border-transparent ring-2 ring-offset-1'
                    : 'border border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={url.startsWith('https://placehold.co')}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
