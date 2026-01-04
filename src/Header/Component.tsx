import { HeaderClient } from './Component.client'
import { TenantHeaderClient } from './TenantHeader.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getTenantHeader, getTenantLogo } from '@/utilities/getTenantNavigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Header, Designation, State, Tenant } from '@/payload-types'

interface HeaderProps {
  tenant?: Tenant | null
}

export async function Header({ tenant }: HeaderProps) {
  const payload = await getPayload({ config: configPromise })

  // Check if tenant has a custom header
  const tenantHeader = tenant?.id ? await getTenantHeader(String(tenant.id)) : null

  // If tenant has custom header, render tenant-specific header
  if (tenantHeader && tenant?.type === 'agent') {
    const logo = getTenantLogo(tenantHeader, tenant)
    return (
      <TenantHeaderClient
        tenantHeader={tenantHeader}
        tenant={tenant}
        logo={logo}
      />
    )
  }

  // Otherwise, render default main site header with navigation
  // Fetch header data with caching and revalidation tag
  const headerData = await getCachedGlobal('header', 1)() as Header

  // Fetch parent designations (top-level) with their children
  const designationsResult = await payload.find({
    collection: 'designations',
    where: {
      parentDesignation: { exists: false }, // Only top-level designations
    },
    limit: 50,
    sort: 'sortOrder',
  })

  // Fetch child designations
  const childDesignationsResult = await payload.find({
    collection: 'designations',
    where: {
      parentDesignation: { exists: true },
    },
    limit: 100,
    sort: 'sortOrder',
  })

  // Fetch all US states for networks dropdown
  const statesResult = await payload.find({
    collection: 'states',
    where: {
      isUnincorporated: { equals: false },
      country: { equals: 'usa' },
    },
    limit: 60,
    sort: 'name',
  })

  const designations = designationsResult.docs as Designation[]
  const childDesignations = childDesignationsResult.docs as Designation[]
  const states = statesResult.docs as State[]

  return (
    <HeaderClient
      data={headerData}
      designations={designations}
      childDesignations={childDesignations}
      states={states}
    />
  )
}
