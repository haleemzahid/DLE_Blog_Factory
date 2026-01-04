import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { TenantHeader, TenantFooter, Tenant } from '@/payload-types'

// Re-export client-safe functions from the helper file
export { resolveNavLink, formatCopyrightText } from './tenantNavigationHelpers'

/**
 * Get the custom header for a tenant
 * Falls back to null if no custom header exists (use default header)
 */
export const getTenantHeader = unstable_cache(
  async (tenantId: string): Promise<TenantHeader | null> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'tenant-headers',
      where: {
        tenant: { equals: tenantId },
      },
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as TenantHeader) || null
  },
  ['tenant-header'],
  {
    revalidate: 300, // 5 minutes
    tags: ['tenant-headers'],
  },
)

/**
 * Get the custom footer for a tenant
 * Falls back to null if no custom footer exists (use default footer)
 */
export const getTenantFooter = unstable_cache(
  async (tenantId: string): Promise<TenantFooter | null> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'tenant-footers',
      where: {
        tenant: { equals: tenantId },
      },
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as TenantFooter) || null
  },
  ['tenant-footer'],
  {
    revalidate: 300,
    tags: ['tenant-footers'],
  },
)

/**
 * Get both header and footer for a tenant in one call
 */
export async function getTenantNavigation(tenantId: string) {
  const [header, footer] = await Promise.all([
    getTenantHeader(tenantId),
    getTenantFooter(tenantId),
  ])

  return { header, footer }
}


/**
 * Get logo URL from tenant or header
 * Priority: Header logo > Tenant branding logo
 */
export function getTenantLogo(
  header: TenantHeader | null,
  tenant: Tenant | null,
): { url: string; alt: string } | null {
  // Check header logo first
  if (header?.logo) {
    const logo = header.logo as { url?: string; alt?: string }
    if (logo.url) {
      return { url: logo.url, alt: logo.alt || 'Logo' }
    }
  }

  // Fall back to tenant branding logo
  if (tenant?.branding) {
    const branding = tenant.branding as { logo?: { url?: string; alt?: string } }
    if (branding.logo?.url) {
      return { url: branding.logo.url, alt: branding.logo.alt || 'Logo' }
    }
  }

  return null
}

/**
 * Get social links from footer with proper formatting
 */
export function getSocialLinks(footer: TenantFooter | null): Array<{
  platform: string
  url: string
  icon: string
}> {
  if (!footer?.socialLinks) return []

  const socialLinks = footer.socialLinks as {
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    twitter?: string
    tiktok?: string
    pinterest?: string
  }

  const links: Array<{ platform: string; url: string; icon: string }> = []

  if (socialLinks.facebook) {
    links.push({ platform: 'Facebook', url: socialLinks.facebook, icon: 'facebook' })
  }
  if (socialLinks.instagram) {
    links.push({ platform: 'Instagram', url: socialLinks.instagram, icon: 'instagram' })
  }
  if (socialLinks.linkedin) {
    links.push({ platform: 'LinkedIn', url: socialLinks.linkedin, icon: 'linkedin' })
  }
  if (socialLinks.youtube) {
    links.push({ platform: 'YouTube', url: socialLinks.youtube, icon: 'youtube' })
  }
  if (socialLinks.twitter) {
    links.push({ platform: 'Twitter/X', url: socialLinks.twitter, icon: 'twitter' })
  }
  if (socialLinks.tiktok) {
    links.push({ platform: 'TikTok', url: socialLinks.tiktok, icon: 'tiktok' })
  }
  if (socialLinks.pinterest) {
    links.push({ platform: 'Pinterest', url: socialLinks.pinterest, icon: 'pinterest' })
  }

  return links
}


/**
 * Get contact info from footer
 */
export function getContactInfo(footer: TenantFooter | null): {
  phone?: string
  email?: string
  address?: string
} {
  if (!footer?.contactInfo) return {}

  const contactInfo = footer.contactInfo as {
    phone?: string
    email?: string
    address?: string
  }

  return {
    phone: contactInfo.phone,
    email: contactInfo.email,
    address: contactInfo.address,
  }
}
