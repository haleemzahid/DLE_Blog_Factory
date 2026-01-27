import type { Agent, CityDatum, State, Media } from '@/payload-types'

/**
 * Dynamic Section Generators
 * These functions generate HTML/Markdown content for specific template sections
 * based on Agent and CityData
 */

interface GeneratorContext {
  agent?: Agent | null
  cityData?: CityDatum | null
}

/**
 * Format currency helper
 */
function formatCurrency(num: number | null | undefined): string {
  if (num === null || num === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format number with commas
 */
function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return 'N/A'
  return num.toLocaleString()
}

/**
 * Generate Market Statistics Section
 */
export function generateMarketStatsSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData) return ''

  const trendLabels: Record<string, string> = {
    'hot-seller': 'Hot Seller Market',
    'moderate-seller': 'Moderate Seller Market',
    balanced: 'Balanced Market',
    'moderate-buyer': 'Moderate Buyer Market',
    'hot-buyer': 'Hot Buyer Market',
  }

  const inventoryLabels: Record<string, string> = {
    'very-low': 'Very Low (< 2 months)',
    low: 'Low (2-4 months)',
    balanced: 'Balanced (4-6 months)',
    high: 'High (6-8 months)',
    'very-high': 'Very High (> 8 months)',
  }

  return `
## ${cityData.cityName} Market Statistics

| Metric | Value |
|--------|-------|
| Median Home Price | ${formatCurrency(cityData.medianHomePrice)} |
| Median Rent | ${formatCurrency(cityData.medianRent)}/mo |
| 12-Month Price Change | ${cityData.priceChange12Month ? `${cityData.priceChange12Month > 0 ? '+' : ''}${cityData.priceChange12Month}%` : 'N/A'} |
| Average Days on Market | ${cityData.avgDaysOnMarket || 'N/A'} days |
| Homes Sold (30 days) | ${formatNumber(cityData.salesCount30Days)} |
| Inventory Level | ${inventoryLabels[cityData.inventoryLevel || ''] || 'N/A'} |
| Market Trend | ${trendLabels[cityData.marketTrend || ''] || 'N/A'} |
| Population | ${formatNumber(cityData.population)} |

*Last updated: ${cityData.lastUpdated ? new Date(cityData.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}*
`.trim()
}

/**
 * Generate Neighborhoods Section
 */
export function generateNeighborhoodsSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData?.neighborhoods || cityData.neighborhoods.length === 0) return ''

  const neighborhoods = cityData.neighborhoods as any[]

  let content = `## Neighborhoods in ${cityData.cityName}\n\n`

  neighborhoods.forEach((n: any) => {
    content += `### ${n.name}\n`
    if (n.avgPrice) {
      content += `**Average Home Price:** ${formatCurrency(n.avgPrice)}\n\n`
    }
    if (n.description) {
      content += `${n.description}\n\n`
    }
  })

  return content.trim()
}

/**
 * Generate Schools Section
 */
export function generateSchoolsSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData?.topSchools || cityData.topSchools.length === 0) return ''

  const schools = cityData.topSchools as any[]

  let content = `## Top Schools in ${cityData.cityName}\n\n`
  content += `| School | Type | Rating |\n`
  content += `|--------|------|--------|\n`

  schools.forEach((s: any) => {
    const typeLabels: Record<string, string> = {
      elementary: 'Elementary',
      middle: 'Middle School',
      high: 'High School',
      k12: 'K-12',
    }
    content += `| ${s.name} | ${typeLabels[s.type || ''] || 'N/A'} | ${s.rating ? `${s.rating}/10` : 'N/A'} |\n`
  })

  return content.trim()
}

/**
 * Generate Agent CTA Section
 */
