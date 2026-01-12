/**
 * Add California Agents
 *
 * Creates agent profiles for major California cities
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const californiaAgents = [
  {
    fullName: 'Michael Chen',
    displayName: 'Mr. San Francisco',
    city: 'San Francisco',
    designationPrefix: 'Mr.',
    designationCity: 'San Francisco',
    tagline: 'TOP RATED REAL ESTATE AGENT IN SAN FRANCISCO',
    bio: "Michael Chen has been serving the San Francisco Bay Area for over 15 years, specializing in luxury condos and Victorian homes. With deep knowledge of every neighborhood from Pacific Heights to the Mission District, he helps clients navigate the competitive SF market with confidence. His commitment to personalized service has earned him a reputation as one of the city's most trusted real estate professionals.",
    phone: '(415) 782-9341',
    email: 'michael@mr-sanfrancisco.com',
  },
  {
    fullName: 'Jessica Rodriguez',
    displayName: 'Ms. Los Angeles',
    city: 'Los Angeles',
    designationPrefix: 'Ms.',
    designationCity: 'Los Angeles',
    tagline: 'TOP RATED REAL ESTATE AGENT IN LOS ANGELES',
    bio: "Jessica Rodriguez brings unmatched expertise to the diverse Los Angeles real estate market, from Beverly Hills estates to Downtown lofts. With 12 years of experience and insider knowledge of LA's unique neighborhoods, she guides her clients through every step of buying or selling their dream property. Her passion for the City of Angels shines through in every transaction.",
    phone: '(310) 456-2187',
    email: 'jessica@ms-losangeles.com',
  },
  {
    fullName: 'Robert Martinez',
    displayName: 'Mr. San Diego',
    city: 'San Diego',
    designationPrefix: 'Mr.',
    designationCity: 'San Diego',
    tagline: 'TOP RATED REAL ESTATE AGENT IN SAN DIEGO',
    bio: "Robert Martinez is San Diego's premier real estate expert, specializing in coastal properties and family homes across America's Finest City. His extensive knowledge of neighborhoods from La Jolla to North Park, combined with his strategic negotiation skills, ensures clients get the best possible outcomes. Robert's dedication to excellence has made him a go-to agent for San Diego real estate.",
    phone: '(619) 834-5672',
    email: 'robert@mr-sandiego.com',
  },
  {
    fullName: 'Amanda Thompson',
    displayName: 'Ms. Sacramento',
    city: 'Sacramento',
    designationPrefix: 'Ms.',
    designationCity: 'Sacramento',
    tagline: 'TOP RATED REAL ESTATE AGENT IN SACRAMENTO',
    bio: "Amanda Thompson has been helping families find their perfect homes in Sacramento for over a decade, with expertise spanning from historic Midtown to growing suburban communities. Her deep understanding of the capital city's real estate trends and neighborhood dynamics makes her an invaluable resource for buyers and sellers alike. Amanda's client-first approach has earned her countless five-star reviews.",
    phone: '(916) 293-4815',
    email: 'amanda@ms-sacramento.com',
  },
  {
    fullName: 'David Williams',
    displayName: 'Mr. Oakland',
    city: 'Oakland',
    designationPrefix: 'Mr.',
    designationCity: 'Oakland',
    tagline: 'TOP RATED REAL ESTATE AGENT IN OAKLAND',
    bio: "David Williams is Oakland's trusted real estate advisor, specializing in the city's vibrant and diverse neighborhoods from Rockridge to Jack London Square. With 14 years of local experience, he understands the unique character of each Oakland community and helps clients discover hidden gems in this dynamic market. David's commitment to transparency and integrity sets him apart in the East Bay real estate scene.",
    phone: '(510) 627-3948',
    email: 'david@mr-oakland.com',
  },
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
          equals: 'California',
        },
      },
      limit: 1,
    })

    const stateId = californiaState.docs[0]?.id

    if (!stateId) {
      console.log('❌ Error: Could not find California state. Please create it first in the admin.')
      console.log('   Go to: Collections → States → Create "California"')
      process.exit(1)
    }

    console.log(`📍 Adding California agents...\n`)

    for (const agentData of californiaAgents) {
      try {
        // Check if agent already exists
        const existing = await payload.find({
          collection: 'agents',
          where: {
            email: {
              equals: agentData.email,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`⏭️  Skipping ${agentData.fullName} - already exists`)
          continue
        }

        // Create slug from display name
        const slug = agentData.displayName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        // Create agent
        const agent = await payload.create({
          collection: 'agents',
          data: {
            name: agentData.fullName,
            displayName: agentData.displayName,
            slug: slug,
            city: agentData.city,
            state: stateId,
            designationPrefix: agentData.designationPrefix as 'Mr.' | 'Ms.' | 'Mrs.' | null,
            designationCity: agentData.designationCity,
            fullDesignation: `${agentData.designationPrefix} ${agentData.designationCity}™`,
            tagline: agentData.tagline,
            bio: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        version: 1,
                        text: agentData.bio,
                      },
                    ],
                  },
                ],
                direction: 'ltr' as const,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            phone: agentData.phone,
            email: agentData.email,
            _status: 'published',
            publishedAt: new Date().toISOString(),
          },
        })

        console.log(
          `✅ Created: ${agentData.fullName} (${agentData.displayName}) - ${agentData.city}`,
        )
      } catch (error) {
        console.error(`❌ Error creating ${agentData.fullName}:`, error)
      }
    }

    console.log('\n✨ Done! All agents have been added.')
    console.log('\n📋 Next steps:')
    console.log('   1. Go to localhost:3000/admin/collections/agents to view your agents')
    console.log('   2. Upload profile photos for each agent')
    console.log('   3. Add additional credentials, services, and gallery images as needed')
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
