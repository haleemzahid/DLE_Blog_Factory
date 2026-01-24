import type { Agent, CityDatum, Post, ContentTemplate } from '@/payload-types'
import { replaceTokens, findMissingTokens, extractTokensFromContent } from './replaceTokens'
import { runGenerator, getAvailableGenerators } from './generators'

/**
 * Template Rendering Engine
 * Combines ContentTemplates + CityData + Agent data to produce unique content
 */

export interface TemplateSection {
  id: string
  name: string
  type: 'static' | 'token' | 'dynamic'
  content?: string
  tokenTemplate?: string
  generator?: string
  condition?: string
  allowOverride?: boolean
}

export interface RenderContext {
  agent: Agent
  cityData?: CityDatum | null
  post?: Post | null
  template?: ContentTemplate | null
  baseUrl?: string
  custom?: Record<string, string>
}

export interface RenderedSection {
  id: string
  name: string
  content: string
  type: 'static' | 'token' | 'dynamic'
  wasOverridden: boolean
}

export interface RenderResult {
  title: string
  description: string
  content: string
  sections: RenderedSection[]
  uniquenessScore: number
  missingTokens: string[]
  usedGenerators: string[]
  metadata: {
    agentName: string
    cityName: string
    templateName?: string
    renderedAt: string
  }
}

/**
 * Main template rendering function
 * Takes a template and context, returns fully rendered content
 */
export function renderTemplate(
  sections: TemplateSection[],
  context: RenderContext,
  overrides?: Record<string, string>
): RenderResult {
  const { agent, cityData, post, template } = context
  const renderedSections: RenderedSection[] = []
  const usedGenerators: string[] = []
  let allMissingTokens: string[] = []

  // Process each section
  sections.forEach((section) => {
    // Check if section has a condition
    if (section.condition && !evaluateCondition(section.condition, context)) {
      return // Skip this section
    }

    // Check for override
    const override = overrides?.[section.id]
    if (override && section.allowOverride !== false) {
      // Apply token replacement to override content too
      const processedOverride = replaceTokens(override, {
        agent,
        cityData,
        post: post ? { title: post.title, slug: post.slug, publishedAt: post.publishedAt || undefined } : undefined,
        custom: context.custom,
      })

      renderedSections.push({
        id: section.id,
        name: section.name,
        content: processedOverride,
        type: section.type,
        wasOverridden: true,
      })
      return
    }

    let content = ''

    switch (section.type) {
      case 'static':
        content = section.content || ''
        break

      case 'token':
        if (section.tokenTemplate) {
          content = replaceTokens(section.tokenTemplate, {
            agent,
            cityData,
            post: post ? { title: post.title, slug: post.slug, publishedAt: post.publishedAt || undefined } : undefined,
            custom: context.custom,
          })

          // Track missing tokens
          const missing = findMissingTokens(section.tokenTemplate, {
            agent,
            cityData,
            post: post ? { title: post.title, slug: post.slug, publishedAt: post.publishedAt || undefined } : undefined,
            custom: context.custom,
          })
          allMissingTokens = [...allMissingTokens, ...missing]
        }
        break

      case 'dynamic':
        if (section.generator) {
          content = runGenerator(section.generator, { agent, cityData })
          if (content) {
            usedGenerators.push(section.generator)
          }
        }
        break
    }

    if (content) {
      renderedSections.push({
        id: section.id,
        name: section.name,
        content,
        type: section.type,
        wasOverridden: false,
      })
    }
  })

  // Combine all sections into final content
  const fullContent = renderedSections.map((s) => s.content).join('\n\n')

  // Generate title and description with token replacement
  const titleTemplate = (template as any)?.seoTemplates?.titleTemplate || '{{POST_TITLE}} | {{AGENT_DESIGNATION}}'
  const descriptionTemplate =
    (template as any)?.seoTemplates?.descriptionTemplate ||
    '{{POST_TITLE}} in {{CITY_NAME}}. Contact {{AGENT_DESIGNATION}} for expert guidance.'

  const title = replaceTokens(titleTemplate, {
    agent,
    cityData,
    post: post ? { title: post.title, slug: post.slug, publishedAt: post.publishedAt || undefined } : undefined,
    custom: context.custom,
  })

  const description = replaceTokens(descriptionTemplate, {
    agent,
    cityData,
    post: post ? { title: post.title, slug: post.slug, publishedAt: post.publishedAt || undefined } : undefined,
    custom: context.custom,
  })

  // Calculate uniqueness score
  const uniquenessScore = calculateUniquenessScore(renderedSections, context)

  return {
    title,
    description,
    content: fullContent,
    sections: renderedSections,
    uniquenessScore,
    missingTokens: [...new Set(allMissingTokens)],
    usedGenerators,
    metadata: {
      agentName: agent.fullDesignation || agent.displayName || agent.name,
      cityName: cityData?.cityName || agent.city || 'Unknown',
      templateName: template?.name,
      renderedAt: new Date().toISOString(),
    },
  }
}

