import React from 'react'
import { headers } from 'next/headers'
import { getTenantByDomain, getMainTenant } from '@/utilities/getTenant'
import { getTenantNavigation, getTenantLogo, getTenantFooter } from '@/utilities/getTenantNavigation'
import { TenantHeaderClient } from '@/Header/TenantHeader.client'
import { TenantFooterClient } from './TenantFooter.client'
import { HideParentNav } from './HideParentNav.client'

export default async function AgentPageLayout({ children }: { children: React.ReactNode }) {
  // Get tenant based on current hostname
  const headersList = await headers()
  const host = headersList.get('host') || headersList.get('x-tenant-host') || 'localhost:3000'

  // Try to get tenant by domain, fall back to main tenant
  let tenant = await getTenantByDomain(host)
  if (!tenant) {
    tenant = await getMainTenant()
  }

  // Get tenant header and footer
  const { header: tenantHeader } = tenant?.id
    ? await getTenantNavigation(String(tenant.id))
    : { header: null }

  // Get tenant footer separately
  const tenantFooter = tenant?.id ? await getTenantFooter(String(tenant.id)) : null

  // Get logo
  const logo = getTenantLogo(tenantHeader, tenant)

  return (
    <div className="agent-page-wrapper">
      {/* Hide the parent layout's header and footer */}
      <HideParentNav />

      {/* Tenant Header - Only show if exists */}
      {tenantHeader && tenant && (
        <TenantHeaderClient tenantHeader={tenantHeader} tenant={tenant} logo={logo} />
      )}

      {/* Page Content */}
      {children}

      {/* Tenant Footer - Only show if exists */}
      {tenantFooter && tenant && (
        <TenantFooterClient tenantFooter={tenantFooter} tenant={tenant} />
      )}
    </div>
  )
}
