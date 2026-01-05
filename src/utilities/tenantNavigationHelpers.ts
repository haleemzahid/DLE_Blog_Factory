/**
 * Client-safe utility functions for tenant navigation
 * These functions do NOT import payload-config and can be used in client components
 */

/**
 * Resolve navigation link to a URL
 * Accepts the polymorphic relationship types from PayloadCMS
 */
export function resolveNavLink(item: {
  linkType?: 'internal' | 'custom' | null
  internalLink?: unknown
  customUrl?: string | null
}): string {
  if (item.linkType === 'custom' && item.customUrl) {
    return item.customUrl
  }

  if (item.linkType === 'internal' && item.internalLink) {
    // Handle polymorphic relationship from PayloadCMS
    const link = item.internalLink as {
      relationTo?: string
      value?: { slug?: string } | number
      slug?: string
    }

    // Handle populated relationship (value is an object with slug)
    if (typeof link.value === 'object' && link.value?.slug) {
      const collection = link.relationTo || 'pages'
      return collection === 'posts' ? `/posts/${link.value.slug}` : `/${link.value.slug}`
    }

    // Handle direct slug on the relationship
    if (link.slug) {
      return `/${link.slug}`
    }
  }

  return '#'
}

/**
 * Format copyright text with dynamic year
 */
export function formatCopyrightText(text: string | undefined): string {
  if (!text) {
    return `© ${new Date().getFullYear()} All rights reserved.`
  }

  // Replace {year} placeholder with current year
  return text.replace('{year}', new Date().getFullYear().toString())
}