/**
 * Evaluate a condition string against the context
 * Supports simple property checks like "cityData.neighborhoods.length > 0"
 */
function evaluateCondition(condition: string, context: RenderContext): boolean {
  try {
    // Create a safe evaluation context
    const { agent, cityData, post } = context

    // Simple property access patterns
    // cityData.neighborhoods.length > 0
    // agent.faqs.length > 0
    // cityData.demographics.diversityIndex

    // Check for array length conditions
    const lengthMatch = condition.match(/^(\w+)\.(\w+)(?:\.(\w+))?\.length\s*([><=!]+)\s*(\d+)$/)
    if (lengthMatch) {
      const [, obj, prop1, prop2, operator, value] = lengthMatch
      let target: any

      if (obj === 'cityData' && cityData) {
        target = prop2 ? (cityData as any)[prop1]?.[prop2] : (cityData as any)[prop1]
      } else if (obj === 'agent' && agent) {
        target = prop2 ? (agent as any)[prop1]?.[prop2] : (agent as any)[prop1]
      }

      const length = Array.isArray(target) ? target.length : 0
      const compareValue = parseInt(value, 10)

      switch (operator) {
        case '>':
          return length > compareValue
        case '>=':
          return length >= compareValue
        case '<':
          return length < compareValue
        case '<=':
          return length <= compareValue
        case '==':
        case '===':
          return length === compareValue
        case '!=':
        case '!==':
          return length !== compareValue
      }
    }

    // Check for property existence
    const existsMatch = condition.match(/^(\w+)\.(\w+)(?:\.(\w+))?$/)
    if (existsMatch) {
      const [, obj, prop1, prop2] = existsMatch
      let target: any

      if (obj === 'cityData' && cityData) {
        target = prop2 ? (cityData as any)[prop1]?.[prop2] : (cityData as any)[prop1]
      } else if (obj === 'agent' && agent) {
        target = prop2 ? (agent as any)[prop1]?.[prop2] : (agent as any)[prop1]
      }

      return target !== undefined && target !== null && target !== ''
    }

    // Default to true if condition can't be parsed
    return true
  } catch {
    console.warn(`Failed to evaluate condition: ${condition}`)
    return true
  }
}

/**
 * Calculate content uniqueness score (0-100)
 * Based on dynamic content, token replacements, and generator usage
 */
