/**
 * Publish All Draft Agents
 *
 * Changes agent status from draft to published
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  console.log('🔧 Initializing Payload CMS...')
  const payload = await getPayload({ 
    config,
    disableDBConnect: false,
  })
  console.log('✅ Payload CMS initialized\n')

  try {
    // Fetch all draft agents
    console.log('📊 Fetching draft agents...')
    const agents = await payload.find({
      collection: 'agents',
      limit: 1000,
      where: {
        _status: {
          equals: 'draft',
        },
      },
    })

    console.log(`Found ${agents.docs.length} draft agent(s)\n`)

    if (agents.docs.length === 0) {
      console.log('✅ No draft agents to publish.')
      process.exit(0)
    }

    let successCount = 0
    let errorCount = 0

    for (const agent of agents.docs) {
      try {
        console.log(`📤 Publishing: ${agent.name || agent.displayName || 'Unknown'} (${agent.slug})...`)
        
        await payload.update({
          collection: 'agents',
          id: agent.id,
          data: {
            _status: 'published',
          },
        })

        console.log(`   ✅ Published successfully!`)
        successCount++
      } catch (error: any) {
        console.error(`   ❌ Failed to publish: ${error.message}`)
        errorCount++
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('📈 Summary:')
    console.log(`   ✅ Successfully published: ${successCount}`)
    console.log(`   ❌ Failed: ${errorCount}`)
    console.log(`   📊 Total processed: ${agents.docs.length}`)
    console.log('═══════════════════════════════════════════════════════════════')

    if (successCount > 0) {
      console.log('\n💡 Next step: Run the California block link update script:')
      console.log('   npx tsx scripts/update-california-block-links.ts')
    }
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }

  process.exit(0)
}

main()
