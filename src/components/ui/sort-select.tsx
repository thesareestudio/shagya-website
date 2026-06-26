'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

export function SortSelect({
  defaultValue,
  preserveParams = '',
}: {
  defaultValue: string
  preserveParams?: string
}) {
  const router = useRouter()

  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        onChange={(e) => {
          const sort = `sort=${e.target.value}`
          const qs = preserveParams ? `?${sort}&${preserveParams}` : `?${sort}`
          router.push(qs)
        }}
        className="font-body focus:border-brand-500 h-9 appearance-none rounded-lg border border-neutral-200 bg-white pr-8 pl-3 text-xs text-neutral-800 outline-none select-none"
      >
        <option value="newest">Newest Arrivals</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
    </div>
  )
}
