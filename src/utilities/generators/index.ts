import type { Agent, CityDatum, State, Media, Announcement } from '@/payload-types'

/**
 * Dynamic Section Generators
 * These functions generate HTML/Markdown content for specific template sections
 * based on Agent and CityData
 */

interface GeneratorContext {
  agent?: Agent | null
  cityData?: CityDatum | null
  /** Pre-filtered announcements for this context (global, state, city, agent scoped) */
  announcements?: Announcement[] | null
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
 * Generate Intro Section - Variant 1 (Standard)
 */
export function generateIntroStandardSection(context: GeneratorContext): string {
  const { agent, cityData } = context
  const cityName = cityData?.cityName || agent?.city || 'your area'
  const agentName = agent?.fullDesignation || agent?.displayName || 'our team'

  return `
Welcome to ${cityName}! Whether you're looking to buy, sell, or invest in real estate, ${agentName} is here to guide you through every step of your journey.

${agent?.shortBio || ''}
`.trim()
}

/**
 * Generate Intro Section - Variant 2 (Market-Focused)
 */
export function generateIntroMarketFocusedSection(context: GeneratorContext): string {
  const { agent, cityData } = context
  const cityName = cityData?.cityName || agent?.city || 'this market'
  const agentName = agent?.fullDesignation || agent?.displayName || 'our team'
  const medianPrice = cityData?.medianHomePrice
    ? formatCurrency(cityData.medianHomePrice)
    : 'competitive prices'
  const trend = cityData?.marketTrend || 'balanced'

  const trendDescriptions: Record<string, string> = {
    'hot-seller': 'a competitive seller\'s market with high demand',
    'moderate-seller': 'a favorable market for sellers',
    'balanced': 'a balanced market with opportunities for both buyers and sellers',
    'moderate-buyer': 'an excellent time for buyers to find deals',
    'hot-buyer': 'a strong buyer\'s market with great negotiating power',
  }

  return `
The ${cityName} real estate market is currently experiencing ${trendDescriptions[trend] || 'active conditions'}. With median home prices at ${medianPrice}, understanding the local market dynamics is crucial for making informed decisions.

${agentName} specializes in helping clients navigate ${cityName}'s unique market conditions. Let me show you what makes this area special and how to achieve your real estate goals.
`.trim()
}

/**
 * Generate Intro Section - Variant 3 (Community-Focused)
 */
export function generateIntroCommunityFocusedSection(context: GeneratorContext): string {
  const { agent, cityData } = context
  const cityName = cityData?.cityName || agent?.city || 'this community'
  const agentName = agent?.fullDesignation || agent?.displayName || 'our team'
  const population = cityData?.population ? formatNumber(cityData.population) : null

  let communityDescription = `${cityName} is a vibrant community`
  if (population) {
    communityDescription += ` of ${population} residents`
  }

  const diversityIndex = (cityData as any)?.demographics?.diversityIndex
  if (diversityIndex && diversityIndex >= 60) {
    communityDescription += `, known for its cultural diversity and welcoming atmosphere`
  }

  return `
${communityDescription}. From excellent schools to thriving local businesses, this area offers something for everyone.

${agentName} has deep roots in ${cityName} and is passionate about helping families find their perfect home in this wonderful community. Whether you're relocating or looking to invest, you'll find the guidance you need here.
`.trim()
}

/**
 * Generate Intro Section - Variant 4 (Buyer-Focused)
 */
export function generateIntroBuyerFocusedSection(context: GeneratorContext): string {
  const { agent, cityData } = context
  const cityName = cityData?.cityName || agent?.city || 'your new neighborhood'
  const agentName = agent?.fullDesignation || agent?.displayName || 'your agent'
  const daysOnMarket = cityData?.avgDaysOnMarket

  let timingAdvice = ''
  if (daysOnMarket) {
    if (daysOnMarket < 30) {
      timingAdvice = 'Homes are selling quickly here, so being prepared is essential.'
    } else if (daysOnMarket < 60) {
      timingAdvice = 'You\'ll have reasonable time to make decisions, but attractive properties move fast.'
    } else {
      timingAdvice = 'You\'ll have time to find the perfect property and negotiate favorable terms.'
    }
  }

  return `
Ready to buy a home in ${cityName}? You've come to the right place. This comprehensive guide covers everything you need to know about purchasing property in this desirable area.

${timingAdvice}

${agentName} has helped numerous buyers successfully navigate the ${cityName} market. Let's explore what this area has to offer and find your dream home.
`.trim()
}

/**
 * Generate Intro Section - Variant 5 (Investment-Focused)
 */
export function generateIntroInvestmentFocusedSection(context: GeneratorContext): string {
  const { agent, cityData } = context
  const cityName = cityData?.cityName || agent?.city || 'this market'
  const agentName = agent?.fullDesignation || agent?.displayName || 'our team'
  const medianRent = cityData?.medianRent ? formatCurrency(cityData.medianRent) : null
  const priceChange = cityData?.priceChange12Month

  let investmentHighlight = ''
  if (priceChange && priceChange > 5) {
    investmentHighlight = `With ${priceChange}% appreciation over the past year, ${cityName} has demonstrated strong growth potential.`
  } else if (medianRent) {
    investmentHighlight = `With median rents at ${medianRent}/month, ${cityName} offers attractive opportunities for rental income.`
  }

  return `
Looking to invest in ${cityName} real estate? Smart investors recognize the potential of this market. ${investmentHighlight}

${agentName} specializes in helping investors identify high-potential properties and maximize their returns. Let's explore the investment landscape of ${cityName} together.
`.trim()
}

/**
 * Generate Closing Section - Variant 1 (Standard CTA)
 */
export function generateClosingStandardSection(context: GeneratorContext): string {
  const { agent, cityData } = context
  const cityName = cityData?.cityName || agent?.city || 'the area'
  const agentName = agent?.fullDesignation || agent?.displayName || 'us'

  return `
## Ready to Take the Next Step?

Whether you're buying, selling, or investing in ${cityName}, ${agentName} is ready to help you achieve your real estate goals. Contact us today for a personalized consultation.

${agent?.phone ? `📞 **Call:** ${agent.phone}` : ''}
${agent?.email ? `📧 **Email:** ${agent.email}` : ''}
${agent?.website ? `🌐 **Website:** ${agent.website}` : ''}
`.trim()
}

/**
 * Generate Closing Section - Variant 2 (Urgency-Based)
 */
export function generateClosingUrgencySection(context: GeneratorContext): string {
  const { agent, cityData } = context
  const cityName = cityData?.cityName || agent?.city || 'this market'
  const agentName = agent?.fullDesignation || agent?.displayName || 'us'
  const trend = cityData?.marketTrend

  let urgencyMessage = ''
  if (trend === 'hot-seller' || trend === 'moderate-seller') {
    urgencyMessage = `In today's competitive ${cityName} market, timing is everything. Homes are selling quickly, and opportunities don't wait.`
  } else {
    urgencyMessage = `Now is an excellent time to explore the ${cityName} market. Current conditions favor prepared buyers who act decisively.`
  }

  return `
## Don't Miss Your Opportunity

${urgencyMessage}

**Contact ${agentName} today** to get started on your real estate journey. The sooner you reach out, the sooner you can secure your ideal property.

${agent?.phone ? `📞 **Call Now:** ${agent.phone}` : ''}
${agent?.email ? `📧 **Email:** ${agent.email}` : ''}
`.trim()
}

/**
 * Generate Closing Section - Variant 3 (Value-Proposition)
 */
export function generateClosingValueSection(context: GeneratorContext): string {
  const { agent, cityData } = context
  const cityName = cityData?.cityName || agent?.city || 'the area'
  const agentName = agent?.fullDesignation || agent?.displayName || 'our team'

  const jsonLd = (agent as any)?.seo?.jsonLd
  const rating = jsonLd?.aggregateRating?.ratingValue
  const reviewCount = jsonLd?.aggregateRating?.reviewCount

  let credibilityStatement = ''
  if (rating && rating >= 4.5 && reviewCount && reviewCount >= 10) {
    credibilityStatement = `Rated ${rating} stars by ${reviewCount}+ satisfied clients, ${agentName} delivers results.`
  } else if (agent?.experience && agent.experience >= 5) {
    credibilityStatement = `With ${agent.experience}+ years of experience in ${cityName}, ${agentName} has the expertise you need.`
  }

  return `
## Why Work With ${agentName}?

${credibilityStatement}

✅ Deep local market knowledge
✅ Personalized service for every client
✅ Strong negotiation skills
✅ Proven track record of success

**Ready to get started?** Reach out today for a no-obligation consultation.

${agent?.phone ? `📞 ${agent.phone}` : ''} ${agent?.email ? `| 📧 ${agent.email}` : ''}
`.trim()
}

/**
 * Generate Transportation Section
 */
export function generateTransportationSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData) return ''

  const cityName = cityData.cityName

  // This is a placeholder - would be enhanced with actual transportation data
  return `
## Getting Around ${cityName}

${cityName} offers various transportation options for residents and visitors. The area features well-maintained roads and convenient access to major highways, making commuting and travel convenient.
`.trim()
}

