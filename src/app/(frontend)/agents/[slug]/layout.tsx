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

  // Get agent ID from slug to support agent-specific headers/footers
  const { slug } = await params
  let agentId: string | undefined
  if (slug) {
    const payload = await getPayload({ config: configPromise })
    const agentResult = await payload.find({
      collection: 'agents',
      where: { slug: { equals: slug } },
      limit: 1,
      select: { id: true },
    })
    if (agentResult.docs[0]) {
      agentId = String(agentResult.docs[0].id)
    }
  }

  // Get tenant header and footer (with optional agent-specific override)
  const { header: tenantHeader } = tenant?.id
    ? await getTenantNavigation(String(tenant.id), agentId)
    : { header: null }

  // Get tenant footer separately (with optional agent-specific override)
  const tenantFooter = tenant?.id ? await getTenantFooter(String(tenant.id), agentId) : null

  // Get logo
  const logo = getTenantLogo(tenantHeader, tenant)

  return (
    <div className="agent-page-wrapper">
      {/* Hide the parent layout's header and footer */}
      <HideParentNav />

      {/* Tenant Header - Falls back to global header if no custom header exists */}
      {tenantHeader && tenant ? (
        <TenantHeaderClient tenantHeader={tenantHeader} tenant={tenant} logo={logo} />
      ) : (
        <Header tenant={tenant} />
      )}

      {/* Page Content */}
      {children}

      {/* Tenant Footer - Falls back to global footer if no custom footer exists */}
      {tenantFooter && tenant ? (
        <TenantFooterClient tenantFooter={tenantFooter} tenant={tenant} />
      ) : (
        <Footer tenant={tenant} />
      )}
    </div>
  )
}
