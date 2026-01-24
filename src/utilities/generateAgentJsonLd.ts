import type { Agent, CityDatum, State, Media } from '@/payload-types'

interface AgentJsonLdOptions {
  agent: Agent
  baseUrl: string
  cityData?: CityDatum | null
  includeReviews?: boolean
}

interface BlogPostingJsonLdOptions {
  title: string
  description: string
  content?: string
  author: Agent
  datePublished: string
  dateModified?: string
  imageUrl?: string
  baseUrl: string
  slug: string
  keywords?: string[]
}

interface FAQJsonLdOptions {
  faqs: Array<{
    question: string
    answer: string
  }>
}

/**
 * Get the URL from a Media object or return undefined
 */
function getMediaUrl(media: number | Media | null | undefined): string | undefined {
  if (!media || typeof media === 'number') return undefined
  return media.url || undefined
}

/**
 * Get state name from State object or return undefined
 */
function getStateName(state: number | State | null | undefined): string | undefined {
  if (!state || typeof state === 'number') return undefined
  return state.name || undefined
}

/**
 * Generate RealEstateAgent/LocalBusiness JSON-LD schema for an agent
 */
export function generateAgentJsonLd({ agent, baseUrl, cityData }: AgentJsonLdOptions): object {
  // Build schema types array
  const schemaTypes = (agent as any).seo?.jsonLd?.schemaTypes || ['RealEstateAgent', 'LocalBusiness']
  const jsonLdConfig = (agent as any).seo?.jsonLd
  const keywords = (agent as any).seo?.keywords
  const culturalExpertise = (agent as any).culturalExpertise

  // Build sameAs array from social links and explicit sameAs entries
  const sameAsLinks: string[] = []
  if (agent.socialLinks?.facebook) sameAsLinks.push(agent.socialLinks.facebook)
  if (agent.socialLinks?.linkedin) sameAsLinks.push(agent.socialLinks.linkedin)
  if (agent.socialLinks?.instagram) sameAsLinks.push(agent.socialLinks.instagram)
  if (agent.socialLinks?.youtube) sameAsLinks.push(agent.socialLinks.youtube)
  if (agent.socialLinks?.twitter) sameAsLinks.push(agent.socialLinks.twitter)
  if (agent.socialLinks?.pinterest) sameAsLinks.push(agent.socialLinks.pinterest)
  if (agent.socialLinks?.tiktok) sameAsLinks.push(agent.socialLinks.tiktok)
  if (agent.socialLinks?.googleMaps) sameAsLinks.push(agent.socialLinks.googleMaps)
  if (jsonLdConfig?.sameAs) {
    jsonLdConfig.sameAs.forEach((s: { url?: string }) => {
      if (s.url) sameAsLinks.push(s.url)
    })
  }

  // Build keywords string
  const keywordsList: string[] = []
  if (keywords?.primary) {
    keywords.primary.forEach((k: { keyword?: string }) => {
      if (k.keyword) keywordsList.push(k.keyword)
    })
  }
  if (keywords?.geographic) {
    keywords.geographic.forEach((k: { keyword?: string }) => {
      if (k.keyword) keywordsList.push(k.keyword)
    })
  }

  // Build opening hours
  const openingHours: string[] = []
  if (agent.workingHours) {
    agent.workingHours.forEach((wh) => {
      if (wh.day && wh.hours) {
        const dayAbbrev = wh.day.charAt(0).toUpperCase() + wh.day.charAt(1)
        openingHours.push(`${dayAbbrev} ${wh.hours}`)
      }
    })
  }

  // Build areas served
  const areaServed: object[] = []
  if (jsonLdConfig?.areaServed) {
    jsonLdConfig.areaServed.forEach((area: { name?: string; type?: string }) => {
      if (area.name) {
        areaServed.push({
          '@type': area.type || 'City',
          name: area.name,
        })
      }
    })
  }

  // Build knows about (expertise)
  const knowsAbout: string[] = []
  if (jsonLdConfig?.knowsAbout) {
    jsonLdConfig.knowsAbout.forEach((k: { topic?: string }) => {
      if (k.topic) knowsAbout.push(k.topic)
    })
  }

  // Build languages known
  const knowsLanguage: object[] = []
  if (culturalExpertise?.languagesSpoken) {
    culturalExpertise.languagesSpoken.forEach((l: { language?: string }) => {
      if (l.language) {
        knowsLanguage.push({
          '@type': 'Language',
          name: l.language,
        })
      }
    })
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaTypes.length === 1 ? schemaTypes[0] : schemaTypes,
    '@id': `${baseUrl}/agents/${agent.slug}#agent`,

    // Identity
    name: agent.fullDesignation || agent.displayName,
    legalName: agent.name,
    description: agent.meta?.description || agent.shortBio || undefined,
    url: `${baseUrl}/agents/${agent.slug}`,

    // Images
    image: getMediaUrl(agent.profilePhoto),
    logo: getMediaUrl(agent.logo),

    // Contact
    telephone: agent.phone || undefined,
    email: agent.email || undefined,

    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: agent.address?.street || undefined,
      addressLocality: agent.address?.city || agent.city || undefined,
      addressRegion: agent.address?.state || getStateName(agent.state) || undefined,
      postalCode: agent.address?.zip || undefined,
      addressCountry: 'US',
    },

    // Keywords
    keywords: keywordsList.length > 0 ? keywordsList.join(', ') : undefined,

    // Opening hours
    openingHours: openingHours.length > 0 ? openingHours : undefined,

    // Price range
    priceRange: jsonLdConfig?.priceRange || undefined,

    // Social profiles
    sameAs: sameAsLinks.length > 0 ? sameAsLinks : undefined,
  }

  // Add geo coordinates if available
  if (jsonLdConfig?.geoCoordinates?.latitude && jsonLdConfig?.geoCoordinates?.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: jsonLdConfig.geoCoordinates.latitude,
      longitude: jsonLdConfig.geoCoordinates.longitude,
    }
  }

  // Add areas served if available
  if (areaServed.length > 0) {
    jsonLd.areaServed = areaServed
  }

  // Add expertise topics if available
  if (knowsAbout.length > 0) {
    jsonLd.knowsAbout = knowsAbout
  }

  // Add languages if available
  if (knowsLanguage.length > 0) {
    jsonLd.knowsLanguage = knowsLanguage
  }

  // Add aggregate rating if available
  if (jsonLdConfig?.aggregateRating?.ratingValue) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: jsonLdConfig.aggregateRating.ratingValue,
      reviewCount: jsonLdConfig.aggregateRating.reviewCount || 1,
      bestRating: jsonLdConfig.aggregateRating.bestRating || 5,
      worstRating: 1,
    }
  }

  // Add brokerage as member of
  if (agent.brokerage?.name) {
    jsonLd.memberOf = {
      '@type': 'Organization',
      name: agent.brokerage.name,
      logo: getMediaUrl(agent.brokerage.logo),
    }
  }

  // Add professional credentials
  if (agent.dreLicense) {
    jsonLd.hasCredential = {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Real Estate License',
      name: agent.dreLicense,
    }
  }

  // Clean undefined values
  return JSON.parse(JSON.stringify(jsonLd))
}

