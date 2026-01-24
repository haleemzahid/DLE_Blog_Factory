/**
 * JSON-LD Import Utility
 * Allows importing JSON-LD schema data from external sources (Google Business, Zillow, etc.)
 * and mapping it to Agent collection fields
 */

interface JsonLdData {
  '@context'?: string
  '@type'?: string | string[]
  '@id'?: string
  name?: string
  legalName?: string
  description?: string
  image?: string | { url?: string }
  logo?: string | { url?: string }
  telephone?: string
  email?: string
  url?: string
  address?: {
    '@type'?: string
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  geo?: {
    '@type'?: string
    latitude?: number
    longitude?: number
  }
  priceRange?: string
  areaServed?: Array<{ '@type'?: string; name?: string }> | string[]
  knowsAbout?: string[] | Array<{ name?: string }>
  knowsLanguage?: string[] | Array<{ '@type'?: string; name?: string }>
  sameAs?: string[]
  openingHours?: string[]
  aggregateRating?: {
    '@type'?: string
    ratingValue?: number | string
    reviewCount?: number | string
    bestRating?: number | string
  }
  review?: Array<{
    '@type'?: string
    author?: { '@type'?: string; name?: string } | string
    reviewRating?: { '@type'?: string; ratingValue?: number | string }
    reviewBody?: string
  }>
  memberOf?: {
    '@type'?: string
    name?: string
    logo?: string
  }
  hasCredential?: Array<{
    '@type'?: string
    credentialCategory?: string
    name?: string
  }>
  [key: string]: any
}

interface AgentImportData {
  // Basic info
  displayName?: string
  name?: string
  shortBio?: string

  // Contact
  phone?: string
  email?: string
  website?: string

  // Address
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }

  // SEO Keywords (inferred)
  seo?: {
    jsonLd?: {
      enabled?: boolean
      geoCoordinates?: {
        latitude?: number
        longitude?: number
      }
      priceRange?: string
      areaServed?: Array<{
        name: string
        type: string
      }>
      knowsAbout?: Array<{
        topic: string
      }>
      sameAs?: Array<{
        url: string
      }>
      aggregateRating?: {
        ratingValue?: number
        reviewCount?: number
        bestRating?: number
      }
    }
  }

  // Cultural expertise
  culturalExpertise?: {
    languagesSpoken?: Array<{
      language: string
      proficiency: string
    }>
  }

  // Brokerage
  brokerage?: {
    name?: string
  }

  // Social links (extracted from sameAs)
  socialLinks?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    twitter?: string
    tiktok?: string
    pinterest?: string
    googleMaps?: string
  }

  // Working hours
  workingHours?: Array<{
    day: string
    hours: string
  }>
}

/**
 * Extract JSON-LD scripts from HTML content
 */
export function extractJsonLdFromHtml(html: string): JsonLdData[] {
  const regex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const matches = [...html.matchAll(regex)]
  const results: JsonLdData[] = []

  matches.forEach((match) => {
    try {
      const json = JSON.parse(match[1].trim())
      // Handle both single objects and arrays
      if (Array.isArray(json)) {
        results.push(...json)
      } else {
        results.push(json)
      }
    } catch (e) {
      console.warn('Failed to parse JSON-LD:', e)
    }
  })

  return results
}

/**
 * Find the most relevant JSON-LD schema for a real estate agent
 */
export function findRelevantSchema(schemas: JsonLdData[]): JsonLdData | null {
  // Priority order of schema types
  const priority = [
    'RealEstateAgent',
    'LocalBusiness',
    'Person',
    'Organization',
    'ProfessionalService',
  ]

  for (const targetType of priority) {
    const found = schemas.find((schema) => {
      const types = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']]
      return types.some((t) => t === targetType)
    })
    if (found) return found
  }

  // Return first schema if no priority match
  return schemas[0] || null
}

/**
 * Extract image URL from various formats
 */
