import type { Agent, CityDatum, Post, Tenant, Announcement } from '@/payload-types'
import { replaceTokens, getAvailableTokens } from './replaceTokens'
import { generators, runGenerator } from './generators'
import { analyzeContentUniqueness } from './contentUniqueness'
import { getCanonicalUrl } from './canonicalUrl'

/**
 * Section override from post configuration (top-level, uses original field names)
 */
interface PostSectionOverride {
  sectionId: string
  overrideType: 'replace' | 'prepend' | 'append' | 'hide'
  customContent?: string | { root?: unknown } | null
}

/**
 * Section override within tenant overrides (uses shorter field names)
 */
interface TenantSectionOverride {
  secId: string
  type: 'replace' | 'prepend' | 'append' | 'hide'
  content?: string | null
}

/**
 * Unified section override interface for internal use
 */
interface NormalizedSectionOverride {
  sectionId: string
  overrideType: 'replace' | 'prepend' | 'append' | 'hide'
  content: string
}

/**
 * Tenant-specific content override configuration (uses shorter field names)
 */
interface TenantContentOverride {
  tenant: number | Tenant
  agent?: number | Agent | null
  cityData?: number | CityDatum | null
  sections?: TenantSectionOverride[]
  tokens?: Array<{
    name: string
    value: string
  }>
  // Intro/closing variation settings for content uniqueness
  introVariant?: 'standard' | 'market' | 'community' | 'buyer' | 'investment'
  closingVariant?: 'standard' | 'urgency' | 'value'
}

/**
 * Context for rendering a post for a specific agent/tenant
 */
interface RenderContext {
  post: Post
  agent?: Agent | null
  cityData?: CityDatum | null
  tenant?: Tenant | null
  baseUrl?: string
  /** Pre-fetched announcements for this context (use getAnnouncementsForContext to fetch) */
  announcements?: Announcement[] | null
}

/**
 * Result of rendering a post for a specific agent
 */
interface RenderResult {
  // The rendered content as HTML/Markdown
  content: string

  // SEO metadata
  meta: {
    title: string
    description: string
    canonicalUrl: string
    noIndex: boolean
  }

  // Content uniqueness analysis
  uniqueness: {
    score: number
    grade: string
    isUnique: boolean
  }

  // Sections that were rendered
  sections: Array<{
    id: string
    name: string
    content: string
    wasOverridden: boolean
  }>
}

/**
 * Default template sections configuration
 * The intro and closing sections use variant generators for content uniqueness
 */
const DEFAULT_SECTIONS = [
  { id: 'intro', name: 'Introduction', generator: 'intro_standard', condition: null, allowVariant: true },
  { id: 'market_stats', name: 'Market Statistics', generator: 'market_stats', condition: 'cityData.medianHomePrice', allowVariant: false },
  { id: 'cost_of_living', name: 'Cost of Living', generator: 'cost_of_living', condition: 'cityData.medianHomePrice', allowVariant: false },
  { id: 'neighborhoods', name: 'Neighborhoods', generator: 'neighborhoods', condition: 'cityData.neighborhoods.length > 0', allowVariant: false },
  { id: 'schools', name: 'Schools', generator: 'schools', condition: 'cityData.topSchools.length > 0', allowVariant: false },
  { id: 'local_facts', name: 'Local Facts', generator: 'local_facts', condition: 'cityData.uniqueFacts.length > 0', allowVariant: false },
  { id: 'employers', name: 'Key Employers', generator: 'employers', condition: 'cityData.keyEmployers.length > 0', allowVariant: false },
  { id: 'places_of_worship', name: 'Places of Worship', generator: 'places_of_worship', condition: 'cityData.placesOfWorship', allowVariant: false },
  { id: 'cultural_centers', name: 'Cultural Centers', generator: 'cultural_centers', condition: 'cityData.culturalCenters', allowVariant: false },
  { id: 'cultural_events', name: 'Cultural Events', generator: 'cultural_events', condition: 'cityData.culturalEvents', allowVariant: false },
  { id: 'diversity_overview', name: 'Demographics', generator: 'diversity_overview', condition: 'cityData.demographics', allowVariant: false },
  { id: 'community_amenities', name: 'Community Amenities', generator: 'community_amenities', condition: 'cityData.communityAmenities', allowVariant: false },
  { id: 'languages_spoken', name: 'Languages', generator: 'languages_spoken', condition: 'cityData.languagesSpoken', allowVariant: false },
  { id: 'agent_expertise', name: 'Agent Expertise', generator: 'agent_expertise', condition: 'agent', allowVariant: false },
  { id: 'agent_reviews', name: 'Agent Reviews', generator: 'agent_reviews', condition: 'agent.seo?.jsonLd?.aggregateRating', allowVariant: false },
  { id: 'agent_languages', name: 'Agent Languages', generator: 'agent_languages', condition: 'agent.culturalExpertise?.languagesSpoken', allowVariant: false },
  { id: 'areas_served', name: 'Areas Served', generator: 'areas_served', condition: 'agent.seo?.jsonLd?.areaServed', allowVariant: false },
  { id: 'closing', name: 'Closing CTA', generator: 'closing_standard', condition: 'agent', allowVariant: true },
  { id: 'faq', name: 'FAQ', generator: 'faq', condition: 'agent.faqs.length > 0', allowVariant: false },
]

