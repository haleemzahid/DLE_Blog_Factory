import React from 'react'
import { headers } from 'next/headers'
import { getTenantByDomain, getMainTenant } from '@/utilities/getTenant'
import { getTenantNavigation, getTenantLogo } from '@/utilities/getTenantNavigation'
import { TenantHeaderClient } from '@/Header/TenantHeader.client'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'

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
    : { header: null, footer: null }

  // Get logo
  const logo = getTenantLogo(tenantHeader, tenant)

  return (
    <>
      {/* Tenant Header */}
      {tenantHeader && tenant ? (
        <TenantHeaderClient tenantHeader={tenantHeader} tenant={tenant} logo={logo} />
      ) : (
        <Header tenant={tenant} />
      )}

      {/* Page Content */}
      {children}

      {/* Tenant Footer */}
      <Footer tenant={tenant} />
    </>
  )
}