export function generateAgentCTASection(context: GeneratorContext): string {
  const { agent, cityData } = context
  if (!agent) return ''

  const jsonLd = (agent as any).seo?.jsonLd

  let content = `## Contact ${agent.fullDesignation || agent.displayName}\n\n`

  if (agent.shortBio) {
    content += `${agent.shortBio}\n\n`
  }

  if (jsonLd?.aggregateRating?.ratingValue) {
    content += `**Rating:** ${jsonLd.aggregateRating.ratingValue} stars from ${jsonLd.aggregateRating.reviewCount || 0} reviews\n\n`
  }

  if (agent.phone) {
    content += `📞 **Phone:** ${agent.phone}\n`
  }
  if (agent.email) {
    content += `📧 **Email:** ${agent.email}\n`
  }
  if (agent.website) {
    content += `🌐 **Website:** ${agent.website}\n`
  }

  return content.trim()
}

/**
 * Generate Local Facts Section
 */
export function generateLocalFactsSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData?.uniqueFacts || cityData.uniqueFacts.length === 0) return ''

  const facts = cityData.uniqueFacts as any[]

  let content = `## Interesting Facts About ${cityData.cityName}\n\n`

  facts.forEach((f: any) => {
    content += `• ${f.fact}\n`
  })

  return content.trim()
}

/**
 * Generate Key Employers Section
 */
export function generateEmployersSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData?.keyEmployers || cityData.keyEmployers.length === 0) return ''

  const employers = cityData.keyEmployers as any[]

  let content = `## Major Employers in ${cityData.cityName}\n\n`

  employers.forEach((e: any) => {
    if (e.industry) {
      content += `• **${e.name}** - ${e.industry}\n`
    } else {
      content += `• ${e.name}\n`
    }
  })

  return content.trim()
}

/**
 * Generate Price Comparison Section
 */
export function generatePriceComparisonSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData) return ''

  let content = `## ${cityData.cityName} Price Comparison\n\n`

  if (cityData.nearbyCity) {
    content += `Compare ${cityData.cityName} to nearby ${cityData.nearbyCity}:\n\n`
  }

  content += `| Metric | ${cityData.cityName} |\n`
  content += `|--------|-------|\n`
  content += `| Median Home Price | ${formatCurrency(cityData.medianHomePrice)} |\n`
  content += `| Median Rent | ${formatCurrency(cityData.medianRent)}/mo |\n`
  content += `| Price Change (YoY) | ${cityData.priceChange12Month ? `${cityData.priceChange12Month > 0 ? '+' : ''}${cityData.priceChange12Month}%` : 'N/A'} |\n`

  return content.trim()
}

/**
 * Generate FAQ Section from Agent FAQs
 */
export function generateFAQSection(context: GeneratorContext): string {
  const { agent } = context
  if (!agent?.faqs || agent.faqs.length === 0) return ''

  let content = `## Frequently Asked Questions\n\n`

  agent.faqs.forEach((faq: any) => {
    content += `### ${faq.question}\n\n`

    // Extract text from rich text
    if (faq.answer?.root?.children) {
      const text = extractTextFromRichText(faq.answer)
      content += `${text}\n\n`
    }
  })

  return content.trim()
}

/**
 * Generate Places of Worship Section
 */
export function generatePlacesOfWorshipSection(context: GeneratorContext): string {
  const { cityData } = context
  const places = (cityData as any)?.placesOfWorship
  if (!places || places.length === 0) return ''

  const religionLabels: Record<string, string> = {
    catholic: 'Catholic',
    protestant: 'Protestant',
    orthodox: 'Orthodox Christian',
    jewish: 'Jewish',
    muslim: 'Muslim',
    hindu: 'Hindu',
    buddhist: 'Buddhist',
    sikh: 'Sikh',
    lds: 'LDS (Mormon)',
    'non-denominational': 'Non-Denominational',
    other: 'Other',
  }

  let content = `## Places of Worship in ${cityData?.cityName}\n\n`

  // Group by religion
  const byReligion: Record<string, any[]> = {}
  places.forEach((p: any) => {
    const religion = p.religion || 'other'
    if (!byReligion[religion]) byReligion[religion] = []
    byReligion[religion].push(p)
  })

  Object.entries(byReligion).forEach(([religion, items]) => {
    content += `### ${religionLabels[religion] || religion}\n\n`
    items.forEach((p: any) => {
      content += `• **${p.name}**`
      if (p.address) content += ` - ${p.address}`
      content += '\n'
    })
    content += '\n'
  })

  return content.trim()
}