/**
 * Get the appropriate intro generator based on tenant variant setting
 */
function getIntroGenerator(variant?: string): string {
  const introGenerators: Record<string, string> = {
    standard: 'intro_standard',
    market: 'intro_market',
    community: 'intro_community',
    buyer: 'intro_buyer',
    investment: 'intro_investment',
  }
  return introGenerators[variant || 'standard'] || 'intro_standard'
}

/**
 * Get the appropriate closing generator based on tenant variant setting
 */
function getClosingGenerator(variant?: string): string {
  const closingGenerators: Record<string, string> = {
    standard: 'closing_standard',
    urgency: 'closing_urgency',
    value: 'closing_value',
  }
  return closingGenerators[variant || 'standard'] || 'closing_standard'
}

/**
 * Evaluate a condition string against the context
 */
function evaluateCondition(condition: string | null, context: { agent?: Agent | null; cityData?: CityDatum | null }): boolean {
  if (!condition) return true

  const { agent, cityData } = context

  try {
    // Simple condition evaluation - check if the path exists and has value
    const parts = condition.split('.')
    let value: unknown = { agent, cityData }

    for (const part of parts) {
      if (value === null || value === undefined) return false

      // Handle array length checks
      if (part.includes('.length')) {
        const [arrPath, lengthCheck] = part.split('.length')
        const arr = (value as Record<string, unknown>)[arrPath]
        if (!Array.isArray(arr)) return false

        if (lengthCheck.includes('>')) {
          const threshold = parseInt(lengthCheck.split('>')[1].trim())
          return arr.length > threshold
        }
        return arr.length > 0
      }

      // Handle optional chaining notation
      const cleanPart = part.replace('?', '')
      value = (value as Record<string, unknown>)[cleanPart]
    }

    // Check if value exists and is truthy
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
  } catch {
    return false
  }
}

/**
 * Extract plain text from rich text content
 */
function extractTextFromRichText(richText: unknown): string {
  if (!richText) return ''
  if (typeof richText === 'string') return richText

  if (typeof richText === 'object' && richText !== null && 'root' in richText) {
    const root = (richText as { root: { children?: unknown[] } }).root
    return extractFromChildren(root.children || [])
  }

  return ''
}

function extractFromChildren(children: unknown[]): string {
  return children
    .map((child) => {
      if (typeof child === 'object' && child !== null) {
        const node = child as { text?: string; children?: unknown[] }
        if (node.text) return node.text
        if (node.children) return extractFromChildren(node.children)
      }
      return ''
    })
    .join(' ')
    .trim()
}

/**
 * Get tenant-specific overrides for a post
 */
function getTenantOverrides(post: Post, tenantId: number | string): TenantContentOverride | null {
  const overrides = (post as any).tenantOverrides as TenantContentOverride[] | undefined
  if (!overrides || overrides.length === 0) return null

  return overrides.find((override) => {
    const overrideTenantId = typeof override.tenant === 'object'
      ? (override.tenant as Tenant).id
      : override.tenant
    return overrideTenantId === tenantId
  }) || null
}

/**
 * Normalize a post-level section override to the unified format
 */
function normalizePostSectionOverride(override: PostSectionOverride): NormalizedSectionOverride {
  let content = ''
  if (override.customContent) {
    if (typeof override.customContent === 'string') {
      content = override.customContent
    } else if (override.customContent.root) {
      content = extractTextFromRichText(override.customContent)
    }
  }
  return {
    sectionId: override.sectionId,
    overrideType: override.overrideType,
    content,
  }
}

