import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Header, Designation, State } from '@/payload-types'

export async function Header() {
  const payload = await getPayload({ config: configPromise })

  // Fetch header data directly (bypass cache for testing)
  const headerData = await payload.findGlobal({
    slug: 'header',
    depth: 1,
  }) as Header
  
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
