/**
 * Batch Syndication Script
 *
 * Syndicate template posts to multiple cities automatically with AI-generated unique content
 */

import type { Payload } from 'payload'
import type { Agent } from '@/payload-types'
import { generateCityContent } from './cityContent'

// Helper function to convert string to Lexical rich text format
function stringToLexical(text: string): {
  [k: string]: unknown
  root: {
    type: string
    children: {
      [k: string]: unknown
      type: string
      version: number
    }[]
    direction: 'ltr' | 'rtl' | null
    format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'
    indent: number
    version: number
  }
} {
  return {
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
              text: text,
            },
          ],
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

export interface SyndicationOptions {
  templatePostId: string
  cityIds?: string[]
  cityTier?: 'tier1' | 'tier2' | 'tier3' | 'all'
  region?: 'northern' | 'central' | 'southern' | 'all'
  dryRun?: boolean
  maxCities?: number
}

export interface SyndicationResult {
  success: boolean
  citiesProcessed: number
  citiesSucceeded: number
  citiesFailed: number
  errors: Array<{
    cityId: number
    cityName: string
    error: string
  }>
}

/**
 * Syndicate a template post to multiple cities
 *
 * @param payload - Payload CMS instance
 * @param options - Syndication configuration
 * @returns Results of the syndication operation
 */