/**
 * Generate BlogPosting JSON-LD schema for a post
 */
export function generateBlogPostingJsonLd({
  title,
  description,
  content,
  author,
  datePublished,
  dateModified,
  imageUrl,
  baseUrl,
  slug,
  keywords,
}: BlogPostingJsonLdOptions): object {
  const authorKeywords = (author as any).seo?.keywords
  const allKeywords: string[] = [...(keywords || [])]

  // Add agent keywords if available
  if (authorKeywords?.primary) {
    authorKeywords.primary.forEach((k: { keyword?: string }) => {
      if (k.keyword && !allKeywords.includes(k.keyword)) {
        allKeywords.push(k.keyword)
      }
    })
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${baseUrl}/posts/${slug}#post`,
    headline: title,
    description: description,
    url: `${baseUrl}/posts/${slug}`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,

    // Author
    author: {
      '@type': 'Person',
      name: author.name,
      url: `${baseUrl}/agents/${author.slug}`,
      jobTitle: 'Real Estate Agent',
    },

    // Publisher (using agent as publisher)
    publisher: {
      '@type': 'Organization',
      name: author.fullDesignation || author.displayName,
      logo: getMediaUrl(author.logo) || getMediaUrl(author.profilePhoto),
      url: `${baseUrl}/agents/${author.slug}`,
    },

    // Image
    image: imageUrl || undefined,

    // Keywords
    keywords: allKeywords.length > 0 ? allKeywords.join(', ') : undefined,

    // Main entity of page
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/posts/${slug}`,
    },
  }

  // Add article body excerpt if content provided
  if (content) {
    // Truncate to first 500 chars for articleBody
    jsonLd.articleBody = content.substring(0, 500)
  }

  // Clean undefined values
  return JSON.parse(JSON.stringify(jsonLd))
}

/**
 * Generate FAQPage JSON-LD schema
 */
export function generateFAQJsonLd({ faqs }: FAQJsonLdOptions): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate LocalBusiness JSON-LD schema (separate from agent for additional business listing)
 */
export function generateLocalBusinessJsonLd(
  agent: Agent,
  baseUrl: string,
  cityData?: CityDatum | null,
): object {
  const jsonLdConfig = (agent as any).seo?.jsonLd

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${baseUrl}/agents/${agent.slug}#business`,
    name: agent.fullDesignation || agent.displayName,
    description: agent.shortBio || agent.meta?.description || undefined,
    url: `${baseUrl}/agents/${agent.slug}`,
    telephone: agent.phone || undefined,
    email: agent.email || undefined,
    image: getMediaUrl(agent.profilePhoto),

    address: {
      '@type': 'PostalAddress',
      streetAddress: agent.address?.street || undefined,
      addressLocality: agent.address?.city || agent.city || undefined,
      addressRegion: agent.address?.state || getStateName(agent.state) || undefined,
      postalCode: agent.address?.zip || undefined,
      addressCountry: 'US',
    },

    priceRange: jsonLdConfig?.priceRange || '$$$',
  }

  // Add geo if available
  if (jsonLdConfig?.geoCoordinates?.latitude && jsonLdConfig?.geoCoordinates?.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: jsonLdConfig.geoCoordinates.latitude,
      longitude: jsonLdConfig.geoCoordinates.longitude,
    }
  }

  // Add aggregate rating if available
  if (jsonLdConfig?.aggregateRating?.ratingValue) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: jsonLdConfig.aggregateRating.ratingValue,
      reviewCount: jsonLdConfig.aggregateRating.reviewCount || 1,
      bestRating: jsonLdConfig.aggregateRating.bestRating || 5,
    }
  }

  // Clean undefined values
  return JSON.parse(JSON.stringify(jsonLd))
}