function extractImageUrl(image: string | { url?: string } | undefined): string | undefined {
  if (!image) return undefined
  if (typeof image === 'string') return image
  return image.url
}

/**
 * Parse opening hours string to day/hours objects
 */
function parseOpeningHours(hours: string[]): Array<{ day: string; hours: string }> {
  const dayMap: Record<string, string> = {
    Mo: 'monday',
    Tu: 'tuesday',
    We: 'wednesday',
    Th: 'thursday',
    Fr: 'friday',
    Sa: 'saturday',
    Su: 'sunday',
  }

  const result: Array<{ day: string; hours: string }> = []

  hours.forEach((h) => {
    // Format: "Mo 07:00-21:30" or "Mo-Fr 09:00-17:00"
    const match = h.match(/^([A-Za-z]{2}(?:-[A-Za-z]{2})?)\s+(.+)$/)
    if (match) {
      const dayPart = match[1]
      const timePart = match[2]

      if (dayPart.includes('-')) {
        // Range of days
        const [startDay, endDay] = dayPart.split('-')
        const days = Object.keys(dayMap)
        const startIdx = days.indexOf(startDay)
        const endIdx = days.indexOf(endDay)

        if (startIdx !== -1 && endIdx !== -1) {
          for (let i = startIdx; i <= endIdx; i++) {
            result.push({
              day: dayMap[days[i]],
              hours: timePart,
            })
          }
        }
      } else {
        // Single day
        if (dayMap[dayPart]) {
          result.push({
            day: dayMap[dayPart],
            hours: timePart,
          })
        }
      }
    }
  })

  return result
}

/**
 * Extract social media links from sameAs array
 */
function extractSocialLinks(sameAs: string[]): AgentImportData['socialLinks'] {
  const social: AgentImportData['socialLinks'] = {}

  sameAs.forEach((url) => {
    const lowerUrl = url.toLowerCase()

    if (lowerUrl.includes('facebook.com')) {
      social.facebook = url
    } else if (lowerUrl.includes('instagram.com')) {
      social.instagram = url
    } else if (lowerUrl.includes('linkedin.com')) {
      social.linkedin = url
    } else if (lowerUrl.includes('youtube.com')) {
      social.youtube = url
    } else if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
      social.twitter = url
    } else if (lowerUrl.includes('tiktok.com')) {
      social.tiktok = url
    } else if (lowerUrl.includes('pinterest.com')) {
      social.pinterest = url
    } else if (lowerUrl.includes('google.com/maps') || lowerUrl.includes('goo.gl/maps')) {
      social.googleMaps = url
    }
  })

  return social
}

/**
 * Map JSON-LD data to Agent import format
 */