/**
 * Generate Cost of Living Section
 */
export function generateCostOfLivingSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData) return ''

  const cityName = cityData.cityName
  const medianPrice = cityData.medianHomePrice
  const medianRent = cityData.medianRent

  if (!medianPrice && !medianRent) return ''

  let content = `## Cost of Living in ${cityName}\n\n`

  if (medianPrice) {
    content += `**Housing Costs:** The median home price in ${cityName} is ${formatCurrency(medianPrice)}, `
    if (medianPrice < 300000) {
      content += 'which is relatively affordable compared to many metropolitan areas.\n\n'
    } else if (medianPrice < 500000) {
      content += 'reflecting the area\'s desirability and quality of life.\n\n'
    } else {
      content += 'positioning it as a premium real estate market.\n\n'
    }
  }

  if (medianRent) {
    content += `**Rental Market:** For renters, median monthly rent is ${formatCurrency(medianRent)}, `
    if (medianRent < 1500) {
      content += 'offering affordable options for residents.'
    } else if (medianRent < 2500) {
      content += 'in line with the area\'s amenities and location.'
    } else {
      content += 'reflecting strong rental demand in this market.'
    }
  }

  return content.trim()
}

/**
 * Generate Healthcare Section
 */
export function generateHealthcareSection(context: GeneratorContext): string {
  const { cityData } = context
  if (!cityData) return ''

  const cityName = cityData.cityName

  // This is a placeholder - would be enhanced with actual healthcare data
  return `
## Healthcare in ${cityName}

${cityName} residents have access to quality healthcare services. The area is served by various medical facilities, clinics, and healthcare providers, ensuring families have the medical care they need.
`.trim()
}

