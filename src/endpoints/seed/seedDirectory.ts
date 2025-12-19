import type { Payload } from 'payload'

// Helper to convert string to slug
const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Seeds the States and Designations collections with initial data
 * Run this after the database migration to populate the directory
 */
export const seedDirectory = async (payload: Payload) => {
  console.log('Seeding States...')

  // US States
  const usStates = [
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' },
  ]

  // Unincorporated areas
  const unincorporatedAreas = [
    'Tennessee',
    'Texas (Part-1)',
    'Texas (Part-2)',
    'Utah',
    'Vermont',
    'Virginia (Part 1)',
    'Virginia (Part 2)',
    'Virginia (Part 3)',
    'Washington',
    'West Virginia (Part 1)',
    'West Virginia (Part 2)',
    'West Virginia (Part 3)',
    'Wisconsin (Part 1)',
    'Wisconsin (Part 2)',
    'Wyoming',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri (Part 1)',
    'Missouri (Part 2)',
    'Montana',
    'Nebraska',
  ]

  // Create regular states
  for (const state of usStates) {
    try {
      await payload.create({
        collection: 'states',
        draft: false,
        data: {
          name: state.name,
          abbreviation: state.abbreviation,
          country: 'usa',
          isUnincorporated: false,
          slug: toSlug(state.name),
        },
      })
    } catch (error) {
      console.log(`State ${state.name} may already exist, skipping...`)
    }
  }

  // Create unincorporated areas
  for (const area of unincorporatedAreas) {
    try {
      await payload.create({
        collection: 'states',
        draft: false,
        data: {
          name: `Unincorporated ${area}`,
          abbreviation: '',
          country: 'usa',
          isUnincorporated: true,
          slug: toSlug(`Unincorporated ${area}`),
        },
      })
    } catch (error) {
      console.log(`Unincorporated ${area} may already exist, skipping...`)
    }
  }

  // International
  const internationalRegions = [
    { name: 'Canada', abbreviation: 'CA', country: 'canada' as const },
    { name: 'United Kingdom', abbreviation: 'UK', country: 'uk' as const },
    { name: 'Australia', abbreviation: 'AU', country: 'australia' as const },
    { name: 'New Zealand', abbreviation: 'NZ', country: 'new-zealand' as const },
  ]

  for (const region of internationalRegions) {
    try {
      await payload.create({
        collection: 'states',
        draft: false,
        data: {
          name: region.name,
          abbreviation: region.abbreviation,
          country: region.country,
          isUnincorporated: false,
          slug: toSlug(region.name),
        },
      })
    } catch (error) {
      console.log(`Region ${region.name} may already exist, skipping...`)
    }
  }

  console.log('Seeding Designations...')

  // Main Designations (shown in dropdown)
  const designations = [
    // SEO designations
    {
      title: 'Mr. SEO™',
      prefix: 'mr' as const,
      category: 'seo' as const,
      sortOrder: 1,
      featured: true,
    },
    {
      title: 'Mrs. Seo™',
      prefix: 'mrs' as const,
      category: 'seo' as const,
      sortOrder: 2,
      featured: true,
    },

    // New Build
    {
      title: 'Mr. New Build™',
      prefix: 'mr' as const,
      category: 'new-build' as const,
      sortOrder: 3,
      featured: true,
    },
    {
      title: 'Mrs. New build™',
      prefix: 'mrs' as const,
      category: 'new-build' as const,
      sortOrder: 4,
      featured: true,
    },

    // Title
    {
      title: 'Mr. Title™',
      prefix: 'mr' as const,
      category: 'title' as const,
      sortOrder: 5,
      featured: true,
    },
    {
      title: 'Mrs. Title™',
      prefix: 'mrs' as const,
      category: 'title' as const,
      sortOrder: 6,
      featured: true,
    },

    // Escrow
    {
      title: 'Mr. Escrow™',
      prefix: 'mr' as const,
      category: 'title' as const,
      sortOrder: 7,
      featured: true,
    },
    {
      title: 'Mrs. Escrow™',
      prefix: 'mrs' as const,
      category: 'title' as const,
      sortOrder: 8,
      featured: true,
    },

    // Mobile Home
    {
      title: 'Mr. Mobile home™',
      prefix: 'mr' as const,
      category: 'mobile-home' as const,
      sortOrder: 9,
      featured: true,
    },
    {
      title: 'Mrs. Mobile home™',
      prefix: 'mrs' as const,
      category: 'mobile-home' as const,
      sortOrder: 10,
      featured: true,
    },

    // Listings (parent for sub-items)
    {
      title: 'Mr. Listings™',
      prefix: 'mr' as const,
      category: 'listings' as const,
      sortOrder: 11,
      featured: true,
      isParent: true,
    },
    {
      title: 'Ms. Listings™',
      prefix: 'ms' as const,
      category: 'listings' as const,
      sortOrder: 12,
      featured: true,
      isParent: true,
    },

    // Luxury
    {
      title: 'Mr. Luxury™',
      prefix: 'mr' as const,
      category: 'luxury' as const,
      sortOrder: 13,
      featured: true,
    },
    {
      title: 'Ms. Luxury™',
      prefix: 'ms' as const,
      category: 'luxury' as const,
      sortOrder: 14,
      featured: true,
    },

    // Appraisal
    {
      title: 'Mr. Appraisal™',
      prefix: 'mr' as const,
      category: 'appraisal' as const,
      sortOrder: 15,
      featured: true,
    },
    {
      title: 'Ms. Appraisal™',
      prefix: 'ms' as const,
      category: 'appraisal' as const,
      sortOrder: 16,
      featured: true,
    },

    // Open House
    {
      title: 'Mr. Open House™',
      prefix: 'mr' as const,
      category: 'open-house' as const,
      sortOrder: 17,
      featured: true,
    },

    // Offers
    {
      title: 'Mr. Offers™',
      prefix: 'mr' as const,
      category: 'offers' as const,
      sortOrder: 18,
      featured: true,
    },

    // Nationwide
    {
      title: 'Mr. Nationwide™',
      prefix: 'mr' as const,
      category: 'nationwide' as const,
      sortOrder: 19,
      featured: true,
    },

    // Fix & Flip
    {
      title: 'Mr. Fix & Flip™',
      prefix: 'mr' as const,
      category: 'fix-flip' as const,
      sortOrder: 20,
      featured: true,
    },
    {
      title: 'Ms. Fix & Flip™',
      prefix: 'ms' as const,
      category: 'fix-flip' as const,
      sortOrder: 21,
      featured: true,
    },

    // Marketing
    {
      title: 'Mr. Marketing™',
      prefix: 'mr' as const,
      category: 'marketing' as const,
      sortOrder: 22,
      featured: true,
    },
    {
      title: 'Ms. Marketing™',
      prefix: 'ms' as const,
      category: 'marketing' as const,
      sortOrder: 23,
      featured: true,
    },

    // Efficiency
    {
      title: 'Mr. Efficiency™',
      prefix: 'mr' as const,
      category: 'efficiency' as const,
      sortOrder: 24,
      featured: true,
    },
    {
      title: 'Mrs. Efficiency™',
      prefix: 'mrs' as const,
      category: 'efficiency' as const,
      sortOrder: 25,
      featured: true,
    },
  ]

  // Create parent designations first (Mr. Listings, Ms. Listings)
  const parentDesignationIds: Record<string, number> = {}

  for (const designation of designations) {
    if ((designation as any).isParent) {
      try {
        const created = await payload.create({
          collection: 'designations',
          draft: false,
          data: {
            title: designation.title,
            prefix: designation.prefix,
            category: designation.category,
            sortOrder: designation.sortOrder,
            featured: designation.featured,
            slug: toSlug(designation.title),
          },
        })
        parentDesignationIds[designation.title] = created.id
      } catch (error) {
        console.log(`Designation ${designation.title} may already exist, skipping...`)
      }
    }
  }

  // Create regular designations
  for (const designation of designations) {
    if (!(designation as any).isParent) {
      try {
        await payload.create({
          collection: 'designations',
          draft: false,
          data: {
            title: designation.title,
            prefix: designation.prefix,
            category: designation.category,
            sortOrder: designation.sortOrder,
            featured: designation.featured,
            slug: toSlug(designation.title),
          },
        })
      } catch (error) {
        console.log(`Designation ${designation.title} may already exist, skipping...`)
      }
    }
  }

  // Create child designations (those that appear under Mr. Listings / Ms. Listings)
  const childDesignations = [
    {
      title: 'Mr. Marketing™ (under Listings)',
      prefix: 'mr' as const,
      category: 'marketing' as const,
      parent: 'Mr. Listings™',
    },
    {
      title: 'Mr. luxury™',
      prefix: 'mr' as const,
      category: 'luxury' as const,
      parent: 'Mr. Listings™',
    },
  ]

  for (const child of childDesignations) {
    const parentId = parentDesignationIds[child.parent]
    if (parentId) {
      try {
        await payload.create({
          collection: 'designations',
          draft: false,
          data: {
            title: child.title,
            prefix: child.prefix,
            category: child.category,
            parentDesignation: parentId,
            featured: false,
            sortOrder: 100,
            slug: toSlug(child.title),
          },
        })
      } catch (error) {
        console.log(`Child designation ${child.title} may already exist, skipping...`)
      }
    }
  }

  console.log('Directory seed completed!')
}