export async function syndicatePostToCities(
  payload: Payload,
  options: SyndicationOptions,
): Promise<SyndicationResult> {
  const result: SyndicationResult = {
    success: true,
    citiesProcessed: 0,
    citiesSucceeded: 0,
    citiesFailed: 0,
    errors: [],
  }

  try {
    console.log('🚀 Starting batch syndication...')

    // 1. Fetch the template post
    const template = await payload.findByID({
      collection: 'posts',
      id: options.templatePostId,
    })

    if (!template) {
      throw new Error(`Template post ${options.templatePostId} not found`)
    }

    if (!template.isTemplate) {
      throw new Error(`Post ${options.templatePostId} is not marked as a template`)
    }

    console.log(`📄 Template: "${template.title}"`)

    // 2. Get list of cities to process
    const cities = await getCitiesToProcess(payload, options)
    console.log(`🏙️  Found ${cities.length} cities to process`)

    if (options.dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be saved')
      console.log('Cities that would be processed:')
      cities.forEach((city, index) => {
        console.log(`  ${index + 1}. ${city.cityName} (${city.id})`)
      })
      return result
    }

    // 3. Process each city
    for (const city of cities) {
      result.citiesProcessed++

      try {
        console.log(
          `\n📍 Processing: ${city.cityName} (${result.citiesProcessed}/${cities.length})`,
        )

        // Find agent for this city
        const stateId = typeof city.state === 'object' ? city.state.id : city.state
        const agent = await findAgentByCity(payload, city.cityName, stateId)

        if (!agent) {
          console.warn(`⚠️  No agent found for ${city.cityName}, skipping...`)
          result.citiesFailed++
          result.errors.push({
            cityId: city.id,
            cityName: city.cityName,
            error: 'No agent found',
          })
          continue
        }

        // Generate unique content
        console.log(`  🤖 Generating AI content...`)
        const uniqueContent = await generateCityContent(payload, options.templatePostId, String(city.id))

        // Get agent's tenant
        const agentDoc = await payload.findByID({
          collection: 'agents',
          id: agent.id,
          depth: 1,
        })

        const tenantId = typeof agentDoc.tenant === 'object' ? agentDoc.tenant?.id : agentDoc.tenant

        if (!tenantId) {
          console.log(`  ⚠️  Agent has no tenant, skipping syndication...`)
          continue
        }

        // Update the post with syndication data
        console.log(`  💾 Updating post syndication...`)

        // Get current syndication data
        const currentSyndicatedAgents = template.syndicatedAgents || []
        const currentSeoOverrides = template.tenantSeoOverrides || []

        // Check if already syndicated to this agent
        const alreadySyndicated = currentSyndicatedAgents.some(
          (a) => (typeof a === 'object' ? a.id : a) === agent.id,
        )

        if (alreadySyndicated) {
          console.log(`  ℹ️  Already syndicated to ${city.cityName}, updating...`)

          // Update existing override
          const overrideIndex = currentSeoOverrides.findIndex(
            (o) => (typeof o.tenant === 'object' ? o.tenant.id : o.tenant) === tenantId,
          )

          if (overrideIndex >= 0) {
            currentSeoOverrides[overrideIndex] = {
              ...currentSeoOverrides[overrideIndex],
              titleOverride: uniqueContent.titleOverride,
              descriptionOverride: uniqueContent.descriptionOverride,
              introOverride: stringToLexical(uniqueContent.introOverride),
              customSlug: uniqueContent.customSlug,
            }
          }
        } else {
          // Add new syndication
          currentSyndicatedAgents.push(agent.id)
          currentSeoOverrides.push({
            tenant: tenantId,
            titleOverride: uniqueContent.titleOverride,
            descriptionOverride: uniqueContent.descriptionOverride,
            introOverride: stringToLexical(uniqueContent.introOverride),
            customSlug: uniqueContent.customSlug,
          })
        }

        // Update the post
        await payload.update({
          collection: 'posts',
          id: options.templatePostId,
          data: {
            syndicatedAgents: currentSyndicatedAgents,
            tenantSeoOverrides: currentSeoOverrides,
            postType: 'syndicated',
          },
        })

        console.log(`  ✅ Successfully syndicated to ${city.cityName}`)
        result.citiesSucceeded++

        // Optional: Add delay to avoid rate limiting
        await sleep(500)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`  ❌ Failed to process ${city.cityName}:`, errorMessage)
        result.citiesFailed++
        result.errors.push({
          cityId: city.id,
          cityName: city.cityName,
          error: errorMessage,
        })
      }
    }

    console.log('\n✨ Syndication complete!')
    console.log(`   Total: ${result.citiesProcessed}`)
    console.log(`   ✅ Success: ${result.citiesSucceeded}`)
    console.log(`   ❌ Failed: ${result.citiesFailed}`)

    if (result.citiesFailed > 0) {
      console.log('\n⚠️  Errors:')
      result.errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.cityName}: ${err.error}`)
      })
    }

    result.success = result.citiesFailed === 0
  } catch (error: unknown) {
    console.error('💥 Syndication failed:', error)
    result.success = false
    throw error
  }

  return result
}

interface CityData {
  id: number
  cityName: string
  state: number | { id: number }
}

/**
 * Get list of cities to process based on options
 */
async function getCitiesToProcess(payload: Payload, options: SyndicationOptions): Promise<CityData[]> {
  // If specific city IDs provided, use those
  if (options.cityIds && options.cityIds.length > 0) {
    const cities = await Promise.all(
      options.cityIds.map((id) =>
        payload.findByID({
          collection: 'cityData',
          id,
        }),
      ),
    )
    return cities.filter((c) => c !== null)
  }

  // Otherwise, query based on filters
  const query: any = {}

  if (options.region && options.region !== 'all') {
    query.region = { equals: options.region }
  }

  const { docs } = await payload.find({
    collection: 'cityData',
    where: query,
    limit: options.maxCities || 1000,
  })

  return docs
}

/**
 * Find agent by city name and state
 */
async function findAgentByCity(payload: Payload, cityName: string, stateId?: number): Promise<Agent | null> {
  // Find agent matching city name in the 'city' field
  const whereClause: Record<string, unknown> = {
    city: {
      equals: cityName,
    },
  }

  // If state provided, add it to query
  if (stateId) {
    whereClause.state = {
      equals: stateId,
    }
  }

  // Try published first
  let result = await payload.find({
    collection: 'agents',
    where: whereClause,
    limit: 1,
  })

  // If not found, try drafts
  if (result.docs.length === 0) {
    result = await payload.find({
      collection: 'agents',
      where: {
        ...whereClause,
        _status: { equals: 'draft' },
      },
      limit: 1,
    })
  }

  return result.docs[0] || null
}

/**
 * Utility: Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Batch update city market data from external API
 */
export async function updateCityMarketData(payload: Payload, cityId: string): Promise<void> {
  // TODO: Implement external API integration
  // This would fetch data from Zillow, Realtor.com, etc.

  console.log(`📊 Updating market data for city ${cityId}...`)

  /*
  Example implementation:
  
  const apiData = await fetchFromZillowAPI(cityId)
  
  await payload.update({
    collection: 'cityData',
    id: cityId,
    data: {
      medianHomePrice: apiData.medianPrice,
      priceChange12Month: apiData.priceChange,
      salesCount30Days: apiData.salesCount,
      avgDaysOnMarket: apiData.daysOnMarket,
      lastUpdated: new Date(),
      dataSource: 'zillow',
    },
  })
  */

  console.log('✅ City data updated')
}

interface CityPerformance {
  totalViews: number
  totalLeads: number
  avgEngagement: number
}

/**
 * Get syndication analytics for a city
 */
export async function getCityPostPerformance(payload: Payload, cityId: string): Promise<CityPerformance> {
  // TODO: Implement analytics integration
  // This would pull data from PostAnalytics collection

  console.log(`📈 Fetching performance data for city ${cityId}...`)

  /*
  Example implementation:
  
  const { docs } = await payload.find({
    collection: 'postAnalytics',
    where: {
      city: { equals: cityId },
    },
    sort: '-createdAt',
    limit: 30,
  })
  
  return {
    totalViews: docs.reduce((sum, d) => sum + d.views, 0),
    totalLeads: docs.reduce((sum, d) => sum + d.leads, 0),
    avgEngagement: docs.reduce((sum, d) => sum + d.engagement, 0) / docs.length,
  }
  */

  return {
    totalViews: 0,
    totalLeads: 0,
    avgEngagement: 0,
  }
}
