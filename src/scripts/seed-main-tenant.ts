import { getPayload } from 'payload'
import config from '@payload-config'

async function seedMainTenant() {
  const payload = await getPayload({ config })

  console.log('🔍 Checking for existing main tenant...')

  // Check if main tenant exists
  const existing = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: 'main' } },
  })

  if (existing.docs.length === 0) {
    console.log('📝 Creating main tenant...')

    await payload.create({
      collection: 'tenants',
      data: {
        name: 'Designated Local Expert',
        slug: 'main',
        type: 'main',
        status: 'active',
        domains: [
          {
            domain: 'designatedlocalexpert.com',
            isPrimary: true,
            isVerified: true,
          },
          {
            domain: 'localhost:3000',
            isPrimary: false,
            isVerified: true,
          },
        ],
        seoDefaults: {
          siteName: 'Designated Local Expert',
          defaultDescription:
            'Find your Designated Local Expert real estate agent in any city across America. Connect with Mr. or Ms. [City]™ - your trusted local real estate professional.',
        },
        branding: {
          primaryColor: '#1e40af',
          secondaryColor: '#3b82f6',
          accentColor: '#fbbf24',
        },
      },
    })
    console.log('✅ Main tenant created successfully!')
  } else {
    console.log('ℹ️ Main tenant already exists, skipping...')
  }

  process.exit(0)
}

seedMainTenant().catch((error) => {
  console.error('❌ Error seeding main tenant:', error)
  process.exit(1)
})
