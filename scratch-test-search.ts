import { getPayload } from 'payload'
import config from './src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'search', limit: 1 })
  console.log('Search docs count:', result.totalDocs)
  process.exit(0)
}
run()
