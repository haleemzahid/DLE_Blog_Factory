import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Tenant } from '@/payload-types'

/**
 * Get tenant by domain (hostname)
 * Cached for 5 minutes to reduce database queries
 */
export const getTenantByDomain = unstable_cache(
  async (hostname: string): Promise<Tenant | null> => {
    const payload = await getPayload({ config })

    // Clean hostname (remove port, www, etc.)
    const cleanHost = hostname
      .replace(/:\d+$/, '') // Remove port
      .replace(/^www\./, '') // Remove www
      .toLowerCase()

    // Find tenant with matching domain
    const result = await payload.find({
      collection: 'tenants',
      where: {
        and: [
          {
            'domains.domain': { equals: cleanHost },
          },
          {
            status: { equals: 'active' },
          },
        ],
      },
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as Tenant) || null
  },
  ['tenant-by-domain'],
  {
    revalidate: 300, // 5 minutes
    tags: ['tenants'],
  },
)

/**
 * Get tenant by slug
 */
export const getTenantBySlug = unstable_cache(
  async (slug: string): Promise<Tenant | null> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'tenants',
      where: {
        and: [
          {
            slug: { equals: slug },
          },
          {
            status: { equals: 'active' },
          },
        ],
      },
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as Tenant) || null
  },
  ['tenant-by-slug'],
  {
    revalidate: 300,
    tags: ['tenants'],
  },
)

/**
 * Get the main site tenant
 */
export const getMainTenant = unstable_cache(
  async (): Promise<Tenant | null> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'tenants',
      where: {
        and: [
          {
            type: { equals: 'main' },
          },
          {
            status: { equals: 'active' },
          },
        ],
      },
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as Tenant) || null
  },
  ['main-tenant'],
  {
    revalidate: 300,
    tags: ['tenants'],
  },
)

/**
 * Get all active tenants
 */
export const getAllActiveTenants = unstable_cache(
  async (): Promise<Tenant[]> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'tenants',
      where: {
        status: { equals: 'active' },
      },
      limit: 1000,
      depth: 2,
    })

    return result.docs as Tenant[]
  },
  ['all-active-tenants'],
  {
    revalidate: 300,
    tags: ['tenants'],
  },
)

/**
 * Get primary domain for a tenant (used for canonical URLs)
 */
export function getPrimaryDomain(tenant: Tenant): string {
  const domains = tenant.domains as Array<{ domain: string; isPrimary?: boolean }> | undefined
  if (!domains || domains.length === 0) return ''

  const primaryDomain = domains.find((d) => d.isPrimary)
  return primaryDomain?.domain || domains[0]?.domain || ''
}

/**
 * Check if current host matches a specific tenant
 */
export function isHostForTenant(hostname: string, tenant: Tenant): boolean {
  const cleanHost = hostname
    .replace(/:\d+$/, '')
    .replace(/^www\./, '')
    .toLowerCase()

  const domains = tenant.domains as Array<{ domain: string }> | undefined
  if (!domains) return false

  return domains.some((d) => d.domain.toLowerCase() === cleanHost)
}

/**
 * Get the canonical URL for a tenant
 */
export function getTenantCanonicalUrl(tenant: Tenant, path: string = ''): string {
  const primaryDomain = getPrimaryDomain(tenant)
  if (!primaryDomain) return path

  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `https://${primaryDomain}${cleanPath}`
}
