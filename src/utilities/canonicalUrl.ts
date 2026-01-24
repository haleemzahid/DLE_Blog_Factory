/**
 * Smart Canonical URL Logic
 *
 * Based on SEO research from seo-syndication-issues.md:
 * - Google no longer recommends canonical tags for syndication
 * - Need to ensure unique content to avoid canonical consolidation
 * - Primary tenant should hold the canonical for truly duplicated content
 *
 * Strategy:
 * 1. If content is unique enough (>50% uniqueness), use self-referencing canonical
 * 2. If content is similar to another version, point to the primary/original
 * 3. For syndicated posts, use the primary tenant's URL as canonical
 */

import type { Agent, Post, Tenant, CityDatum } from '@/payload-types'
import { analyzeContentUniqueness } from './contentUniqueness'

export interface CanonicalConfig {
  url: string
  isSelfReferencing: boolean
  reason: string
  uniquenessScore: number
  alternateUrls?: string[]
}

export interface CanonicalContext {
  post: Post
  currentAgent?: Agent | null
  currentTenant?: Tenant | null
  primaryTenant?: Tenant | null
  renderedContent?: string
  cityData?: CityDatum | null
  baseUrl: string
}

/**
 * Determine the canonical URL for a post
 */
export function getCanonicalUrl(context: CanonicalContext): CanonicalConfig {
  const {
    post,
    currentAgent,
    currentTenant,
    primaryTenant,
    renderedContent,
    cityData,
    baseUrl,
  } = context

  const postType = (post as any).postType || 'main'
  const showOnAllAgents = (post as any).showOnAllAgents || false

  // Build the current page URL
  const currentUrl = buildPostUrl(post, currentAgent, baseUrl)

  // Case 1: Main site post (not syndicated)
  if (postType === 'main') {
    return {
      url: currentUrl,
      isSelfReferencing: true,
      reason: 'Main site post - self-referencing canonical',
      uniquenessScore: 100,
    }
  }

  // Case 2: Agent-specific post (not syndicated)
  if (postType === 'agent' && !showOnAllAgents) {
    return {
      url: currentUrl,
      isSelfReferencing: true,
      reason: 'Agent-specific post - self-referencing canonical',
      uniquenessScore: 100,
    }
  }

  // Case 3: Syndicated post - needs uniqueness analysis
  if (postType === 'syndicated' || showOnAllAgents) {
    // If we have rendered content, analyze uniqueness
    if (renderedContent) {
      const analysis = analyzeContentUniqueness(renderedContent, currentAgent, cityData)

      // High uniqueness (>50%) - use self-referencing canonical
      if (analysis.score >= 50) {
        return {
          url: currentUrl,
          isSelfReferencing: true,
          reason: `Content is ${analysis.score}% unique - safe for self-referencing canonical`,
          uniquenessScore: analysis.score,
        }
      }

      // Medium uniqueness (30-50%) - still self-reference but with warning
      if (analysis.score >= 30) {
        return {
          url: currentUrl,
          isSelfReferencing: true,
          reason: `Content is ${analysis.score}% unique - borderline, consider adding more unique content`,
          uniquenessScore: analysis.score,
          alternateUrls: primaryTenant ? [buildPrimaryUrl(post, primaryTenant, baseUrl)] : undefined,
        }
      }

      // Low uniqueness (<30%) - point to primary tenant
      if (primaryTenant && primaryTenant.id !== currentTenant?.id) {
        return {
          url: buildPrimaryUrl(post, primaryTenant, baseUrl),
          isSelfReferencing: false,
          reason: `Content is only ${analysis.score}% unique - pointing to primary tenant to avoid duplicate content`,
          uniquenessScore: analysis.score,
        }
      }

      // No primary tenant set, but low uniqueness - warn but use self-reference
      return {
        url: currentUrl,
        isSelfReferencing: true,
        reason: `WARNING: Content is only ${analysis.score}% unique but no primary tenant set`,
        uniquenessScore: analysis.score,
      }
    }

    // No rendered content to analyze - use safe defaults
    // If primary tenant is set and different from current, use it
    if (primaryTenant && primaryTenant.id !== currentTenant?.id) {
      return {
        url: buildPrimaryUrl(post, primaryTenant, baseUrl),
        isSelfReferencing: false,
        reason: 'Syndicated post - using primary tenant as canonical (no content analysis available)',
        uniquenessScore: 0,
      }
    }

    // Default to self-referencing
    return {
      url: currentUrl,
      isSelfReferencing: true,
      reason: 'Syndicated post - self-referencing (is primary tenant)',
      uniquenessScore: 0,
    }
  }

  // Default fallback
  return {
    url: currentUrl,
    isSelfReferencing: true,
    reason: 'Default - self-referencing canonical',
    uniquenessScore: 0,
  }
}

/**
 * Build URL for a post on current agent
 */
function buildPostUrl(post: Post, agent: Agent | null | undefined, baseUrl: string): string {
  if (agent) {
    return `${baseUrl}/posts/${agent.slug}/${post.slug}`
  }
  return `${baseUrl}/posts/${post.slug}`
}

/**
 * Build URL for a post on primary tenant
 */
function buildPrimaryUrl(post: Post, primaryTenant: Tenant, baseUrl: string): string {
  // Get primary domain from tenant
  const primaryDomain = primaryTenant.domains?.find(d => d.isPrimary)?.domain
  const tenantBase = primaryDomain ? `https://${primaryDomain}` : baseUrl

  // Get agent slug from tenant if linked
  const tenantAgent = primaryTenant.linkedAgent as Agent | null
  if (tenantAgent?.slug) {
    return `${tenantBase}/posts/${tenantAgent.slug}/${post.slug}`
  }

  return `${tenantBase}/posts/${post.slug}`
}