/**
 * Generate Cultural Centers Section
 */
export function generateCulturalCentersSection(context: GeneratorContext): string {
  const { cityData } = context
  const centers = (cityData as any)?.culturalCenters
  if (!centers || centers.length === 0) return ''

  const typeLabels: Record<string, string> = {
    'cultural-center': 'Cultural Center',
    'community-center': 'Community Center',
    'ethnic-association': 'Ethnic Association',
    'senior-center': 'Senior Center',
    'youth-center': 'Youth Center',
    'arts-center': 'Arts Center',
  }

  let content = `## Cultural Centers & Community Hubs in ${cityData?.cityName}\n\n`

  centers.forEach((c: any) => {
    content += `### ${c.name}\n`
    content += `**Type:** ${typeLabels[c.type || ''] || 'Community Center'}\n\n`
    if (c.description) {
      content += `${c.description}\n\n`
    }
  })

  return content.trim()
}

/**
 * Generate Cultural Events Section
 */
export function generateCulturalEventsSection(context: GeneratorContext): string {
  const { cityData } = context
  const events = (cityData as any)?.culturalEvents
  if (!events || events.length === 0) return ''

  let content = `## Cultural Events & Festivals in ${cityData?.cityName}\n\n`

  events.forEach((e: any) => {
    content += `### ${e.name}\n`
    if (e.timing) {
      content += `**When:** ${e.timing}\n\n`
    }
    if (e.description) {
      content += `${e.description}\n\n`
    }
  })

  return content.trim()
}

/**
 * Generate Diversity Overview Section
 */
export function generateDiversityOverviewSection(context: GeneratorContext): string {
  const { cityData } = context
  const demographics = (cityData as any)?.demographics
  if (!demographics) return ''

  let content = `## Community Demographics in ${cityData?.cityName}\n\n`

  if (demographics.diversityIndex) {
    const diversityLevel =
      demographics.diversityIndex >= 70
        ? 'highly diverse'
        : demographics.diversityIndex >= 50
          ? 'moderately diverse'
          : 'less diverse'
    content += `**Diversity Index:** ${demographics.diversityIndex} (${diversityLevel})\n\n`
  }

  if (demographics.medianAge) {
    content += `**Median Age:** ${demographics.medianAge} years\n\n`
  }

  if (demographics.familyHouseholds) {
    content += `**Family Households:** ${demographics.familyHouseholds}%\n\n`
  }

  if (demographics.ethnicBreakdown && demographics.ethnicBreakdown.length > 0) {
    content += `### Ethnic Breakdown\n\n`
    content += `| Ethnicity | Percentage |\n`
    content += `|-----------|------------|\n`
    demographics.ethnicBreakdown.forEach((e: any) => {
      content += `| ${e.ethnicity} | ${e.percentage}% |\n`
    })
    content += '\n'
  }

  return content.trim()
}

/**
 * Generate Community Amenities Section
 */
