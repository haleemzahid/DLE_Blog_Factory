/**
 * Update California Block Links
 *
 * Auto-generates proper links in California blocks based on existing agents
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  console.log('🔧 Initializing Payload CMS...')
  const payload = await getPayload({ config })
  console.log('✅ Payload CMS initialized\n')

  try {
    // Fetch all agents
    console.log('📊 Fetching all agents...')
    const agents = await payload.find({
      collection: 'agents',
      limit: 1000,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    console.log(`✅ Found ${agents.docs.length} published agents\n`)

    // Create maps for Mr. and Ms. agents
    const mrAgentsMap = new Map<string, string>()
    const msAgentsMap = new Map<string, string>()

    agents.docs.forEach((agent) => {
      const city = agent.designationCity || agent.city
      const slug = agent.slug
      const prefix = agent.designationPrefix

      if (!city || !slug) return

      if (prefix === 'Mr.') {
        const title = `Mr. ${city}™`
        mrAgentsMap.set(title, `/agents/${slug}`)
      } else if (prefix === 'Ms.') {
        const title = `Ms. ${city}™`
        msAgentsMap.set(title, `/agents/${slug}`)
      }
    })

    console.log(`📍 Mr. Cities with agents: ${mrAgentsMap.size}`)
    console.log(`📍 Ms. Cities with agents: ${msAgentsMap.size}\n`)

    // Find all pages with California blocks
    console.log('🔍 Finding pages with California blocks...')
    const pages = await payload.find({
      collection: 'pages',
      limit: 1000,
    })

    let updatedCount = 0

    for (const page of pages.docs) {
      let hasCaliforniaBlock = false
      let needsUpdate = false

      // Check if page has California blocks
      if (page.layout && Array.isArray(page.layout)) {
        for (const block of page.layout) {
          if (block.blockType === 'california') {
            hasCaliforniaBlock = true

            // Update Mr. Designations
            if (block.mrDesignations && Array.isArray(block.mrDesignations)) {
              block.mrDesignations = block.mrDesignations.map((designation: any) => {
                const title = designation.title
                if (mrAgentsMap.has(title)) {
                  const newLink = mrAgentsMap.get(title)
                  if (designation.link !== newLink) {
                    needsUpdate = true
                    return { ...designation, link: newLink }
                  }
                }
                return designation
              })
            }

            // Update Ms. Designations
            if (block.msDesignations && Array.isArray(block.msDesignations)) {
              block.msDesignations = block.msDesignations.map((designation: any) => {
                const title = designation.title
                if (msAgentsMap.has(title)) {
                  const newLink = msAgentsMap.get(title)
                  if (designation.link !== newLink) {
                    needsUpdate = true
                    return { ...designation, link: newLink }
                  }
                }
                return designation
              })
            }
          }
        }
      }

      // Update the page if needed
      if (hasCaliforniaBlock && needsUpdate) {
        try {
          await payload.update({
            collection: 'pages',
            id: page.id,
            data: {
              layout: page.layout,
            },
          })
          updatedCount++
          console.log(`✅ Updated: ${page.title || page.slug}`)
        } catch (error) {
          console.error(`❌ Error updating page ${page.id}:`, error)
        }
      }
    }

    console.log(`\n✨ Done! Updated ${updatedCount} page(s) with California blocks.`)

    if (updatedCount === 0) {
      console.log('\n💡 No pages needed updates. This could mean:')
      console.log('   1. No pages have California blocks')
      console.log('   2. All links are already up to date')
      console.log('   3. No matching agents found for the cities')
    }

    // Show sample mappings
    console.log('\n📋 Sample agent mappings:')
    let count = 0
    for (const [title, link] of mrAgentsMap.entries()) {
      if (count < 5) {
        console.log(`   ${title} → ${link}`)
        count++
      }
    }
    for (const [title, link] of msAgentsMap.entries()) {
      if (count < 10) {
        console.log(`   ${title} → ${link}`)
        count++
      }
    }
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
