import { getPayload } from 'payload'
import config from './src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  try {
    const res = await payload.db.drizzle.execute(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_secret varchar;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS has_totp boolean;
    `)
    console.log('Altered users table:', res)
  } catch (e) {
    console.error('Failed to alter:', e)
  }
  process.exit(0)
}
run()