/**
 * Generate Hot Deals Section
 * Shows agent's featured listings, promotions, and hot deals
 */
export function generateHotDealsSection(context: GeneratorContext): string {
  const { agent } = context
  if (!agent) return ''

  const hotDeals = (agent as any).hotDeals as Array<{
    title: string
    description?: string
    dealType?: string
    price?: string
    link?: string
    isActive?: boolean
    expiresAt?: string
    priority?: number
  }> | undefined

  if (!hotDeals?.length) return ''

  const now = new Date()
  const activeDeals = hotDeals
    .filter((deal) => {
      if (!deal.isActive) return false
      if (deal.expiresAt && new Date(deal.expiresAt) < now) return false
      return true
    })
    .sort((a, b) => (b.priority || 50) - (a.priority || 50))
    .slice(0, 5)

  if (!activeDeals.length) return ''

  const agentName = agent.displayName || agent.name

  let content = `## Hot Deals from ${agentName}\n\n`
  content += `Don't miss these exclusive listings and special offers:\n\n`

  activeDeals.forEach((deal, index) => {
    const dealTypeLabels: Record<string, string> = {
      'listing': '🏠 Featured Listing',
      'promo': '🎉 Special Promotion',
      'offer': '💰 Limited Offer',
      'open-house': '🚪 Open House',
      'price-drop': '📉 Price Reduced',
      'event': '📅 Event',
    }

    content += `### ${dealTypeLabels[deal.dealType || 'listing'] || '🏠'} ${deal.title}\n\n`

    if (deal.price) {
      content += `**Price:** ${deal.price}\n\n`
    }

    if (deal.description) {
      content += `${deal.description}\n\n`
    }

    if (deal.link) {
      content += `[View Details](${deal.link})\n\n`
    }

    if (index < activeDeals.length - 1) {
      content += '---\n\n'
    }
  })

  return content.trim()
}

