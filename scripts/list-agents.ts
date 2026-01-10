/**
 * List All Agents
 *
 * Shows all agents currently in the database
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
    const agents = await payload.find({
      collection: 'agents',
      limit: 1000,
      sort: 'city',
    })

    console.log(`📊 Total Agents: ${agents.totalDocs}\n`)

    if (agents.docs.length === 0) {
      console.log('❌ No agents found in the database.')
      console.log('\n💡 To add agents, run:')
      console.log('   npx tsx scripts/add-california-agents.ts')
    } else {
      console.log('📋 Agent List:\n')
      console.log('═══════════════════════════════════════════════════════════════')

      agents.docs.forEach((agent, index) => {
        console.log(`${index + 1}. ${agent.name || 'N/A'}`)
        console.log(`   Display Name: ${agent.displayName || 'N/A'}`)
        console.log(`   City: ${agent.city || 'N/A'}`)
        console.log(
          `   State: ${typeof agent.state === 'object' ? agent.state.name : agent.state || 'N/A'}`,
        )
        console.log(`   Email: ${agent.email || 'N/A'}`)
        console.log(`   Phone: ${agent.phone || 'N/A'}`)
        console.log(`   Slug: ${agent.slug || 'N/A'}`)
        console.log(`   Designation: ${agent.fullDesignation || agent.designationPrefix || 'N/A'}`)
        console.log(`   Status: ${agent._status || 'N/A'}`)
        console.log('───────────────────────────────────────────────────────────────')
      })

      // Group by status
      const published = agents.docs.filter((a) => a._status === 'published')
      const draft = agents.docs.filter((a) => a._status === 'draft')

      console.log('\n📈 Summary:')
      console.log(`   Published: ${published.length}`)
      console.log(`   Draft: ${draft.length}`)
      console.log(`   Total: ${agents.totalDocs}`)

      // Group by city
      const cityCounts = new Map<string, number>()
      agents.docs.forEach((agent) => {
        const city = agent.city || 'Unknown'
        cityCounts.set(city, (cityCounts.get(city) || 0) + 1)
      })

      console.log('\n🌆 By City:')
      Array.from(cityCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([city, count]) => {
          console.log(`   ${city}: ${count}`)
        })
    }
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
