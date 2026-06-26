'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Check,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react'

interface Address {
  id: string
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const { data: sessionData, isPending } = useSession()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  // Form states
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [isDefaultAddress, setIsDefaultAddress] = useState(false)

  // Load addresses
  useEffect(() => {
    if (isPending) return
    if (!sessionData?.user) {
      router.push('/account/login?redirect=/account/addresses')
      return
    }

    async function loadAddresses() {
      try {
        const res = await fetch('/api/addresses')
        if (res.ok) {
          const data = await res.json()
          setAddresses(data.addresses || [])
        }
      } catch (err) {
        console.error('Failed to load addresses', err)
      } finally {
        setLoading(false)
      }
    }

    loadAddresses()
  }, [sessionData, isPending, router])

  const openAddForm = () => {
    setEditingAddress(null)
    setFullName('')
    setPhone('')
    setLine1('')
    setLine2('')
    setCity('')
    setState('')
    setPincode('')
    setIsDefaultAddress(false)
    setShowForm(true)
    setError('')
  }

  const openEditForm = (addr: Address) => {
    setEditingAddress(addr)
    setFullName(addr.fullName)
    setPhone(addr.phone)
    setLine1(addr.line1)
    setLine2(addr.line2 || '')
    setCity(addr.city)
    setState(addr.state)
    setPincode(addr.pincode)
    setIsDefaultAddress(addr.isDefault)
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setError('')

    const url = editingAddress
      ? `/api/addresses/${editingAddress.id}`
      : '/api/addresses'
    const method = editingAddress ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          line1,
          line2,
          city,
          state,
          pincode,
          isDefault: isDefaultAddress,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save address')
      }

      // Reload address list
      const listRes = await fetch('/api/addresses')
      if (listRes.ok) {
        const data = await listRes.json()
        setAddresses(data.addresses || [])
      }

      setShowForm(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save address')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    setActionLoading(true)

    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete address')
      }

      setAddresses(addresses.filter((a) => a.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete address')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSetDefault = async (addr: Address) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/addresses/${addr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addr,
          isDefault: true,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update default address')
      }

      // Reload address list
      const listRes = await fetch('/api/addresses')
      if (listRes.ok) {
        const data = await listRes.json()
        setAddresses(data.addresses || [])
      }
    } catch (err: any) {
      alert(err.message || 'Failed to set default')
    } finally {
      setActionLoading(false)
    }
  }

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-brand-600 h-8 w-8 animate-spin" />
        <p className="font-body text-sm text-neutral-500">
          Loading your address manager...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation / Header */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-6">
          <div>
            <Link
              href="/account"
              className="font-display hover:text-brand-700 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </Link>
            <h1 className="font-display mt-2 text-2xl font-bold text-neutral-900">
              Saved Addresses
            </h1>
          </div>
          {!showForm && (
            <button
              onClick={openAddForm}
              className="font-display bg-brand-600 hover:bg-brand-700 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </button>
          )}
        </div>

        {/* Address Form (Add / Edit) */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs">
            <h3 className="font-display mb-6 text-sm font-semibold tracking-wider text-neutral-900 uppercase">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-display mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="font-body focus:border-brand-500 h-10 w-full rounded-xl border border-neutral-200 pl-3 text-sm outline-none"
                    placeholder="Aarav Sharma"
                  />
                </div>
                <div>
                  <label className="font-display mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="font-body focus:border-brand-500 h-10 w-full rounded-xl border border-neutral-200 pl-3 text-sm outline-none"
                    placeholder="98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="font-display mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Address Line 1
                </label>
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="font-body focus:border-brand-500 h-10 w-full rounded-xl border border-neutral-200 pl-3 text-sm outline-none"
                  placeholder="House/Flat No., Street, Locality"
                />
              </div>

              <div>
                <label className="font-display mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="font-body focus:border-brand-500 h-10 w-full rounded-xl border border-neutral-200 pl-3 text-sm outline-none"
                  placeholder="Landmark, Suite, etc."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="font-display mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="font-body focus:border-brand-500 h-10 w-full rounded-xl border border-neutral-200 pl-3 text-sm outline-none"
                    placeholder="Varanasi"
                  />
                </div>
                <div>
                  <label className="font-display mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="font-body focus:border-brand-500 h-10 w-full rounded-xl border border-neutral-200 pl-3 text-sm outline-none"
                    placeholder="Uttar Pradesh"
                  />
                </div>
                <div>
                  <label className="font-display mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    pattern="^[1-9][0-9]{5}$"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="font-body focus:border-brand-500 h-10 w-full rounded-xl border border-neutral-200 pl-3 text-sm outline-none"
                    placeholder="221001"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefaultAddress}
                  onChange={(e) => setIsDefaultAddress(e.target.checked)}
                  className="accent-brand-600 animate-fade-in rounded border-neutral-300"
                />
                <label
                  htmlFor="isDefault"
                  className="font-body text-xs text-neutral-600"
                >
                  Set as default shipping address
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="font-display h-10 rounded-xl border border-neutral-200 px-4 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="font-display bg-brand-600 hover:bg-brand-700 inline-flex h-10 items-center gap-1.5 rounded-xl px-5 text-xs font-semibold text-white transition-all"
                >
                  {actionLoading && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {editingAddress ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Addresses list */}
        {addresses.length === 0 ? (
          <div className="rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-xs">
            <MapPin className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
            <p className="font-body text-sm text-neutral-500">
              You haven&apos;t added any addresses yet.
            </p>
            <button
              onClick={openAddForm}
              className="font-display text-brand-700 hover:text-brand-800 mt-4 text-xs font-semibold underline"
            >
              Add your first shipping address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`relative rounded-2xl border bg-white p-5 shadow-xs transition-all ${
                  addr.isDefault ? 'border-brand-600' : 'border-neutral-200'
                }`}
              >
                {addr.isDefault && (
                  <span className="bg-brand-50 text-brand-700 border-brand-100 font-display absolute top-4 right-4 flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
                    <Check className="h-3 w-3" />
                    Default
                  </span>
                )}

                <h3 className="font-display text-sm font-semibold text-neutral-900">
                  {addr.fullName}
                </h3>
                <p className="font-body mt-1 text-xs text-neutral-500">
                  {addr.phone}
                </p>
                <p className="font-body mt-3 text-xs leading-relaxed text-neutral-600">
                  {addr.line1}
                  {addr.line2 && <span className="block">{addr.line2}</span>}
                  <span className="block">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </span>
                </p>

                <div className="font-display mt-4 flex gap-4 border-t border-neutral-100 pt-4 text-xs">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-brand-700 hover:text-brand-800 font-semibold"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => openEditForm(addr)}
                    className="inline-flex items-center gap-1 font-semibold text-neutral-500 hover:text-neutral-700"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="ml-auto inline-flex items-center gap-1 font-semibold text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