export function mapJsonLdToAgent(jsonLd: JsonLdData): AgentImportData {
  const agentData: AgentImportData = {}

  // Basic info
  if (jsonLd.name) {
    agentData.displayName = jsonLd.name
  }
  if (jsonLd.legalName) {
    agentData.name = jsonLd.legalName
  }
  if (jsonLd.description) {
    agentData.shortBio = jsonLd.description
  }

  // Contact
  if (jsonLd.telephone) {
    agentData.phone = jsonLd.telephone
  }
  if (jsonLd.email) {
    agentData.email = jsonLd.email
  }
  if (jsonLd.url) {
    agentData.website = jsonLd.url
  }

  // Address
  if (jsonLd.address) {
    agentData.address = {
      street: jsonLd.address.streetAddress,
      city: jsonLd.address.addressLocality,
      state: jsonLd.address.addressRegion,
      zip: jsonLd.address.postalCode,
    }
  }

  // Initialize SEO object
  agentData.seo = {
    jsonLd: {
      enabled: true,
    },
  }

  // Geo coordinates
  if (jsonLd.geo?.latitude && jsonLd.geo?.longitude) {
    agentData.seo.jsonLd!.geoCoordinates = {
      latitude: jsonLd.geo.latitude,
      longitude: jsonLd.geo.longitude,
    }
  }

  // Price range
  if (jsonLd.priceRange) {
    agentData.seo.jsonLd!.priceRange = jsonLd.priceRange
  }

  // Areas served
  if (jsonLd.areaServed && Array.isArray(jsonLd.areaServed)) {
    agentData.seo.jsonLd!.areaServed = jsonLd.areaServed
      .map((area) => {
        if (typeof area === 'string') {
          return { name: area, type: 'City' }
        }
        return {
          name: area.name || '',
          type: area['@type'] || 'City',
        }
      })
      .filter((a) => a.name)
  }

  // Expertise/knows about
  if (jsonLd.knowsAbout && Array.isArray(jsonLd.knowsAbout)) {
    agentData.seo.jsonLd!.knowsAbout = jsonLd.knowsAbout
      .map((k) => {
        if (typeof k === 'string') {
          return { topic: k }
        }
        return { topic: k.name || '' }
      })
      .filter((k) => k.topic)
  }

  // sameAs links
  if (jsonLd.sameAs && Array.isArray(jsonLd.sameAs)) {
    // Extract social links
    agentData.socialLinks = extractSocialLinks(jsonLd.sameAs)

    // Store remaining sameAs links for authority
    const socialUrls = Object.values(agentData.socialLinks || {}).filter(Boolean)
    const otherLinks = jsonLd.sameAs.filter((url) => !socialUrls.includes(url))

    if (otherLinks.length > 0) {
      agentData.seo.jsonLd!.sameAs = otherLinks.map((url) => ({ url }))
    }
  }

  // Aggregate rating
  if (jsonLd.aggregateRating) {
    agentData.seo.jsonLd!.aggregateRating = {
      ratingValue:
        typeof jsonLd.aggregateRating.ratingValue === 'string'
          ? parseFloat(jsonLd.aggregateRating.ratingValue)
          : jsonLd.aggregateRating.ratingValue,
      reviewCount:
        typeof jsonLd.aggregateRating.reviewCount === 'string'
          ? parseInt(jsonLd.aggregateRating.reviewCount)
          : jsonLd.aggregateRating.reviewCount,
      bestRating:
        typeof jsonLd.aggregateRating.bestRating === 'string'
          ? parseFloat(jsonLd.aggregateRating.bestRating)
          : jsonLd.aggregateRating.bestRating || 5,
    }
  }

  // Languages
  if (jsonLd.knowsLanguage && Array.isArray(jsonLd.knowsLanguage)) {
    agentData.culturalExpertise = {
      languagesSpoken: jsonLd.knowsLanguage
        .map((l) => {
          const name = typeof l === 'string' ? l : l.name
          return {
            language: name || '',
            proficiency: 'fluent', // Default to fluent
          }
        })
        .filter((l) => l.language),
    }
  }

  // Working hours
  if (jsonLd.openingHours && Array.isArray(jsonLd.openingHours)) {
    agentData.workingHours = parseOpeningHours(jsonLd.openingHours)
  }

  // Brokerage (from memberOf)
  if (jsonLd.memberOf?.name) {
    agentData.brokerage = {
      name: jsonLd.memberOf.name,
    }
  }

  return agentData
}

/**
 * Fetch and extract JSON-LD from a URL
 * Note: This should be called from an API route, not client-side
 */
export async function importJsonLdFromUrl(url: string): Promise<AgentImportData> {
  try {
    // Validate URL
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'https:') {
      throw new Error('Only HTTPS URLs are supported for security')
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DLE-JsonLD-Importer/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()

    // Extract JSON-LD
    const schemas = extractJsonLdFromHtml(html)

    if (schemas.length === 0) {
      throw new Error('No JSON-LD schema found on the page')
    }

    // Find the most relevant schema
    const schema = findRelevantSchema(schemas)

    if (!schema) {
      throw new Error('No relevant agent/business schema found')
    }

    // Map to agent data
    return mapJsonLdToAgent(schema)
  } catch (error) {
    console.error('Error importing JSON-LD:', error)
    throw error
  }
}