/**
 * Normalize a tenant section override to the unified format
 */
function normalizeTenantSectionOverride(override: TenantSectionOverride): NormalizedSectionOverride {
  return {
    sectionId: override.secId,
    overrideType: override.type,
    content: override.content || '',
  }
}

/**
 * Apply section overrides to generated content
 */
function applySectionOverride(
  originalContent: string,
  override: NormalizedSectionOverride | undefined,
  context: { agent?: Agent | null; cityData?: CityDatum | null }
): { content: string; wasOverridden: boolean } {
  if (!override) {
    return { content: originalContent, wasOverridden: false }
  }

  // Handle hide override
  if (override.overrideType === 'hide') {
    return { content: '', wasOverridden: true }
  }

  // Apply token replacement to custom content
  let customContent = override.content
  if (customContent) {
    customContent = replaceTokens(customContent, { agent: context.agent, cityData: context.cityData })
  }

  switch (override.overrideType) {
    case 'replace':
      return { content: customContent, wasOverridden: true }
    case 'prepend':
      return { content: customContent + '\n\n' + originalContent, wasOverridden: true }
    case 'append':
      return { content: originalContent + '\n\n' + customContent, wasOverridden: true }
    default:
      return { content: originalContent, wasOverridden: false }
  }
}

/**
 * Render a post for a specific agent/tenant context
 * This is the main function for render-time content assembly
 */
