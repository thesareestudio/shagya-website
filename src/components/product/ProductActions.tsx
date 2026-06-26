'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCart } from '@/lib/store/cart'
import { ShoppingCart, Bolt, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'

interface ProductActionsProps {
  product: {
    id: number | string
    name: string
    slug: string
    basePrice: number
    compareAtPrice?: number
    gallery?: Array<{ image: any; alt?: string }>
    fabric: string
    weave: string
  }
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addItem } = useCart()
  const router = useRouter()
  const { data: session } = useSession()
  const [size, setSize] = useState('Standard (Free Size)')
  const [blouseSize, setBlouseSize] = useState('Unstitched')
  const [added, setAdded] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Check wishlist status on mount
  useEffect(() => {
    if (!session?.user) return
    async function checkWishlist() {
      try {
        const res = await fetch('/api/wishlist')
        if (res.ok) {
          const data = await res.json()
          const items = data.items || []
          setInWishlist(
            items.some(
              (item: any) =>
                String(item.product?.id || item.product) === String(product.id),
            ),
          )
        }
      } catch {}
    }
    checkWishlist()
  }, [session?.user, product.id])

  const handleToggleWishlist = useCallback(async () => {
    if (!session?.user) {
      router.push(
        `/account/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }
    setWishlistLoading(true)
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: String(product.id) }),
      })
      if (res.ok) {
        const data = await res.json()
        setInWishlist(data.message === 'Product added to wishlist')
      }
    } catch {
    } finally {
      setWishlistLoading(false)
    }
  }, [session?.user, product.id, router])

  const handleAddToCart = () => {
    addItem(product, 1, { size, blouseSize })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addItem(product, 1, { size, blouseSize })
    router.push('/checkout')
  }

  return (
    <div className="space-y-6">
      {/* Saree Size (most are standard free size but can override) */}
      <div>
        <span className="font-display text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          Saree Size
        </span>
        <div className="mt-2.5 flex gap-2">
          {['Standard (Free Size)', '5.5 Meters', '6.0 Meters (+₹600)'].map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`font-body rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                  size === s
                    ? 'border-brand-600 bg-brand-50/50 text-brand-700'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                }`}
              >
                {s}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Blouse Stitching */}
      <div>
        <span className="font-display text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          Blouse Stitching
        </span>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {[
            'Unstitched',
            'Stitched: XS',
            'Stitched: S',
            'Stitched: M',
            'Stitched: L',
            'Stitched: XL',
          ].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBlouseSize(b)}
              className={`font-body rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all ${
                blouseSize === b
                  ? 'border-brand-600 bg-brand-50/50 text-brand-700'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <p className="font-body mt-2 text-[11px] text-neutral-400">
          Stitching takes an additional 3-5 days. Standard unstitched blouse
          piece is included.
        </p>
      </div>

      {/* Wishlist */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistLoading}
          className={`font-display flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all active:scale-95 ${
            inWishlist
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
          }`}
          aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`h-4.5 w-4.5 ${
              inWishlist ? 'fill-red-500 text-red-500' : ''
            }`}
          />
          {inWishlist ? 'Saved' : 'Add to Wishlist'}
        </button>
      </div>

      {/* Primary Actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={handleAddToCart}
          className={`font-display flex h-13 items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-xs transition-all active:scale-95 ${
            added
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
          }`}
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>

        <button
          onClick={handleBuyNow}
          className="bg-brand-600 hover:bg-brand-700 font-display flex h-13 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-xs transition-all active:scale-95"
        >
          <Bolt className="h-4.5 w-4.5" />
          Buy Now
        </button>
      </div>
    </div>
  )
}
