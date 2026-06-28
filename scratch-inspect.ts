import { getPayload } from 'payload'
import config from './src/payload.config'
async function run() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'search',
    limit: 1,
    depth: 2,
  })
  console.log(JSON.stringify(result.docs[0], null, 2))
  process.exit(0)
}
run()
