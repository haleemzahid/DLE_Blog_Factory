import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { renderTemplate, getDefaultSections, type TemplateSection } from '@/utilities/renderTemplate'
import { analyzeContentUniqueness } from '@/utilities/contentUniqueness'
import type { Agent, CityDatum, ContentTemplate } from '@/payload-types'

/**
 * API Route: Template Preview
 *
 * Generates a preview of rendered template content with
 * specified agent and city data for admin preview functionality.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, agentId, cityId, customOverrides } = body

    const payload = await getPayload({ config: configPromise })

    // Fetch agent if specified
    let agent: Agent | null = null
    if (agentId) {
      const agentResult = await payload.findByID({
        collection: 'agents',
        id: agentId,
        depth: 2,
      })
      agent = agentResult as Agent
    }

    // Fetch city data if specified
    let cityData: CityDatum | null = null
    if (cityId) {
      const cityResult = await payload.findByID({
        collection: 'cityData',
        id: cityId,
        depth: 1,
      })
      cityData = cityResult as CityDatum
    }

    // Fetch template if specified
    let template: ContentTemplate | null = null
    if (templateId) {
      const templateResult = await payload.findByID({
        collection: 'contentTemplates',
        id: templateId,
        depth: 1,
      })
      template = templateResult as ContentTemplate
    }

    // If no agent provided, create a sample one
    if (!agent) {
      agent = createSampleAgent()
    }

    // If no city data provided, create sample data
    if (!cityData) {
      cityData = createSampleCityData()
    }

    // Build sections from template or use defaults
    const sections = template
      ? buildSectionsFromTemplate(template)
      : getDefaultSections()

    // Render the template
    const result = renderTemplate(
      sections,
      {
        agent,
        cityData,
        template,
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'https://example.com',
      },
      customOverrides
    )

    // Analyze content uniqueness
    const uniquenessAnalysis = analyzeContentUniqueness(result.content, agent, cityData)

    return NextResponse.json({
      success: true,
      title: result.title,
      description: result.description,
      content: result.content,
      uniquenessScore: result.uniquenessScore,
      uniquenessAnalysis: {
        score: uniquenessAnalysis.score,
        grade: uniquenessAnalysis.grade,
        recommendations: uniquenessAnalysis.recommendations,
        warnings: uniquenessAnalysis.warnings,
      },
      missingTokens: result.missingTokens,
      usedGenerators: result.usedGenerators,
      sections: result.sections.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        wasOverridden: s.wasOverridden,
        contentLength: s.content.length,
      })),
      metadata: result.metadata,
    })
  } catch (error) {
    console.error('Template preview error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate preview',
      },
      { status: 500 }
    )
  }
}

/**
 * Build sections from ContentTemplate
 */
function buildSectionsFromTemplate(template: ContentTemplate): TemplateSection[] {
  // Current ContentTemplates collection uses aiPrompt and basePost
  // For full implementation, would add sections array to collection
  // For now, return enhanced default sections

  const sections = getDefaultSections()

  // Apply template settings
  const uniquenessTarget = (template as any).contentUniquenessTarget || 30

  // Add more sections for high uniqueness targets
  if (uniquenessTarget >= 50) {
    sections.push({
      id: 'cultural',
      name: 'Cultural Information',
      type: 'dynamic',
      generator: 'diversity_overview',
      condition: 'cityData.demographics',
    })
    sections.push({
      id: 'places_of_worship',
      name: 'Places of Worship',
      type: 'dynamic',
      generator: 'places_of_worship',
      condition: 'cityData.placesOfWorship.length > 0',
    })
    sections.push({
      id: 'amenities',
      name: 'Community Amenities',
      type: 'dynamic',
      generator: 'community_amenities',
      condition: 'cityData.communityAmenities.length > 0',
    })
  }

  return sections
}

/**
 * Create sample agent for preview
 */
function createSampleAgent(): Agent {
  return {
    id: 0,
    name: 'John Smith',
    displayName: 'Mr. Sample City™',
    fullDesignation: 'Mr. Sample City™',
    slug: 'mr-sample-city',
    city: 'Sample City',
    phone: '(555) 123-4567',
    email: 'agent@example.com',
    website: 'https://example.com',
    shortBio: 'Award-winning real estate agent with over 15 years of experience helping families find their dream homes.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Agent
}

/**
 * Create sample city data for preview
 */
function createSampleCityData(): CityDatum {
  return {
    id: 0,
    cityName: 'Sample City',
    population: 125000,
    medianHomePrice: 650000,
    medianRent: 2500,
    priceChange12Month: 5.2,
    avgDaysOnMarket: 28,
    salesCount30Days: 145,
    marketTrend: 'moderate-seller',
    inventoryLevel: 'low',
    neighborhoods: [
      { name: 'Downtown', avgPrice: 750000, description: 'Urban living at its finest' },
      { name: 'Riverside', avgPrice: 550000, description: 'Peaceful waterfront community' },
      { name: 'Oak Hills', avgPrice: 820000, description: 'Upscale family neighborhood' },
    ],
    topSchools: [
      { name: 'Sample High School', type: 'high', rating: 9 },
      { name: 'Riverside Elementary', type: 'elementary', rating: 8 },
      { name: 'Oak Hills Middle', type: 'middle', rating: 8 },
    ],
    uniqueFacts: [
      { fact: 'Home to the annual Real Estate Innovation Conference' },
      { fact: 'Voted "Best Place to Live" by Regional Magazine 2024' },
      { fact: 'Features 25 miles of scenic walking trails' },
    ],
    keyEmployers: [
      { name: 'Tech Corp', industry: 'Technology' },
      { name: 'Regional Medical Center', industry: 'Healthcare' },
      { name: 'Sample University', industry: 'Education' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as CityDatum
}

export async function GET() {
  return NextResponse.json({
    message: 'Template Preview API',
    usage: 'POST with { templateId?, agentId?, cityId?, customOverrides? }',
    description: 'Generates a preview of template rendering with specified data',
  })
}