export function generateCommunityAmenitiesSection(context: GeneratorContext): string {
  const { cityData } = context
  const amenities = (cityData as any)?.communityAmenities
  if (!amenities || amenities.length === 0) return ''

  const typeLabels: Record<string, string> = {
    park: 'Parks',
    recreation: 'Recreation Centers',
    library: 'Libraries',
    museum: 'Museums',
    sports: 'Sports Complexes',
    nature: 'Nature Preserves',
    golf: 'Golf Courses',
    aquatic: 'Pools & Aquatic Centers',
  }

  // Group by type
  const byType: Record<string, any[]> = {}
  amenities.forEach((a: any) => {
    const type = a.type || 'other'
    if (!byType[type]) byType[type] = []
    byType[type].push(a)
  })

  let content = `## Community Amenities in ${cityData?.cityName}\n\n`

  Object.entries(byType).forEach(([type, items]) => {
    content += `### ${typeLabels[type] || 'Other'}\n\n`
    items.forEach((a: any) => {
      content += `• **${a.name}**`
      if (a.description) content += ` - ${a.description}`
      content += '\n'
    })
    content += '\n'
  })

  return content.trim()
}

/**
 * Generate Languages Section
 */
export function generateLanguagesSection(context: GeneratorContext): string {
  const { cityData } = context
  const languages = (cityData as any)?.languagesSpoken
  if (!languages || languages.length === 0) return ''

  let content = `## Languages Spoken in ${cityData?.cityName}\n\n`
  content += `${cityData?.cityName} is home to a multilingual community:\n\n`

  languages.forEach((l: any) => {
    if (l.percentageOfPopulation) {
      content += `• **${l.language}** - ${l.percentageOfPopulation}% of households\n`
    } else {
      content += `• ${l.language}\n`
    }
  })

  return content.trim()
}

/**
 * Generate Agent Expertise Section
 */
export function generateAgentExpertiseSection(context: GeneratorContext): string {
  const { agent } = context
  if (!agent) return ''

  const jsonLd = (agent as any).seo?.jsonLd
  const culturalExpertise = (agent as any).culturalExpertise

  let content = `## ${agent.fullDesignation || agent.displayName}'s Expertise\n\n`

  if (jsonLd?.knowsAbout && jsonLd.knowsAbout.length > 0) {
    content += `### Specializations\n\n`
    jsonLd.knowsAbout.forEach((k: { topic?: string }) => {
      if (k.topic) content += `• ${k.topic}\n`
    })
    content += '\n'
  }

  if (jsonLd?.areaServed && jsonLd.areaServed.length > 0) {
    content += `### Areas Served\n\n`
    jsonLd.areaServed.forEach((a: { name?: string; type?: string }) => {
      if (a.name) content += `• ${a.name}\n`
    })
    content += '\n'
  }

  if (culturalExpertise?.culturalSpecializations && culturalExpertise.culturalSpecializations.length > 0) {
    content += `### Community Expertise\n\n`
    content += `${agent.fullDesignation || agent.displayName} specializes in helping:\n\n`
    culturalExpertise.culturalSpecializations.forEach((c: { community?: string }) => {
      if (c.community) content += `• ${c.community} families\n`
    })
    content += '\n'
  }

  return content.trim()
}

/**
 * Generate Agent Reviews Section
 */
export function generateAgentReviewsSection(context: GeneratorContext): string {
  const { agent } = context
  if (!agent) return ''

  const jsonLd = (agent as any).seo?.jsonLd
  const rating = jsonLd?.aggregateRating

  if (!rating?.ratingValue) return ''

  let content = `## Client Reviews\n\n`
  content += `${agent.fullDesignation || agent.displayName} has earned an outstanding reputation:\n\n`
  content += `⭐ **${rating.ratingValue}** out of 5 stars\n\n`
  content += `Based on **${rating.reviewCount || 0}** verified reviews\n\n`

  return content.trim()
}

/**
 * Generate Agent Languages Section
 */
