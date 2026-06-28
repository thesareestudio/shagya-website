import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })
  const media = await payload.find({
    collection: 'media',
    limit: 100,
  })
  console.log(`Total media: ${media.totalDocs}`)
  media.docs.forEach((doc) => {
    if (doc.filename && doc.filename.includes('saree-14')) {
      console.log(`Found: ${doc.filename}, ID: ${doc.id}`)
    }
  })
  process.exit(0)
}
run()
