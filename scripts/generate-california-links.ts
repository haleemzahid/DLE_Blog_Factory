/**
 * Generate California Agent Links
 *
 * Updates the California block with proper agent links based on the designation names
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

// Function to convert a city designation to a slug
function generateSlug(designationTitle: string): string {
  // Remove trademark symbol and trim
  const cleaned = designationTitle.replace(/™/g, '').trim()

  // Convert to lowercase and replace spaces/special chars with hyphens
  const slug = cleaned
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `/agents/${slug}`
}

async function main() {
  console.log('🔧 Initializing Payload CMS...')
  const payload = await getPayload({ config })
  console.log('✅ Payload CMS initialized\n')

  try {
    // Find the California page that has the California block
    console.log('🔍 Finding California page...')

    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'california',
        },
      },
      limit: 1,
    })

    if (!pages.docs || pages.docs.length === 0) {
      console.log('❌ California page not found')
      console.log('   Please create a page with slug "california" and add the California block first')
      process.exit(1)
    }

    const californiaPage = pages.docs[0]
    console.log(`✅ Found California page: ${californiaPage.title}`)

    // Find the California block in the page
    const layout = californiaPage.layout as any[]
    const californiaBlock = layout?.find((block: any) => block.blockType === 'california')

    if (!californiaBlock) {
      console.log('❌ California block not found on the page')
      console.log('   Please add the California block to the page first')
      process.exit(1)
    }

    console.log('\n🔗 Generating links for California designations...\n')

    // Update Mr. designations
    if (californiaBlock.mrDesignations && Array.isArray(californiaBlock.mrDesignations)) {
      californiaBlock.mrDesignations = californiaBlock.mrDesignations.map(
        (designation: any) => ({
          ...designation,
          link: generateSlug(designation.title),
        }),
      )
      console.log(`✅ Updated ${californiaBlock.mrDesignations.length} Mr. California designations`)
    }

    // Update Ms. designations
    if (californiaBlock.msDesignations && Array.isArray(californiaBlock.msDesignations)) {
      californiaBlock.msDesignations = californiaBlock.msDesignations.map(
        (designation: any) => ({
          ...designation,
          link: generateSlug(designation.title),
        }),
      )
      console.log(`✅ Updated ${californiaBlock.msDesignations.length} Ms. California designations`)
    }

    // Update the page
    console.log('\n💾 Saving updated page...')
    await payload.update({
      collection: 'pages',
      id: californiaPage.id,
      data: {
        layout: layout,
      },
    })

    console.log('✅ California page updated successfully!')
    console.log('\n📋 Summary:')
    console.log('   • All California block links now point to /agents/[designation-slug]')
    console.log('   • Links will work for both existing agents and placeholder pages')
    console.log(
      '   • Example: "Mr. Los Angeles ™" → /agents/mr-los-angeles',
    )
    console.log(
      '   • Example: "Ms. San Francisco ™" → /agents/ms-san-francisco',
    )
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
