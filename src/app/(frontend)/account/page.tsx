'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  ArrowRight,
  Loader2,
  Calendar,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
}

interface Address {
  id: string
  fullName: string
  line1: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function AccountDashboardPage() {
  const router = useRouter()
  const { data: sessionData, isPending } = useSession()

  const [orders, setOrders] = useState<Order[]>([])
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (isPending) return
    if (!sessionData?.user) {
      router.push('/account/login')
      return
    }

    async function loadDashboardData() {
      try {
        const [ordersRes, addrRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/addresses'),
        ])

        if (ordersRes.ok) {
          const oData = await ordersRes.json()
          setOrders(oData.orders?.slice(0, 3) || []) // show last 3 orders
        }

        if (addrRes.ok) {
          const aData = await addrRes.json()
          const defAddr = aData.addresses?.find((a: Address) => a.isDefault)
          setDefaultAddress(defAddr || aData.addresses?.[0] || null)
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoadingData(false)
      }
    }

    loadDashboardData()
  }, [sessionData, isPending, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/account/login')
  }

  if (isPending || loadingData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-brand-600 h-8 w-8 animate-spin" />
        <p className="font-body text-sm text-neutral-500">
          Loading your profile dashboard...
        </p>
      </div>
    )
  }

  const user = sessionData?.user

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Dashboard Title & Welcome */}
        <div className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-display text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Customer Area
            </span>
            <h1 className="font-display mt-1 text-3xl font-bold text-neutral-900">
              Namaste, {user?.name}
            </h1>
            <p className="font-body mt-1 text-sm text-neutral-500">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="font-display inline-flex items-center gap-2 self-start rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 sm:self-center"
          >
            <LogOut className="h-3.5 w-3.5 text-neutral-400" />
            Sign Out
          </button>
        </div>

        {/* Dashboard Hub Navigation Cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            href="/account/orders"
            className="hover:border-brand-300 group rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs transition-all"
          >
            <div className="bg-brand-50 text-brand-700 mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="font-display flex items-center justify-between text-sm font-semibold text-neutral-900">
              Order History
              <ArrowRight className="group-hover:text-brand-600 h-4 w-4 text-neutral-300 transition-colors" />
            </h3>
            <p className="font-body mt-2 text-xs text-neutral-500">
              Review and track your saree dispatches, invoices, and details.
            </p>
          </Link>

          <Link
            href="/account/addresses"
            className="hover:border-brand-300 group rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs transition-all"
          >
            <div className="bg-brand-50 text-brand-700 mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-display flex items-center justify-between text-sm font-semibold text-neutral-900">
              Addresses
              <ArrowRight className="group-hover:text-brand-600 h-4 w-4 text-neutral-300 transition-colors" />
            </h3>
            <p className="font-body mt-2 text-xs text-neutral-500">
              Manage your delivery addresses and set defaults for quick
              checkout.
            </p>
          </Link>

          <Link
            href="/wishlist"
            className="hover:border-brand-300 group rounded-2xl border border-neutral-100 bg-white p-6 shadow-xs transition-all"
          >
            <div className="bg-brand-50 text-brand-700 mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-display flex items-center justify-between text-sm font-semibold text-neutral-900">
              Wishlist
              <ArrowRight className="group-hover:text-brand-600 h-4 w-4 text-neutral-300 transition-colors" />
            </h3>
            <p className="font-body mt-2 text-xs text-neutral-500">
              Save your favorite handlooms, weaves, and patterns for later.
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Recent Orders Section */}
          <div className="space-y-4 lg:col-span-8">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display flex items-center gap-2 text-lg font-semibold text-neutral-900">
                <ShoppingBag className="text-brand-600 h-5 w-5" />
                Recent Orders
              </h2>
              {orders.length > 0 && (
                <Link
                  href="/account/orders"
                  className="font-display text-brand-700 hover:text-brand-800 text-xs font-semibold underline"
                >
                  View All
                </Link>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-xs">
                <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
                <p className="font-body text-sm text-neutral-500">
                  You haven&apos;t placed any orders yet.
                </p>
                <Link
                  href="/"
                  className="font-display text-brand-700 hover:text-brand-800 mt-4 inline-flex items-center gap-1.5 text-xs font-semibold underline"
                >
                  Start Exploring masterpieces
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-semibold text-neutral-900">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`font-display rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            order.status === 'confirmed' ||
                            order.status === 'delivered'
                              ? 'border border-green-100 bg-green-50 text-green-700'
                              : order.status === 'cancelled'
                                ? 'border border-red-100 bg-red-50 text-red-700'
                                : 'border border-yellow-100 bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="font-body flex items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                          {new Date(order.createdAt).toLocaleDateString(
                            'en-IN',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-neutral-400" />
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/account/orders`}
                      className="font-display text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 self-start rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold transition-all hover:bg-neutral-50 sm:self-center"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Default Address */}
          <div className="space-y-4 lg:col-span-4">
            <h2 className="font-display mb-2 flex items-center gap-2 text-lg font-semibold text-neutral-900">
              <MapPin className="text-brand-600 h-5 w-5" />
              Primary Address
            </h2>

            <div className="relative rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs">
              {defaultAddress ? (
                <div>
                  <p className="font-display text-sm font-semibold text-neutral-900">
                    {defaultAddress.fullName}
                  </p>
                  <p className="font-body mt-2 text-xs leading-relaxed text-neutral-600">
                    {defaultAddress.line1}
                    <br />
                    {defaultAddress.city}, {defaultAddress.state} -{' '}
                    {defaultAddress.pincode}
                  </p>
                  <Link
                    href="/account/addresses"
                    className="font-display text-brand-700 hover:text-brand-800 mt-4 inline-flex items-center gap-1.5 text-xs font-semibold underline"
                  >
                    Edit Addresses
                  </Link>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <MapPin className="mx-auto mb-2 h-6 w-6 text-neutral-300" />
                  <p className="font-body text-xs text-neutral-500">
                    No addresses saved yet.
                  </p>
                  <Link
                    href="/account/addresses"
                    className="font-display text-brand-700 hover:text-brand-800 mt-3 inline-flex items-center gap-1.5 text-xs font-semibold underline"
                  >
                    Add Address
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
