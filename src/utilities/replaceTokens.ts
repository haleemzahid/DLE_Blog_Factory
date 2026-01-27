import type { Agent, CityDatum, State, Media } from '@/payload-types'

/**
 * Token replacement utility for content templates
 * Replaces {{TOKEN_NAME}} patterns with actual data from Agent and CityData
 */

interface TokenContext {
  agent?: Agent | null
  cityData?: CityDatum | null
  post?: {
    title?: string
    slug?: string
    publishedAt?: string
  } | null
  custom?: Record<string, string>
}

/**
 * Get media URL from Media object
 */
function getMediaUrl(media: number | Media | null | undefined): string {
  if (!media || typeof media === 'number') return ''
  return media.url || ''
}

/**
 * Get state name from State object
 */
function getStateName(state: number | State | null | undefined): string {
  if (!state || typeof state === 'number') return ''
  return state.name || ''
}

/**
 * Format a number with commas
 */
function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return ''
  return num.toLocaleString()
}

/**
 * Format currency
 */
function formatCurrency(num: number | null | undefined): string {
  if (num === null || num === undefined) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Extract array of strings from a typed array field
 */
function extractArrayField<T>(
  arr: T[] | null | undefined,
  key: keyof T,
): string {
  if (!arr || arr.length === 0) return ''
  return arr
    .map((item) => item[key])
    .filter(Boolean)
    .join(', ')
}

/**
 * Build all available tokens from context
 */
function buildTokenMap(context: TokenContext): Record<string, string> {
  const { agent, cityData, post, custom } = context
  const tokens: Record<string, string> = {}

  // Custom tokens take precedence
  if (custom) {
    Object.entries(custom).forEach(([key, value]) => {
      tokens[key] = value
    })
  }

  // Agent tokens
  if (agent) {
    const seo = (agent as any).seo
    const keywords = seo?.keywords
    const jsonLd = seo?.jsonLd
    const culturalExpertise = (agent as any).culturalExpertise

    // Basic agent info
    tokens['AGENT_NAME'] = agent.name || ''
    tokens['AGENT_DISPLAY_NAME'] = agent.displayName || ''
    tokens['AGENT_DESIGNATION'] = agent.fullDesignation || agent.displayName || ''
    tokens['AGENT_CITY'] = agent.city || ''
    tokens['AGENT_STATE'] = getStateName(agent.state)
    tokens['AGENT_PHONE'] = agent.phone || ''
    tokens['AGENT_EMAIL'] = agent.email || ''
    tokens['AGENT_WEBSITE'] = agent.website || ''
    tokens['AGENT_BIO'] = agent.shortBio || ''
    tokens['AGENT_TAGLINE'] = agent.tagline || ''
    tokens['AGENT_DRE_LICENSE'] = agent.dreLicense || ''
    tokens['AGENT_EXPERIENCE'] = agent.experience?.toString() || ''
    tokens['AGENT_SLUG'] = agent.slug || ''
    tokens['AGENT_PROFILE_PHOTO'] = getMediaUrl(agent.profilePhoto)
    tokens['AGENT_LOGO'] = getMediaUrl(agent.logo)

    // Address
    if (agent.address) {
      tokens['AGENT_ADDRESS_STREET'] = agent.address.street || ''
      tokens['AGENT_ADDRESS_CITY'] = agent.address.city || ''
      tokens['AGENT_ADDRESS_STATE'] = agent.address.state || ''
      tokens['AGENT_ADDRESS_ZIP'] = agent.address.zip || ''
      tokens['AGENT_FULL_ADDRESS'] = [
        agent.address.street,
        agent.address.city,
        agent.address.state,
        agent.address.zip,
      ]
        .filter(Boolean)
        .join(', ')
    }

    // Brokerage
    if (agent.brokerage) {
      tokens['AGENT_BROKERAGE'] = agent.brokerage.name || ''
      tokens['AGENT_BROKERAGE_LOGO'] = getMediaUrl(agent.brokerage.logo)
    }

    // Social links
    if (agent.socialLinks) {
      tokens['AGENT_FACEBOOK'] = agent.socialLinks.facebook || ''
      tokens['AGENT_INSTAGRAM'] = agent.socialLinks.instagram || ''
      tokens['AGENT_LINKEDIN'] = agent.socialLinks.linkedin || ''
      tokens['AGENT_YOUTUBE'] = agent.socialLinks.youtube || ''
      tokens['AGENT_TWITTER'] = agent.socialLinks.twitter || ''
      tokens['AGENT_TIKTOK'] = agent.socialLinks.tiktok || ''
      tokens['AGENT_PINTEREST'] = agent.socialLinks.pinterest || ''
      tokens['AGENT_GOOGLE_MAPS'] = agent.socialLinks.googleMaps || ''
    }

    // Working hours
    if (agent.workingHours && agent.workingHours.length > 0) {
      tokens['AGENT_WORKING_HOURS'] = agent.workingHours
        .filter((wh) => wh.day && wh.hours)
        .map((wh) => `${wh.day}: ${wh.hours}`)
        .join(', ')
    }

    // Services
    if (agent.services && agent.services.length > 0) {
      tokens['AGENT_SERVICES'] = agent.services.map((s) => s.title).join(', ')
    }

    // Certifications
    if (agent.certifications && agent.certifications.length > 0) {
      tokens['AGENT_CERTIFICATIONS'] = agent.certifications
        .map((c) => c.abbreviation || c.title)
        .join(', ')
    }

    // SEO Keywords
    if (keywords) {
      if (keywords.primary) {
        tokens['AGENT_PRIMARY_KEYWORDS'] = keywords.primary
          .map((k: { keyword?: string }) => k.keyword)
          .filter(Boolean)
          .join(', ')
      }
      if (keywords.secondary) {
        tokens['AGENT_SECONDARY_KEYWORDS'] = keywords.secondary
          .map((k: { keyword?: string }) => k.keyword)
          .filter(Boolean)
          .join(', ')
      }
      if (keywords.geographic) {
        tokens['AGENT_GEO_KEYWORDS'] = keywords.geographic
          .map((k: { keyword?: string }) => k.keyword)
          .filter(Boolean)
          .join(', ')
      }
      if (keywords.services) {
        tokens['AGENT_SERVICE_KEYWORDS'] = keywords.services
          .map((k: { keyword?: string }) => k.keyword)
          .filter(Boolean)
          .join(', ')
      }
    }

    // JSON-LD data
    if (jsonLd) {
      if (jsonLd.areaServed) {
        tokens['AGENT_AREAS_SERVED'] = jsonLd.areaServed
          .map((a: { name?: string }) => a.name)
          .filter(Boolean)
          .join(', ')
      }
      if (jsonLd.knowsAbout) {
        tokens['AGENT_EXPERTISE'] = jsonLd.knowsAbout
          .map((k: { topic?: string }) => k.topic)
          .filter(Boolean)
          .join(', ')
      }
      if (jsonLd.priceRange) {
        tokens['AGENT_PRICE_RANGE'] = jsonLd.priceRange
      }
      if (jsonLd.aggregateRating) {
        const rating = jsonLd.aggregateRating
        tokens['AGENT_RATING'] = rating.ratingValue?.toString() || ''
        tokens['AGENT_REVIEW_COUNT'] = rating.reviewCount?.toString() || ''
        tokens['AGENT_RATING_SUMMARY'] = rating.ratingValue
          ? `${rating.ratingValue} stars from ${rating.reviewCount || 0} reviews`
          : ''
      }
    }

    // Cultural expertise
    if (culturalExpertise) {
      if (culturalExpertise.languagesSpoken) {
        tokens['AGENT_LANGUAGES'] = culturalExpertise.languagesSpoken
          .map((l: { language?: string; proficiency?: string }) => {
            if (l.proficiency && l.proficiency !== 'native') {
              return `${l.language} (${l.proficiency})`
            }
            return l.language
          })
          .filter(Boolean)
          .join(', ')
      }
      if (culturalExpertise.culturalSpecializations) {
        tokens['AGENT_CULTURAL_SPECIALIZATIONS'] = culturalExpertise.culturalSpecializations
          .map((c: { community?: string }) => c.community)
          .filter(Boolean)
          .join(', ')
      }
      if (culturalExpertise.communityInvolvement) {
        tokens['AGENT_COMMUNITY_INVOLVEMENT'] = culturalExpertise.communityInvolvement
          .map((c: { organization?: string; role?: string }) =>
            c.role ? `${c.role} at ${c.organization}` : c.organization,
          )
          .filter(Boolean)
          .join(', ')
      }
    }

    // FAQs count
    if (agent.faqs) {
      tokens['AGENT_FAQ_COUNT'] = agent.faqs.length.toString()
    }
  }

  // City Data tokens
  if (cityData) {
    const demographics = cityData.demographics as any
    const languagesSpoken = cityData.languagesSpoken as any[]
    const placesOfWorship = cityData.placesOfWorship as any[]
    const culturalCenters = cityData.culturalCenters as any[]
    const ethnicCuisine = cityData.ethnicCuisine as any[]
    const culturalEvents = cityData.culturalEvents as any[]
    const communityAmenities = cityData.communityAmenities as any[]

    // Basic city info
    tokens['CITY_NAME'] = cityData.cityName || ''
    tokens['STATE_NAME'] = typeof cityData.state === 'object' ? (cityData.state as State).name : ''
    tokens['CITY_REGION'] = cityData.region || ''

    // Market stats
    tokens['CITY_POPULATION'] = formatNumber(cityData.population)
    tokens['MEDIAN_PRICE'] = formatCurrency(cityData.medianHomePrice)
    tokens['MEDIAN_HOME_PRICE'] = formatCurrency(cityData.medianHomePrice)
    tokens['MEDIAN_RENT'] = formatCurrency(cityData.medianRent)
    tokens['PRICE_CHANGE'] = cityData.priceChange12Month
      ? `${cityData.priceChange12Month > 0 ? '+' : ''}${cityData.priceChange12Month}%`
      : ''
    tokens['DAYS_ON_MARKET'] = cityData.avgDaysOnMarket?.toString() || ''
    tokens['HOMES_SOLD_30_DAYS'] = formatNumber(cityData.salesCount30Days)

    // Market trend labels
    const trendLabels: Record<string, string> = {
      'hot-seller': 'Hot Seller Market',
      'moderate-seller': 'Moderate Seller Market',
      balanced: 'Balanced Market',
      'moderate-buyer': 'Moderate Buyer Market',
      'hot-buyer': 'Hot Buyer Market',
    }
    tokens['MARKET_TREND'] = trendLabels[cityData.marketTrend || ''] || ''

    const inventoryLabels: Record<string, string> = {
      'very-low': 'Very Low (< 2 months)',
      low: 'Low (2-4 months)',
      balanced: 'Balanced (4-6 months)',
      high: 'High (6-8 months)',
      'very-high': 'Very High (> 8 months)',
    }
    tokens['INVENTORY_LEVEL'] = inventoryLabels[cityData.inventoryLevel || ''] || ''

    // Neighborhoods
    if (cityData.neighborhoods && cityData.neighborhoods.length > 0) {
      tokens['NEIGHBORHOODS'] = cityData.neighborhoods
        .map((n: any) => n.name)
        .filter(Boolean)
        .join(', ')
      tokens['NEIGHBORHOODS_WITH_PRICES'] = cityData.neighborhoods
        .filter((n: any) => n.name && n.avgPrice)
        .map((n: any) => `${n.name} (${formatCurrency(n.avgPrice)})`)
        .join(', ')
    }

    // Schools
    if (cityData.topSchools && cityData.topSchools.length > 0) {
      tokens['TOP_SCHOOLS'] = cityData.topSchools
        .map((s: any) => s.name)
        .filter(Boolean)
        .join(', ')
      tokens['TOP_SCHOOLS_WITH_RATINGS'] = cityData.topSchools
        .filter((s: any) => s.name)
        .map((s: any) => (s.rating ? `${s.name} (${s.rating}/10)` : s.name))
        .join(', ')
    }

    // Unique facts
    if (cityData.uniqueFacts && cityData.uniqueFacts.length > 0) {
      tokens['UNIQUE_FACTS'] = cityData.uniqueFacts
        .map((f: any) => f.fact)
        .filter(Boolean)
        .join('. ')
      tokens['UNIQUE_FACTS_LIST'] = cityData.uniqueFacts
        .map((f: any) => `• ${f.fact}`)
        .filter(Boolean)
        .join('\n')
    }

    // Key employers
    if (cityData.keyEmployers && cityData.keyEmployers.length > 0) {
      tokens['KEY_EMPLOYERS'] = cityData.keyEmployers
        .map((e: any) => e.name)
        .filter(Boolean)
        .join(', ')
      tokens['KEY_EMPLOYERS_WITH_INDUSTRIES'] = cityData.keyEmployers
        .filter((e: any) => e.name)
        .map((e: any) => (e.industry ? `${e.name} (${e.industry})` : e.name))
        .join(', ')
    }

    tokens['NEARBY_CITY'] = cityData.nearbyCity || ''

    // Demographics
    if (demographics) {
      tokens['CITY_DIVERSITY_INDEX'] = demographics.diversityIndex?.toString() || ''
      tokens['CITY_MEDIAN_AGE'] = demographics.medianAge?.toString() || ''
      tokens['CITY_FAMILY_HOUSEHOLDS'] = demographics.familyHouseholds
        ? `${demographics.familyHouseholds}%`
        : ''

      if (demographics.ethnicBreakdown && demographics.ethnicBreakdown.length > 0) {
        tokens['CITY_ETHNIC_BREAKDOWN'] = demographics.ethnicBreakdown
          .filter((e: any) => e.ethnicity && e.percentage)
          .map((e: any) => `${e.ethnicity}: ${e.percentage}%`)
          .join(', ')
      }
    }

    // Languages spoken in city
    if (languagesSpoken && languagesSpoken.length > 0) {
      tokens['CITY_LANGUAGES'] = languagesSpoken
        .filter((l: any) => l.language)
        .map((l: any) =>
          l.percentageOfPopulation
            ? `${l.language} (${l.percentageOfPopulation}%)`
            : l.language,
        )
        .join(', ')
    }

    // Places of worship
    if (placesOfWorship && placesOfWorship.length > 0) {
      tokens['CITY_PLACES_OF_WORSHIP'] = placesOfWorship
        .map((p: any) => p.name)
        .filter(Boolean)
        .join(', ')

      // Filter by religion type
      const religionMap: Record<string, string[]> = {}
      placesOfWorship.forEach((p: any) => {
        if (p.name && p.religion) {
          if (!religionMap[p.religion]) religionMap[p.religion] = []
          religionMap[p.religion].push(p.name)
        }
      })

      tokens['CITY_CHURCHES'] = [
        ...(religionMap['catholic'] || []),
        ...(religionMap['protestant'] || []),
        ...(religionMap['orthodox'] || []),
        ...(religionMap['non-denominational'] || []),
      ].join(', ')
      tokens['CITY_TEMPLES'] = [
        ...(religionMap['hindu'] || []),
        ...(religionMap['buddhist'] || []),
        ...(religionMap['sikh'] || []),
      ].join(', ')
      tokens['CITY_MOSQUES'] = (religionMap['muslim'] || []).join(', ')
      tokens['CITY_SYNAGOGUES'] = (religionMap['jewish'] || []).join(', ')
    }

    // Cultural centers
    if (culturalCenters && culturalCenters.length > 0) {
      tokens['CITY_CULTURAL_CENTERS'] = culturalCenters
        .map((c: any) => c.name)
        .filter(Boolean)
        .join(', ')
    }

    // Ethnic cuisine
    if (ethnicCuisine && ethnicCuisine.length > 0) {
      tokens['CITY_ETHNIC_CUISINE'] = ethnicCuisine
        .filter((c: any) => c.cuisineType)
        .map((c: any) =>
          c.popularSpots ? `${c.cuisineType} (${c.popularSpots})` : c.cuisineType,
        )
        .join(', ')
      tokens['CITY_CUISINE_TYPES'] = ethnicCuisine
        .map((c: any) => c.cuisineType)
        .filter(Boolean)
        .join(', ')
    }

    // Cultural events
    if (culturalEvents && culturalEvents.length > 0) {
      tokens['CITY_CULTURAL_EVENTS'] = culturalEvents
        .filter((e: any) => e.name)
        .map((e: any) => (e.timing ? `${e.name} (${e.timing})` : e.name))
        .join(', ')
    }

    // Community amenities
    if (communityAmenities && communityAmenities.length > 0) {
      tokens['CITY_AMENITIES'] = communityAmenities
        .map((a: any) => a.name)
        .filter(Boolean)
        .join(', ')

      // Filter by type
      const amenityMap: Record<string, string[]> = {}
      communityAmenities.forEach((a: any) => {
        if (a.name && a.type) {
          if (!amenityMap[a.type]) amenityMap[a.type] = []
          amenityMap[a.type].push(a.name)
        }
      })

      tokens['CITY_PARKS'] = (amenityMap['park'] || []).join(', ')
      tokens['CITY_LIBRARIES'] = (amenityMap['library'] || []).join(', ')
      tokens['CITY_RECREATION'] = (amenityMap['recreation'] || []).join(', ')
      tokens['CITY_MUSEUMS'] = (amenityMap['museum'] || []).join(', ')
    }

    // Data source and last updated
    tokens['CITY_DATA_SOURCE'] = cityData.dataSource || ''
    tokens['CITY_LAST_UPDATED'] = cityData.lastUpdated
      ? new Date(cityData.lastUpdated).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : ''
  }

  // Post tokens
  if (post) {
    tokens['POST_TITLE'] = post.title || ''
    tokens['POST_SLUG'] = post.slug || ''
    tokens['POST_DATE'] = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : ''
  }

  // Date tokens
  tokens['CURRENT_YEAR'] = new Date().getFullYear().toString()
  tokens['CURRENT_MONTH'] = new Date().toLocaleDateString('en-US', { month: 'long' })
  tokens['CURRENT_DATE'] = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return tokens
}

/**
 * Replace all tokens in content string with values from context
 */
export function replaceTokens(content: string, context: TokenContext): string {
  const tokens = buildTokenMap(context)

  // Replace all {{TOKEN}} patterns
  return content.replace(/\{\{([A-Z_]+)\}\}/g, (match, tokenName) => {
    return tokens[tokenName] ?? match // Return original if token not found
  })
}

/**
 * Get all available tokens with their current values
 * Useful for debugging and admin preview
 */
export function getAvailableTokens(context: TokenContext): Record<string, string> {
  return buildTokenMap(context)
}

/**
 * Check if content contains any tokens that don't have values
 */
export function findMissingTokens(content: string, context: TokenContext): string[] {
  const tokens = buildTokenMap(context)
  const usedTokens = content.match(/\{\{([A-Z_]+)\}\}/g) || []
  const missing: string[] = []

  usedTokens.forEach((match) => {
    const tokenName = match.replace(/\{\{|\}\}/g, '')
    if (!tokens[tokenName] || tokens[tokenName] === '') {
      if (!missing.includes(tokenName)) {
        missing.push(tokenName)
      }
    }
  })

  return missing
}

/**
 * Extract all token names used in content
 */
export function extractTokensFromContent(content: string): string[] {
  const matches = content.match(/\{\{([A-Z_]+)\}\}/g) || []
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '')))]
}

export default replaceTokens
