/**
 * Add Test Cities
 *
 * Creates a few test city entries to demonstrate the syndication system
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const testCities = [
  { name: 'Los Angeles', region: 'southern', population: 3900000, medianPrice: 950000 },
  { name: 'San Francisco', region: 'northern', population: 873965, medianPrice: 1400000 },
  { name: 'San Diego', region: 'southern', population: 1386000, medianPrice: 875000 },
  { name: 'Claremont', region: 'southern', population: 35000, medianPrice: 925000 },
  { name: 'Sacramento', region: 'northern', population: 524000, medianPrice: 485000 },
]

async function main() {
  console.log('🔧 Initializing Payload CMS...')
  const payload = await getPayload({ config })
  console.log('✅ Payload CMS initialized\n')

  try {
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
      console.log('❌ Error: Could not find California state. Please create it first in the admin.')
      console.log('   Go to: Collections → States → Create "California"')
      process.exit(1)
    }

    console.log(`📍 Adding test cities...\n`)

    for (const city of testCities) {
      try {
        // Check if exists
        const existing = await payload.find({
          collection: 'cityData',
          where: {
            cityName: {
              equals: city.name
            }
          },
          limit: 1
        })

        if (existing.docs.length > 0) {
          console.log(`⏭️  ${city.name} already exists`)
          continue
        }

        // Create city
        await payload.create({
          collection: 'cityData',
          data: {
            cityName: city.name,
            state: stateId,
            region: city.region,
            population: city.population,
            medianHomePrice: city.medianPrice,
            neighborhoods: [
              { name: `North ${city.name}`, avgPrice: city.medianPrice * 1.2 },
              { name: `Central ${city.name}`, avgPrice: city.medianPrice },
              { name: `South ${city.name}`, avgPrice: city.medianPrice * 0.85 },
            ],
            // topSchools: [
            //   { name: `${city.name} High School`, rating: 8, type: 'High' },
            //   { name: `${city.name} Middle School`, rating: 7, type: 'Middle' },
            // ],
            uniqueFacts: [
              { fact: `${city.name} is known for its vibrant real estate market.` },
              { fact: `The median home price in ${city.name} has increased 5% year-over-year.` },
            ],
          }
        })

        console.log(`✅ Created: ${city.name}`)

      } catch (error: any) {
        console.error(`❌ Error creating ${city.name}:`, error.message)
      }
    }

    console.log(`\n✅ Test cities added successfully!`)
    console.log(`\nNow you can run:`)
    console.log(`pnpm tsx scripts/syndicate-to-cities.ts --template 75 --max 3 --dry-run`)

    process.exit(0)

  } catch (error: any) {
    console.error('\n💥 Fatal error:', error.message)
    process.exit(1)
  }
}

main()