export function renderPostForAgent(context: RenderContext): RenderResult {
  const { post, agent, cityData, tenant, baseUrl = '', announcements } = context

  // Check if post uses template rendering
  const useTemplate = (post as any).useTemplate

  // Get base section overrides from post and normalize them
  const rawPostOverrides = ((post as any).sectionOverrides || []) as PostSectionOverride[]
  const normalizedPostOverrides = rawPostOverrides.map(normalizePostSectionOverride)

  // Get tenant-specific overrides if tenant is provided
  const tenantId = tenant ? (typeof tenant === 'object' ? tenant.id : tenant) : null
  const tenantOverrides = tenantId ? getTenantOverrides(post, tenantId) : null

  // Determine which agent and cityData to use (tenant overrides take precedence)
  const effectiveAgent = (tenantOverrides?.agent as Agent) || agent || null
  const effectiveCityData = (tenantOverrides?.cityData as CityDatum) || cityData || (post as any).targetCityData || null

  // Build custom tokens from tenant overrides
  const customTokens: Record<string, string> = {}
  if (tenantOverrides?.tokens) {
    tenantOverrides.tokens.forEach((t) => {
      customTokens[t.name] = t.value
    })
  }

  // Merge section overrides (tenant overrides take precedence)
  const tenantSectionOverrides = (tenantOverrides?.sections || []).map(normalizeTenantSectionOverride)
  const mergedOverrides: NormalizedSectionOverride[] = [...normalizedPostOverrides]

  tenantSectionOverrides.forEach((tenantOverride) => {
    const existingIndex = mergedOverrides.findIndex((o) => o.sectionId === tenantOverride.sectionId)
    if (existingIndex >= 0) {
      mergedOverrides[existingIndex] = tenantOverride
    } else {
      mergedOverrides.push(tenantOverride)
    }
  })

  // Get intro/closing variants from tenant overrides
  const introVariant = tenantOverrides?.introVariant
  const closingVariant = tenantOverrides?.closingVariant

  // Build tenant info for token context
  const tenantInfo = tenant && typeof tenant === 'object' ? {
    name: tenant.name,
    slug: tenant.slug,
    domain: (tenant as any).domain,
    brandName: (tenant as any).brandName,
    tagline: (tenant as any).tagline,
  } : null

  // Build token context
  const tokenContext = {
    agent: effectiveAgent,
    cityData: effectiveCityData,
    post: {
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt || undefined,
    },
    custom: customTokens,
    tenant: tenantInfo,
    announcements: announcements || null,
  }

  // Render sections
  const renderedSections: Array<{
    id: string
    name: string
    content: string
    wasOverridden: boolean
  }> = []

  const contentParts: string[] = []

  // Add title with token replacement
  const title = replaceTokens((post as any).templateTopic || post.title, tokenContext)

  if (useTemplate) {
    // Use template-based rendering
    for (const section of DEFAULT_SECTIONS) {
      // Check condition
      if (!evaluateCondition(section.condition, { agent: effectiveAgent, cityData: effectiveCityData })) {
        continue
      }

      // Find override for this section
      const override = mergedOverrides.find((o) => o.sectionId === section.id)

      // Determine which generator to use (handle intro/closing variants)
      let generatorName = section.generator
      if (section.allowVariant) {
        if (section.id === 'intro' && introVariant) {
          generatorName = getIntroGenerator(introVariant)
        } else if (section.id === 'closing' && closingVariant) {
          generatorName = getClosingGenerator(closingVariant)
        }
      }

      // Generate base content
      let baseContent = ''
      if (generatorName && generators[generatorName]) {
        baseContent = runGenerator(generatorName, {
          agent: effectiveAgent,
          cityData: effectiveCityData,
          announcements: announcements || null,
        })
      }

      // Apply override
      const { content, wasOverridden } = applySectionOverride(baseContent, override, {
        agent: effectiveAgent,
        cityData: effectiveCityData,
      })

      if (content) {
        renderedSections.push({
          id: section.id,
          name: section.name,
          content,
          wasOverridden,
        })
        contentParts.push(content)
      }
    }
  } else {
    // Use standard post content with token replacement
    const postContent = extractTextFromRichText((post as any).content)
    const renderedContent = replaceTokens(postContent, tokenContext)
    contentParts.push(renderedContent)

    renderedSections.push({
      id: 'main',
      name: 'Main Content',
      content: renderedContent,
      wasOverridden: false,
    })
  }

  // Combine all content
  const fullContent = contentParts.join('\n\n')

  // Analyze content uniqueness
  const uniquenessAnalysis = analyzeContentUniqueness(
    fullContent,
    effectiveAgent,
    effectiveCityData,
    undefined // No template content comparison for now
  )

  // Generate canonical URL
  const primaryTenantObj = (post as any).primaryTenant as Tenant | null
  const canonicalConfig = getCanonicalUrl({
    post,
    currentAgent: effectiveAgent || undefined,
    currentTenant: tenant || undefined,
    primaryTenant: primaryTenantObj || undefined,
    renderedContent: fullContent,
    cityData: effectiveCityData || undefined,
    baseUrl,
  })

  // Generate meta description
  const metaDescription = replaceTokens(
    post.meta?.description || `${title} - Expert real estate insights${effectiveCityData ? ` for ${effectiveCityData.cityName}` : ''}`,
    tokenContext
  )

  return {
    content: fullContent,
    meta: {
      title,
      description: metaDescription,
      canonicalUrl: canonicalConfig.url,
      noIndex: !canonicalConfig.isSelfReferencing,
    },
    uniqueness: {
      score: uniquenessAnalysis.score,
      grade: uniquenessAnalysis.grade,
      isUnique: uniquenessAnalysis.score >= 30,
    },
    sections: renderedSections,
  }
}

/**
 * Render a post for multiple tenants and compare uniqueness
 */
export function renderPostForMultipleTenants(
  post: Post,
  tenants: Array<{ tenant: Tenant; agent?: Agent | null; cityData?: CityDatum | null; announcements?: Announcement[] | null }>,
  baseUrl: string = ''
): Array<RenderResult & { tenantId: number }> {
  return tenants.map(({ tenant, agent, cityData, announcements }) => {
    const result = renderPostForAgent({
      post,
      agent,
      cityData,
      tenant,
      baseUrl,
      announcements,
    })

    return {
      ...result,
      tenantId: tenant.id,
    }
  })
}

/**
 * Get a preview of available tokens for a given context
 */
export function getTokenPreview(
  agent?: Agent | null,
  cityData?: CityDatum | null
): Record<string, string> {
  return getAvailableTokens({
    agent,
    cityData,
  })
}

/**
 * Check which sections would be rendered given a context
 */
export function getAvailableSections(
  agent?: Agent | null,
  cityData?: CityDatum | null
): Array<{ id: string; name: string; available: boolean }> {
  return DEFAULT_SECTIONS.map((section) => ({
    id: section.id,
    name: section.name,
    available: evaluateCondition(section.condition, { agent, cityData }),
  }))
}

export default renderPostForAgent
