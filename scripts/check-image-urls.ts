/**
 * Debug script to check what image URLs are stored in the database
 * Run this with: pnpm check:image-urls
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function checkImageUrls() {
  console.log('🔍 Checking image URLs in database...\n')

  const payload = await getPayload({ config })

  // Fetch a few posts with their images
  const posts = await payload.find({
    collection: 'posts',
    limit: 5,
    depth: 2, // Populate heroImage fully
    where: {
      heroImage: {
        exists: true,
      },
    },
  })

  console.log(`Found ${posts.docs.length} posts with hero images\n`)

  posts.docs.forEach((post, index) => {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📄 Post ${index + 1}: "${post.title}"`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

    if (post.heroImage && typeof post.heroImage === 'object') {
      const img = post.heroImage
      console.log(`\n🖼️  Hero Image Data:`)
      console.log(`   ID: ${img.id}`)
      console.log(`   Filename: ${img.filename}`)
      console.log(`   URL: ${img.url}`)
      console.log(`   Width: ${img.width}`)
      console.log(`   Height: ${img.height}`)
      console.log(`   MimeType: ${img.mimeType}`)
      console.log(`   UpdatedAt: ${img.updatedAt}`)

      // Check if URL is relative or absolute
      if (img.url) {
        if (img.url.startsWith('http://') || img.url.startsWith('https://')) {
          console.log(`   ✅ URL Type: Absolute (Vercel Blob)`)
        } else if (img.url.startsWith('/')) {
          console.log(`   ⚠️  URL Type: Relative (Local storage)`)
        } else {
          console.log(`   ❓ URL Type: Unknown format`)
        }
      } else {
        console.log(`   ❌ URL is NULL or undefined!`)
      }

      // Check sizes
      if (img.sizes) {
        console.log(`\n   📐 Available Sizes:`)
        Object.keys(img.sizes).forEach((size) => {
          const sizeData = img.sizes![size as keyof typeof img.sizes]
          if (sizeData?.url) {
            console.log(`      - ${size}: ${sizeData.url}`)
          }
        })
      }
    } else {
      console.log(`   ❌ Hero image not populated or is just an ID: ${post.heroImage}`)
    }
  })

  console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Check complete!`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  process.exit(0)
}

checkImageUrls().catch((error) => {
  console.error('❌ Error checking image URLs:', error)
  process.exit(1)
})