function calculateUniquenessScore(sections: RenderedSection[], context: RenderContext): number {
  if (sections.length === 0) return 0

  let totalWeight = 0
  let uniqueWeight = 0

  sections.forEach((section) => {
    const contentLength = section.content.length
    const weight = Math.min(contentLength / 100, 10) // Cap weight at 10 per section

    totalWeight += weight

    // Dynamic sections are 100% unique
    if (section.type === 'dynamic') {
      uniqueWeight += weight
    }
    // Token sections are partially unique based on replaced tokens
    else if (section.type === 'token') {
      // Estimate 60% uniqueness for token-based content
      uniqueWeight += weight * 0.6
    }
    // Static sections are 0% unique unless overridden
    else if (section.wasOverridden) {
      uniqueWeight += weight * 0.8
    }
    // Static content contributes minimal uniqueness
    else {
      uniqueWeight += weight * 0.1
    }
  })

  // Bonus for using city-specific data
  if (context.cityData) {
    const cityDataFields = [
      context.cityData.medianHomePrice,
      context.cityData.neighborhoods,
      context.cityData.topSchools,
      (context.cityData as any).demographics,
      (context.cityData as any).placesOfWorship,
    ].filter(Boolean).length

    // Add up to 15% bonus for rich city data
    uniqueWeight += (cityDataFields / 5) * 1.5
    totalWeight += 1.5
  }

  return Math.min(Math.round((uniqueWeight / totalWeight) * 100), 100)
}

/**
 * Render content from a post that uses a template
 * Handles the full flow: template + post overrides + tenant overrides
 */
export async function renderPostWithTemplate(
  post: Post,
  agent: Agent,
  cityData: CityDatum | null,
  tenantOverrides?: Record<string, string>
): Promise<RenderResult> {
  // Get template sections from post's contentTemplate
  const template = (post as any).contentTemplate as ContentTemplate | null

  // Build sections from template or use defaults
  const sections: TemplateSection[] = template
    ? buildSectionsFromTemplate(template)
    : getDefaultSections()

  // Merge overrides: post-level first, then tenant-level
  const postOverrides = buildOverridesFromPost(post)
  const mergedOverrides = {
    ...postOverrides,
    ...tenantOverrides,
  }

  // Render with context
  return renderTemplate(sections, { agent, cityData, post, template }, mergedOverrides)
}

/**
 * Build section definitions from a ContentTemplate
 */
