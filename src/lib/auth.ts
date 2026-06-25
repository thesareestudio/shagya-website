import { betterAuth } from 'better-auth'
import { passkey } from '@better-auth/passkey'
import { phoneNumber, twoFactor, magicLink } from 'better-auth/plugins'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-change-in-production',
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
    },
  },
  // When a user registers, create a corresponding Customer record in Payload.
  // Uses dynamic import to avoid circular dependencies with Payload config.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const { syncCustomer } = await import('./auth-sync')
          await syncCustomer(user)
        },
      },
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: ({ phoneNumber, code }) => {
        // Stub implementation — real SMS integration comes in CLO-35
        console.log(`[Auth OTP] Sending code ${code} to ${phoneNumber}`)
        return Promise.resolve()
      },
    }),
    twoFactor({
      issuer: 'Shagya',
      backupCodeOptions: {
        amount: 8,
      },
    }),
    passkey({
      rpName: 'Shagya',
      rpID: process.env.NEXT_PUBLIC_SERVER_URL
        ? new URL(process.env.NEXT_PUBLIC_SERVER_URL).hostname
        : 'localhost',
      origin: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Stub — real email integration in CLO-34
        console.log(`[Auth Magic Link] Sending to ${email}: ${url}`)
      },
    }),
  ],
})
