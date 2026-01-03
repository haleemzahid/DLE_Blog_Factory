'use client'

import React, { createContext, useContext } from 'react'
import type { Tenant } from '@/payload-types'

interface TenantContextValue {
  tenant: Tenant | null
  isMainSite: boolean
  isAgentSite: boolean
  primaryDomain: string
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  isMainSite: true,
  isAgentSite: false,
  primaryDomain: '',
})

/**
 * Get primary domain from tenant domains array
 */
function getPrimaryDomainFromTenant(tenant: Tenant | null): string {
  if (!tenant?.domains) return ''
  const domains = tenant.domains as Array<{ domain: string; isPrimary?: boolean }>
  const primary = domains.find((d) => d.isPrimary)
  return primary?.domain || domains[0]?.domain || ''
}

interface TenantProviderProps {
  tenant: Tenant | null
  children: React.ReactNode
}

export function TenantProvider({ tenant, children }: TenantProviderProps) {
  const value: TenantContextValue = {
    tenant,
    isMainSite: tenant?.type === 'main',
    isAgentSite: tenant?.type === 'agent',
    primaryDomain: getPrimaryDomainFromTenant(tenant),
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

/**
 * Hook to access tenant context
 */
export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

/**
 * Hook to check if current site is the main DLE site
 */
export function useIsMainSite() {
  const { isMainSite } = useTenant()
  return isMainSite
}

/**
 * Hook to check if current site is an agent site
 */
export function useIsAgentSite() {
  const { isAgentSite } = useTenant()
  return isAgentSite
}

/**
 * Hook to get tenant branding
 */
export function useTenantBranding() {
  const { tenant } = useTenant()

  if (!tenant?.branding) {
    return {
      logo: null,
      favicon: null,
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#fbbf24',
    }
  }

  const branding = tenant.branding as {
    logo?: unknown
    favicon?: unknown
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
  }

  return {
    logo: branding.logo || null,
    favicon: branding.favicon || null,
    primaryColor: branding.primaryColor || '#1e40af',
    secondaryColor: branding.secondaryColor || '#3b82f6',
    accentColor: branding.accentColor || '#fbbf24',
  }
}

/**
 * Hook to get tenant SEO defaults
 */
export function useTenantSeo() {
  const { tenant } = useTenant()

  if (!tenant?.seoDefaults) {
    return {
      siteName: 'Designated Local Expert',
      defaultDescription: '',
      defaultImage: null,
    }
  }

  const seoDefaults = tenant.seoDefaults as {
    siteName?: string
    defaultDescription?: string
    defaultImage?: unknown
  }

  return {
    siteName: seoDefaults.siteName || 'Designated Local Expert',
    defaultDescription: seoDefaults.defaultDescription || '',
    defaultImage: seoDefaults.defaultImage || null,
  }
}

/**
 * Hook to get tenant analytics configuration
 */
export function useTenantAnalytics() {
  const { tenant } = useTenant()

  if (!tenant?.analytics) {
    return {
      googleAnalyticsId: null,
      googleTagManagerId: null,
      facebookPixelId: null,
    }
  }

  const analytics = tenant.analytics as {
    googleAnalyticsId?: string
    googleTagManagerId?: string
    facebookPixelId?: string
  }

  return {
    googleAnalyticsId: analytics.googleAnalyticsId || null,
    googleTagManagerId: analytics.googleTagManagerId || null,
    facebookPixelId: analytics.facebookPixelId || null,
  }
}

export default TenantProvider
