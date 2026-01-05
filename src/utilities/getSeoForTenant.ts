import type { Post, Tenant } from '@/payload-types'
import { getPrimaryDomain } from './getTenant'

interface TenantSeo {
  title: string
  description: string
  canonicalUrl: string
  isCanonical: boolean
  intro: unknown // Rich text content
  slug: string
}

/**
 * Get SEO metadata for a post based on the current tenant
 * Handles canonical URLs and tenant-specific overrides
 */
export function getPostSeoForTenant(post: Post, tenant: Tenant | null): TenantSeo {
  const defaultSeo: TenantSeo = {
    title: (post.meta?.title as string) || post.title,
    description: (post.meta?.description as string) || '',
    intro: post.content,
    slug: post.slug || '',
    canonicalUrl: '',
    isCanonical: true,
  }

  // If no tenant or main post type, use default with main site canonical
  if (!tenant || post.postType === 'main') {
    defaultSeo.canonicalUrl = `https://designatedlocalexpert.com/posts/${post.slug}`
    return defaultSeo
  }

  // Find tenant-specific SEO override
  const overrides = post.tenantSeoOverrides as
    | Array<{
        tenant: Tenant | string
        titleOverride?: string
        descriptionOverride?: string
        introOverride?: unknown
        customSlug?: string
      }>
    | undefined

  const override = overrides?.find((o) => {
    const overrideTenantId = typeof o.tenant === 'object' ? o.tenant.id : o.tenant
    return overrideTenantId === tenant.id
  })

  // Determine if this tenant is the primary (canonical) source
  const primaryTenantId =
    typeof post.primaryTenant === 'object'
      ? (post.primaryTenant as Tenant).id
      : post.primaryTenant

  const isCanonical = tenant.id === primaryTenantId

  // Build canonical URL from primary tenant
  let canonicalUrl: string
  if (primaryTenantId) {
    const primaryTenant =
      typeof post.primaryTenant === 'object' ? (post.primaryTenant as Tenant) : null

    if (primaryTenant) {
      const canonicalDomain = getPrimaryDomain(primaryTenant)
      const canonicalSlug = override?.customSlug || post.slug
      canonicalUrl = `https://${canonicalDomain}/posts/${canonicalSlug}`
    } else {
      canonicalUrl = `https://designatedlocalexpert.com/posts/${post.slug}`
    }
  } else {
    // Default to main site if no primary tenant set
    canonicalUrl = `https://designatedlocalexpert.com/posts/${post.slug}`
  }

  return {
    title: override?.titleOverride || defaultSeo.title,
    description: override?.descriptionOverride || defaultSeo.description,
    intro: override?.introOverride || defaultSeo.intro,
    slug: override?.customSlug || defaultSeo.slug,
    canonicalUrl,
    isCanonical,
  }
}

/**
 * Generate Next.js metadata object for a post
 */
export function generateMetaTags(seo: TenantSeo, tenant: Tenant | null) {
  const seoDefaults = tenant?.seoDefaults as
    | {
        siteName?: string
        defaultDescription?: string
      }
    | undefined

  const siteName = seoDefaults?.siteName || 'Designated Local Expert'

  return {
    title: `${seo.title} | ${siteName}`,
    description: seo.description,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

/**
 * Get page SEO for a tenant (for non-post pages)
 */
export function getPageSeoForTenant(
  page: {
    title: string
    slug?: string
    meta?: {
      title?: string
      description?: string
    }
  },
  tenant: Tenant | null,
) {
  const seoDefaults = tenant?.seoDefaults as
    | {
        siteName?: string
        defaultDescription?: string
      }
    | undefined

  const siteName = seoDefaults?.siteName || 'Designated Local Expert'
  const title = (page.meta?.title as string) || page.title
  const description =
    (page.meta?.description as string) || seoDefaults?.defaultDescription || ''

  const primaryDomain = tenant ? getPrimaryDomain(tenant) : 'designatedlocalexpert.com'
  const canonicalUrl = `https://${primaryDomain}/${page.slug || ''}`

  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/**
 * Generate schema.org structured data for a post
 */
export function generatePostSchema(post: Post, tenant: Tenant | null, seo: TenantSeo) {
  const seoDefaults = tenant?.seoDefaults as
    | {
        siteName?: string
      }
    | undefined

  const siteName = seoDefaults?.siteName || 'Designated Local Expert'
  const primaryDomain = tenant ? getPrimaryDomain(tenant) : 'designatedlocalexpert.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: seo.title,
    description: seo.description,
    url: seo.canonicalUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: `https://${primaryDomain}`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': seo.canonicalUrl,
    },
  }
}

/**
 * Generate schema.org structured data for an agent
 */
export function generateAgentSchema(
  agent: {
    name: string
    displayName?: string
    city?: string
    fullDesignation?: string
    phone?: string
    email?: string
    dreLicense?: string
    bio?: unknown
  },
  tenant: Tenant | null,
) {
  const seoDefaults = tenant?.seoDefaults as
    | {
        siteName?: string
      }
    | undefined

  const primaryDomain = tenant ? getPrimaryDomain(tenant) : 'designatedlocalexpert.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: agent.fullDesignation || agent.displayName || agent.name,
    alternateName: agent.name,
    description: `Designated Local Expert for ${agent.city || ''} real estate. Your trusted ${agent.fullDesignation || 'local expert'}.`,
    url: `https://${primaryDomain}`,
    telephone: agent.phone,
    email: agent.email,
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'designation',
        name: agent.fullDesignation || `${agent.displayName} Designation`,
      },
      ...(agent.dreLicense
        ? [
            {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'license',
              name: `DRE License ${agent.dreLicense}`,
            },
          ]
        : []),
    ],
    memberOf: {
      '@type': 'Organization',
      name: seoDefaults?.siteName || 'Designated Local Expert',
    },
  }
}
