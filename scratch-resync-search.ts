import { getPayload } from 'payload'
import config from './src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    limit: 1000,
  })

  let count = 0
  for (const product of products.docs) {
    await payload.update({
      collection: 'products',
      id: product.id,
      data: product, // This triggers the hooks, including the Search plugin's sync
    })
    count++
  }

  console.log(`Synced ${count} products to search index.`)

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
  })

  let postCount = 0
  for (const post of posts.docs) {
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: post,
    })
    postCount++
  }

  console.log(`Synced ${postCount} posts to search index.`)

  process.exit(0)
}
run()