/**
 * Generate all JSON-LD schemas for an agent page as a combined array
 */
export function generateAgentPageJsonLd(
  agent: Agent,
  baseUrl: string,
  cityData?: CityDatum | null,
): object[] {
  const schemas: object[] = []
  const jsonLdConfig = (agent as any).seo?.jsonLd

  // Check if JSON-LD is enabled (default to true)
  if (jsonLdConfig?.enabled === false) {
    return schemas
  }

  // Add main agent schema
  schemas.push(generateAgentJsonLd({ agent, baseUrl, cityData }))

  // Add FAQ schema if agent has FAQs
  if (agent.faqs && agent.faqs.length > 0) {
    const faqItems = agent.faqs
      .filter((faq) => faq.question && faq.answer)
      .map((faq) => ({
        question: faq.question,
        // Extract text from rich text answer
        answer: extractTextFromRichText(faq.answer),
      }))

    if (faqItems.length > 0) {
      schemas.push(generateFAQJsonLd({ faqs: faqItems }))
    }
  }

  return schemas
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
 * Serialize JSON-LD to string for embedding in HTML
 */
export function serializeJsonLd(schemas: object | object[]): string {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas]
  return JSON.stringify(schemaArray.length === 1 ? schemaArray[0] : schemaArray, null, 2)
}