/**
 * Generate alternate/hreflang URLs for a syndicated post
 * Useful for international SEO or multi-regional targeting
 */
export function getAlternateUrls(
  post: Post,
  agents: Agent[],
  baseUrl: string
): Array<{ url: string; agentSlug: string; city: string }> {
  return agents.map(agent => ({
    url: buildPostUrl(post, agent, baseUrl),
    agentSlug: agent.slug,
    city: agent.city || 'Unknown',
  }))
}

/**
 * Check if a canonical configuration is safe for SEO
 */
export function isCanonicalSafe(config: CanonicalConfig): boolean {
  // Self-referencing canonicals are safe if uniqueness is high enough
  if (config.isSelfReferencing) {
    return config.uniquenessScore >= 30
  }

  // Non-self-referencing canonicals are always "safe" (pointing elsewhere)
  return true
}

/**
 * Generate meta tags for canonical and alternates
 */
export function generateCanonicalMetaTags(
  config: CanonicalConfig,
  alternates?: Array<{ url: string; hreflang?: string }>
): string {
  let tags = `<link rel="canonical" href="${config.url}" />\n`

  if (alternates && alternates.length > 0) {
    alternates.forEach(alt => {
      const hreflang = alt.hreflang || 'en-US'
      tags += `<link rel="alternate" hreflang="${hreflang}" href="${alt.url}" />\n`
    })
  }

  return tags
}

/**
 * Determine canonical strategy based on post configuration
 */
export interface CanonicalStrategy {
  strategy: 'self' | 'primary' | 'none'
  description: string
  requiresUniquenessCheck: boolean
  minimumUniqueness: number
}

export function determineCanonicalStrategy(post: Post): CanonicalStrategy {
  const postType = (post as any).postType || 'main'
  const showOnAllAgents = (post as any).showOnAllAgents || false
  const syndicatedAgents = (post as any).syndicatedAgents || []

  // Main posts - always self-canonical
  if (postType === 'main') {
    return {
      strategy: 'self',
      description: 'Main site content - use self-referencing canonical',
      requiresUniquenessCheck: false,
      minimumUniqueness: 0,
    }
  }

  // Agent-specific posts - always self-canonical
  if (postType === 'agent' && !showOnAllAgents && syndicatedAgents.length === 0) {
    return {
      strategy: 'self',
      description: 'Agent-specific content - use self-referencing canonical',
      requiresUniquenessCheck: false,
      minimumUniqueness: 0,
    }
  }

  // Syndicated to few agents (2-10)
  if (syndicatedAgents.length > 0 && syndicatedAgents.length <= 10) {
    return {
      strategy: 'self',
      description: 'Limited syndication - self-referencing canonical with uniqueness check',
      requiresUniquenessCheck: true,
      minimumUniqueness: 30,
    }
  }

  // Syndicated to many agents (10-50)
  if (syndicatedAgents.length > 10 && syndicatedAgents.length <= 50) {
    return {
      strategy: 'primary',
      description: 'Wide syndication - prefer primary tenant canonical unless content is highly unique',
      requiresUniquenessCheck: true,
      minimumUniqueness: 40,
    }
  }

  // Show on all agents - highest risk
  if (showOnAllAgents) {
    return {
      strategy: 'primary',
      description: 'Network-wide syndication - use primary tenant canonical, require high uniqueness',
      requiresUniquenessCheck: true,
      minimumUniqueness: 50,
    }
  }

  // Default
  return {
    strategy: 'self',
    description: 'Default strategy - self-referencing canonical',
    requiresUniquenessCheck: false,
    minimumUniqueness: 0,
  }
}

/**
 * Validate canonical setup for a post
 */
export interface CanonicalValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export function validateCanonicalSetup(
  post: Post,
  primaryTenant?: Tenant | null
): CanonicalValidation {
  const errors: string[] = []
  const warnings: string[] = []
  const suggestions: string[] = []

  const postType = (post as any).postType || 'main'
  const showOnAllAgents = (post as any).showOnAllAgents || false
  const syndicatedAgents = (post as any).syndicatedAgents || []

  // Check for risky configurations
  if (showOnAllAgents) {
    warnings.push('showOnAllAgents is enabled - this creates high duplicate content risk')
    suggestions.push('Consider limiting syndication to specific agents or regions')

    if (!primaryTenant) {
      errors.push('No primary tenant set for network-wide syndicated post')
      suggestions.push('Set a primary tenant to establish canonical URL authority')
    }
  }

  // Check syndication count
  if (syndicatedAgents.length > 50) {
    warnings.push(`Post is syndicated to ${syndicatedAgents.length} agents - very high duplicate risk`)
    suggestions.push('Ensure each version has >50% unique content')
  } else if (syndicatedAgents.length > 20) {
    warnings.push(`Post is syndicated to ${syndicatedAgents.length} agents - moderate duplicate risk`)
    suggestions.push('Ensure each version has >40% unique content')
  }

  // Check for template usage (good for uniqueness)
  const usesTemplate = Boolean((post as any).contentTemplate)
  if (!usesTemplate && (showOnAllAgents || syndicatedAgents.length > 5)) {
    suggestions.push('Consider using a content template with dynamic sections for better uniqueness')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  }
}

export default getCanonicalUrl