/**
 * Generate Announcements Section
 * Shows announcements, news, and alerts relevant to the context
 */
export function generateAnnouncementsSection(context: GeneratorContext): string {
  const { announcements, cityData, agent } = context
  if (!announcements?.length) return ''

  const location = cityData?.cityName || (agent?.city ? agent.city : 'Your Area')

  let content = `## News & Announcements for ${location}\n\n`

  announcements.slice(0, 5).forEach((ann, index) => {
    const typeIcons: Record<string, string> = {
      'banner': '📢',
      'alert': '⚠️',
      'news': '📰',
      'promo': '🎉',
      'hot-deal': '🔥',
      'market-update': '📊',
      'event': '📅',
    }

    const icon = typeIcons[ann.type || 'news'] || '📰'

    content += `### ${icon} ${ann.title}\n\n`

    if (ann.excerpt) {
      content += `${ann.excerpt}\n\n`
    }

    if (ann.cta?.text && ann.cta?.link) {
      content += `[${ann.cta.text}](${ann.cta.link})\n\n`
    }

    if (index < Math.min(announcements.length, 5) - 1) {
      content += '---\n\n'
    }
  })

  return content.trim()
}

/**
 * Generate Market Updates Section
 * Specifically for market update type announcements
 */
export function generateMarketUpdatesSection(context: GeneratorContext): string {
  const { announcements, cityData } = context
  if (!announcements?.length) return ''

  const marketUpdates = announcements.filter((a) => a.type === 'market-update')
  if (!marketUpdates.length) return ''

  const location = cityData?.cityName || 'Your Area'

  let content = `## Market Updates for ${location}\n\n`
  content += `Stay informed with the latest real estate market news:\n\n`

  marketUpdates.slice(0, 3).forEach((ann) => {
    content += `### 📊 ${ann.title}\n\n`

    if (ann.excerpt) {
      content += `${ann.excerpt}\n\n`
    }

    if (ann.cta?.text && ann.cta?.link) {
      content += `[${ann.cta.text}](${ann.cta.link})\n\n`
    }
  })

  return content.trim()
}

/**
 * Generate Promotions Section
 * Shows promotional announcements and hot deals
 */
export function generatePromotionsSection(context: GeneratorContext): string {
  const { announcements, agent } = context
  if (!announcements?.length) return ''

  const promos = announcements.filter((a) => a.type === 'promo' || a.type === 'hot-deal')
  if (!promos.length) return ''

  const agentName = agent?.displayName || agent?.name || 'Your Agent'

  let content = `## Current Promotions\n\n`
  content += `Check out these special offers:\n\n`

  promos.slice(0, 3).forEach((ann) => {
    const icon = ann.type === 'hot-deal' ? '🔥' : '🎉'
    content += `### ${icon} ${ann.title}\n\n`

    if (ann.excerpt) {
      content += `${ann.excerpt}\n\n`
    }

    if (ann.cta?.text && ann.cta?.link) {
      content += `[${ann.cta.text}](${ann.cta.link})\n\n`
    }
  })

  return content.trim()
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

  // Intro Variants (for tenant variation)
  intro_standard: generateIntroStandardSection,
  intro_market: generateIntroMarketFocusedSection,
  intro_community: generateIntroCommunityFocusedSection,
  intro_buyer: generateIntroBuyerFocusedSection,
  intro_investment: generateIntroInvestmentFocusedSection,

  // Closing Variants (for tenant variation)
  closing_standard: generateClosingStandardSection,
  closing_urgency: generateClosingUrgencySection,
  closing_value: generateClosingValueSection,

  // Additional City-Specific Sections
  transportation: generateTransportationSection,
  cost_of_living: generateCostOfLivingSection,
  healthcare: generateHealthcareSection,

  // Hot Deals & Announcements
  hot_deals: generateHotDealsSection,
  announcements: generateAnnouncementsSection,
  market_updates: generateMarketUpdatesSection,
  promotions: generatePromotionsSection,
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