export function generateAgentLanguagesSection(context: GeneratorContext): string {
  const { agent } = context
  if (!agent) return ''

  const culturalExpertise = (agent as any).culturalExpertise
  if (!culturalExpertise?.languagesSpoken || culturalExpertise.languagesSpoken.length === 0) {
    return ''
  }

  const proficiencyLabels: Record<string, string> = {
    native: 'Native',
    fluent: 'Fluent',
    conversational: 'Conversational',
    basic: 'Basic',
  }

  let content = `## ${agent.fullDesignation || agent.displayName} Speaks Your Language\n\n`

  culturalExpertise.languagesSpoken.forEach((l: { language?: string; proficiency?: string }) => {
    if (l.language) {
      const proficiency = proficiencyLabels[l.proficiency || ''] || ''
      content += `• **${l.language}**${proficiency ? ` - ${proficiency}` : ''}\n`
    }
  })

  if (culturalExpertise.communityInvolvement && culturalExpertise.communityInvolvement.length > 0) {
    content += `\n### Community Involvement\n\n`
    culturalExpertise.communityInvolvement.forEach((c: { organization?: string; role?: string }) => {
      if (c.organization) {
        content += `• ${c.role ? `${c.role} at ` : ''}${c.organization}\n`
      }
    })
  }

  return content.trim()
}

/**
 * Generate Areas Served Section
 */
export function generateAreasServedSection(context: GeneratorContext): string {
  const { agent } = context
  if (!agent) return ''

  const jsonLd = (agent as any).seo?.jsonLd
  if (!jsonLd?.areaServed || jsonLd.areaServed.length === 0) return ''

  const typeLabels: Record<string, string> = {
    City: 'Cities',
    AdministrativeArea: 'Counties',
    Neighborhood: 'Neighborhoods',
    State: 'States',
  }

  // Group by type
  const byType: Record<string, string[]> = {}
  jsonLd.areaServed.forEach((a: { name?: string; type?: string }) => {
    if (a.name) {
      const type = a.type || 'City'
      if (!byType[type]) byType[type] = []
      byType[type].push(a.name)
    }
  })

  let content = `## Areas Served by ${agent.fullDesignation || agent.displayName}\n\n`

  Object.entries(byType).forEach(([type, names]) => {
    content += `### ${typeLabels[type] || type}\n\n`
    names.forEach((name) => {
      content += `• ${name}\n`
    })
    content += '\n'
  })

  return content.trim()
}

/**
 * Helper to extract plain text from Payload rich text format
 */
function extractTextFromRichText(richText: any): string {
  if (!richText?.root?.children) return ''

  function extractFromChildren(children: any[]): string {
    return children
      .map((child) => {
        if (child.text) return child.text
        if (child.children) return extractFromChildren(child.children)
        return ''
      })
      .join(' ')
  }

  return extractFromChildren(richText.root.children).trim()
}

/**
 * Registry of all available generators
 */
export const generators: Record<string, (context: GeneratorContext) => string> = {
  // Market Data
  market_stats: generateMarketStatsSection,
  price_comparison: generatePriceComparisonSection,

  // Location
  neighborhoods: generateNeighborhoodsSection,
  schools: generateSchoolsSection,
  local_facts: generateLocalFactsSection,
  employers: generateEmployersSection,

  // Cultural & Community
  places_of_worship: generatePlacesOfWorshipSection,
  cultural_centers: generateCulturalCentersSection,
  cultural_events: generateCulturalEventsSection,
  diversity_overview: generateDiversityOverviewSection,
  community_amenities: generateCommunityAmenitiesSection,
  languages_spoken: generateLanguagesSection,

  // Agent SEO
  agent_expertise: generateAgentExpertiseSection,
  agent_reviews: generateAgentReviewsSection,
  agent_languages: generateAgentLanguagesSection,
  areas_served: generateAreasServedSection,

  // Agent
  agent_cta: generateAgentCTASection,
  faq: generateFAQSection,
}

/**
 * Run a generator by name
 */
export function runGenerator(name: string, context: GeneratorContext): string {
  const generator = generators[name]
  if (!generator) {
    console.warn(`Generator "${name}" not found`)
    return ''
  }
  return generator(context)
}

/**
 * Get list of all available generator names
 */
export function getAvailableGenerators(): string[] {
  return Object.keys(generators)
}

export default generators