function buildSectionsFromTemplate(template: ContentTemplate): TemplateSection[] {
  // Check if template has sections array defined
  const templateSections = (template as any).sections as Array<{
    sectionId?: string
    sectionName?: string
    sectionType?: 'static' | 'token' | 'dynamic'
    defaultContent?: unknown // Rich text
    tokenTemplate?: unknown // Rich text
    generator?: string
    condition?: string
    allowPostOverride?: boolean
    allowTenantOverride?: boolean
  }> | undefined

  // If template has sections defined, use them
  if (templateSections && templateSections.length > 0) {
    return templateSections.map((section) => {
      const baseSection: TemplateSection = {
        id: section.sectionId || 'unnamed',
        name: section.sectionName || section.sectionId || 'Unnamed Section',
        type: section.sectionType || 'token',
        allowOverride: section.allowPostOverride ?? true,
      }

      // Add content based on section type
      if (section.sectionType === 'static' && section.defaultContent) {
        baseSection.content = extractTextFromRichText(section.defaultContent)
      } else if (section.sectionType === 'token' && section.tokenTemplate) {
        baseSection.tokenTemplate = extractTextFromRichText(section.tokenTemplate)
      } else if (section.sectionType === 'dynamic' && section.generator) {
        baseSection.generator = section.generator
      }

      // Add condition if specified
      if (section.condition) {
        baseSection.condition = section.condition
      }

      return baseSection
    })
  }

  // Fall back to default sections if template doesn't have sections defined
  const sections = getDefaultSections()

  // Apply template's uniqueness target to influence section rendering
  const uniquenessTarget = (template as any).contentUniquenessTarget || 30

  // If high uniqueness is required, prioritize dynamic sections
  if (uniquenessTarget >= 50) {
    // Add more dynamic sections
    sections.push({
      id: 'cultural',
      name: 'Cultural Information',
      type: 'dynamic',
      generator: 'diversity_overview',
      condition: 'cityData.demographics',
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
 * Build overrides map from post's sectionOverrides field
 */
function buildOverridesFromPost(post: Post): Record<string, string> {
  const overrides: Record<string, string> = {}
  const sectionOverrides = (post as any).sectionOverrides as Array<{
    sectionId?: string
    overrideContent?: string
  }> | undefined

  if (sectionOverrides) {
    sectionOverrides.forEach((override) => {
      if (override.sectionId && override.overrideContent) {
        overrides[override.sectionId] = override.overrideContent
      }
    })
  }

  return overrides
}

/**
 * Default section configuration for real estate content
 */
export function getDefaultSections(): TemplateSection[] {
  return [
    {
      id: 'intro',
      name: 'Introduction',
      type: 'token',
      tokenTemplate: `# {{POST_TITLE}}

Welcome to {{CITY_NAME}}! Whether you're looking to buy, sell, or invest in real estate, {{AGENT_DESIGNATION}} is here to help you navigate the {{CITY_NAME}} market.

{{AGENT_BIO}}`,
      allowOverride: true,
    },
    {
      id: 'market_stats',
      name: 'Market Statistics',
      type: 'dynamic',
      generator: 'market_stats',
      condition: 'cityData.medianHomePrice',
    },
    {
      id: 'neighborhoods',
      name: 'Neighborhoods',
      type: 'dynamic',
      generator: 'neighborhoods',
      condition: 'cityData.neighborhoods.length > 0',
    },
    {
      id: 'schools',
      name: 'Schools',
      type: 'dynamic',
      generator: 'schools',
      condition: 'cityData.topSchools.length > 0',
    },
    {
      id: 'local_facts',
      name: 'Local Facts',
      type: 'dynamic',
      generator: 'local_facts',
      condition: 'cityData.uniqueFacts.length > 0',
    },
    {
      id: 'agent_cta',
      name: 'Contact Agent',
      type: 'dynamic',
      generator: 'agent_cta',
      allowOverride: true,
    },
    {
      id: 'faq',
      name: 'FAQs',
      type: 'dynamic',
      generator: 'faq',
      condition: 'agent.faqs.length > 0',
    },
  ]
}

/**
 * Preview template rendering with sample data
 * Useful for admin preview functionality
 */
export function previewTemplate(
  sections: TemplateSection[],
  sampleAgent: Partial<Agent>,
  sampleCityData: Partial<CityDatum>
): RenderResult {
  // Create minimal agent and cityData objects for preview
  const agent = {
    id: 0,
    name: sampleAgent.name || 'Sample Agent',
    displayName: sampleAgent.displayName || 'Mr. Sample City™',
    fullDesignation: sampleAgent.fullDesignation || 'Mr. Sample City™',
    slug: sampleAgent.slug || 'mr-sample-city',
    city: sampleAgent.city || 'Sample City',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...sampleAgent,
  } as Agent

  const cityData = {
    id: 0,
    cityName: sampleCityData.cityName || 'Sample City',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...sampleCityData,
  } as CityDatum

  return renderTemplate(sections, { agent, cityData })
}

/**
 * Get all available section generators
 */
export function getAvailableSectionGenerators(): string[] {
  return getAvailableGenerators()
}

/**
 * Validate template sections
 * Returns array of validation errors
 */
export function validateTemplateSections(sections: TemplateSection[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()

  sections.forEach((section, index) => {
    // Check for duplicate IDs
    if (ids.has(section.id)) {
      errors.push(`Duplicate section ID "${section.id}" at index ${index}`)
    }
    ids.add(section.id)

    // Validate section type requirements
    if (section.type === 'token' && !section.tokenTemplate) {
      errors.push(`Section "${section.id}" is type "token" but has no tokenTemplate`)
    }

    if (section.type === 'dynamic' && !section.generator) {
      errors.push(`Section "${section.id}" is type "dynamic" but has no generator`)
    }

    if (section.type === 'dynamic' && section.generator) {
      const available = getAvailableGenerators()
      if (!available.includes(section.generator)) {
        errors.push(`Section "${section.id}" uses unknown generator "${section.generator}"`)
      }
    }
  })

  return errors
}

export default renderTemplate