/**
 * Parse raw JSON-LD text and map to agent data
 */
export function importJsonLdFromText(jsonText: string): AgentImportData {
  try {
    const parsed = JSON.parse(jsonText)
    const schemas = Array.isArray(parsed) ? parsed : [parsed]
    const schema = findRelevantSchema(schemas)

    if (!schema) {
      throw new Error('No relevant schema found in JSON-LD')
    }

    return mapJsonLdToAgent(schema)
  } catch (error) {
    console.error('Error parsing JSON-LD:', error)
    throw error
  }
}

/**
 * Get a preview of what fields will be imported
 */
export function getImportPreview(
  data: AgentImportData,
): Array<{ field: string; value: string; willImport: boolean }> {
  const preview: Array<{ field: string; value: string; willImport: boolean }> = []

  if (data.displayName) {
    preview.push({ field: 'Display Name', value: data.displayName, willImport: true })
  }
  if (data.name) {
    preview.push({ field: 'Legal Name', value: data.name, willImport: true })
  }
  if (data.phone) {
    preview.push({ field: 'Phone', value: data.phone, willImport: true })
  }
  if (data.email) {
    preview.push({ field: 'Email', value: data.email, willImport: true })
  }
  if (data.website) {
    preview.push({ field: 'Website', value: data.website, willImport: true })
  }
  if (data.shortBio) {
    preview.push({
      field: 'Bio',
      value: data.shortBio.substring(0, 100) + '...',
      willImport: true,
    })
  }

  // Address
  if (data.address) {
    const addr = [data.address.street, data.address.city, data.address.state, data.address.zip]
      .filter(Boolean)
      .join(', ')
    if (addr) {
      preview.push({ field: 'Address', value: addr, willImport: true })
    }
  }

  // Rating
  if (data.seo?.jsonLd?.aggregateRating?.ratingValue) {
    preview.push({
      field: 'Rating',
      value: `${data.seo.jsonLd.aggregateRating.ratingValue} (${data.seo.jsonLd.aggregateRating.reviewCount || 0} reviews)`,
      willImport: true,
    })
  }

  // Geo
  if (data.seo?.jsonLd?.geoCoordinates?.latitude) {
    preview.push({
      field: 'Coordinates',
      value: `${data.seo.jsonLd.geoCoordinates.latitude}, ${data.seo.jsonLd.geoCoordinates.longitude}`,
      willImport: true,
    })
  }

  // Areas served
  if (data.seo?.jsonLd?.areaServed && data.seo.jsonLd.areaServed.length > 0) {
    preview.push({
      field: 'Areas Served',
      value: data.seo.jsonLd.areaServed.map((a) => a.name).join(', '),
      willImport: true,
    })
  }

  // Languages
  if (data.culturalExpertise?.languagesSpoken && data.culturalExpertise.languagesSpoken.length > 0) {
    preview.push({
      field: 'Languages',
      value: data.culturalExpertise.languagesSpoken.map((l) => l.language).join(', '),
      willImport: true,
    })
  }

  // Social links
  if (data.socialLinks) {
    const socialCount = Object.values(data.socialLinks).filter(Boolean).length
    if (socialCount > 0) {
      preview.push({
        field: 'Social Links',
        value: `${socialCount} profiles found`,
        willImport: true,
      })
    }
  }

  // Working hours
  if (data.workingHours && data.workingHours.length > 0) {
    preview.push({
      field: 'Working Hours',
      value: `${data.workingHours.length} days configured`,
      willImport: true,
    })
  }

  return preview
}

export default {
  extractJsonLdFromHtml,
  findRelevantSchema,
  mapJsonLdToAgent,
  importJsonLdFromUrl,
  importJsonLdFromText,
  getImportPreview,
}
