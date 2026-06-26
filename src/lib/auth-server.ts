import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireCustomer() {
  const session = await getSession()
  if (!session?.user) {
    redirect('/account/login')
  }
  return session
}
