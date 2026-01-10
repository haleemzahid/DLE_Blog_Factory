/**
 * Import City Data from Existing Agents
 *
 * This script creates CityData entries from existing California agents
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  console.log('🔧 Initializing Payload CMS...')
  const payload = await getPayload({ config })
  console.log('✅ Payload CMS initialized\n')

  try {
    // Get all California agents
    console.log('📋 Fetching California agents...')
    const agents = await payload.find({
      collection: 'agents',
      limit: 2000,
      depth: 1,
    })

    console.log(`Found ${agents.docs.length} agents\n`)

    // Debug: Show first few agents
    console.log('Sample agents:')
    agents.docs.slice(0, 5).forEach(agent => {
      console.log(`  - ${agent.designationTitle} (${agent.name})`)
    })
    console.log()

    // Filter for California agents (those with designationTitle containing "California" or Mr./Ms.)
    const californiaAgents = agents.docs.filter(agent => {
      const title = agent.designationTitle || ''
      const name = agent.name || ''
      return title.includes('California') || title.includes('Mr.') || title.includes('Ms.') || 
             name.includes('California') || name.includes('Mr.') || name.includes('Ms.')
    })

    console.log(`Found ${californiaAgents.length} California agents\n`)

    let imported = 0
    let skipped = 0
    let errors = 0

    for (const agent of californiaAgents) {
      try {
        // Extract city name from designation title
        // Examples: "Mr. Claremont™" -> "Claremont", "Ms. Los Angeles™" -> "Los Angeles"
        const title = agent.designationTitle || ''
        const cityMatch = title.match(/(?:Mr\.|Ms\.)\s+(.+?)™?$/i)
        
        if (!cityMatch) {
          console.log(`⚠️  Skipping: Could not extract city from "${title}"`)
          skipped++
          continue
        }

        const cityName = cityMatch[1].trim()

        // Check if city already exists
        const existing = await payload.find({
          collection: 'cityData',
          where: {
            cityName: {
              equals: cityName
            }
          },
          limit: 1
        })

        if (existing.docs.length > 0) {
          console.log(`⏭️  Skipping: ${cityName} (already exists)`)
          skipped++
          continue
        }

        // Get California state
        const californiaState = await payload.find({
          collection: 'states',
          where: {
            name: {
              equals: 'California'
            }
          },
          limit: 1
        })

        const stateId = californiaState.docs[0]?.id

        if (!stateId) {
          console.log(`❌ Error: Could not find California state`)
          errors++
          continue
        }

        // Create city data entry
        await payload.create({
          collection: 'cityData',
          data: {
            cityName,
            state: stateId,
            region: 'southern', // Default - you can update this manually later
            // Other fields will be populated later via API or manually
          }
        })

        console.log(`✅ Imported: ${cityName}`)
        imported++

      } catch (error: any) {
        console.error(`❌ Error importing ${agent.designationTitle}:`, error.message)
        errors++
      }
    }

    console.log('\n📊 Import Summary:')
    console.log(`  ✅ Imported: ${imported}`)
    console.log(`  ⏭️  Skipped: ${skipped}`)
    console.log(`  ❌ Errors: ${errors}`)
    console.log(`  📋 Total: ${californiaAgents.length}`)

    process.exit(0)

  } catch (error: any) {
    console.error('\n💥 Fatal error:', error.message)
    process.exit(1)
  }
}

main()
