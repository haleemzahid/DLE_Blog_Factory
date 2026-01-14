import React from 'react'
import { headers } from 'next/headers'
import { getTenantByDomain, getMainTenant } from '@/utilities/getTenant'
import { getTenantNavigation, getTenantLogo, getTenantFooter } from '@/utilities/getTenantNavigation'
import { TenantHeaderClient } from '@/Header/TenantHeader.client'
import { TenantFooterClient } from './TenantFooter.client'
import { HideParentNav } from './HideParentNav.client'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Tenant } from '@/payload-types'

export default async function AgentPageLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug?: string }>
}) {
  // Get tenant based on current hostname
  const headersList = await headers()
  const host = headersList.get('host') || headersList.get('x-tenant-host') || 'localhost:3000'

  // Try to get tenant by domain, fall back to main tenant
  let tenant = await getTenantByDomain(host)
  if (!tenant) {
    tenant = await getMainTenant()
  }

  // Get agent ID and tenant from slug to support agent-specific headers/footers
  const { slug } = await params
  let agentId: string | undefined
  let agentTenant: Tenant | null = null
  if (slug) {
    const payload = await getPayload({ config: configPromise })
    const agentResult = await payload.find({
      collection: 'agents',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    if (agentResult.docs[0]) {
      agentId = String(agentResult.docs[0].id)
      // If agent has a tenant, use that for headers/footers instead of domain tenant
      if (agentResult.docs[0].tenant && typeof agentResult.docs[0].tenant === 'object') {
        agentTenant = agentResult.docs[0].tenant
      }
    }
  }

  // Use agent's tenant if available, otherwise use domain tenant
  const effectiveTenant = agentTenant || tenant
  const effectiveTenantId = effectiveTenant?.id ? String(effectiveTenant.id) : null

  // Get tenant header and footer (with optional agent-specific override)
  const { header: tenantHeader } = effectiveTenantId
    ? await getTenantNavigation(effectiveTenantId, agentId)
    : { header: null }

  // Get tenant footer separately (with optional agent-specific override)
  const tenantFooter = effectiveTenantId ? await getTenantFooter(effectiveTenantId, agentId) : null

  // Get logo using the effective tenant (agent's tenant or domain tenant)
  const logo = getTenantLogo(tenantHeader, effectiveTenant)

  return (
    <div className="agent-page-wrapper">
      {/* Hide the parent layout's header and footer */}
      <HideParentNav />

      {/* Tenant Header - Falls back to global header if no custom header exists */}
      {tenantHeader && effectiveTenant ? (
        <TenantHeaderClient tenantHeader={tenantHeader} tenant={effectiveTenant} logo={logo} />
      ) : (
        <Header tenant={effectiveTenant} />
      )}

      {/* Page Content */}
      {children}

      {/* Tenant Footer - Falls back to global footer if no custom footer exists */}
      {tenantFooter && effectiveTenant ? (
        <TenantFooterClient tenantFooter={tenantFooter} tenant={effectiveTenant} />
      ) : (
        <Footer tenant={effectiveTenant} />
      )}
    </div>
  )
}
