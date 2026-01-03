import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const metadata: Metadata = {
  title: 'Real Estate Designations | Designated Local Expert',
  description:
    'Explore our trademarked real estate designations. From Mr. SEO to Mrs. Luxury, find specialty designations for every market niche.',
}

export default async function DesignationsPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all active designations
  const designations = await payload.find({
    collection: 'designations',
    where: {
      isActive: { equals: true },
    },
    limit: 100,
    sort: 'sortOrder',
  })

  // Group designations by category
  const designationsByCategory: Record<string, typeof designations.docs> = {}
  designations.docs.forEach((designation) => {
    const category = designation.category || 'other'
    if (!designationsByCategory[category]) {
      designationsByCategory[category] = []
    }
    designationsByCategory[category].push(designation)
  })

  // Category display names
  const categoryNames: Record<string, string> = {
    city: 'City-Based Designations',
    seo: 'SEO & Marketing',
    luxury: 'Luxury Specialists',
    listings: 'Listings Experts',
    'new-build': 'New Build Specialists',
    title: 'Title & Escrow',
    'mobile-home': 'Mobile Home Experts',
    appraisal: 'Appraisal Specialists',
    'fix-flip': 'Fix & Flip',
    marketing: 'Marketing Specialists',
    'open-house': 'Open House Experts',
    offers: 'Offers Specialists',
    nationwide: 'Nationwide Designations',
    efficiency: 'Efficiency Experts',
    other: 'Other Designations',
  }

  // Category order
  const categoryOrder = [
    'city',
    'seo',
    'luxury',
    'listings',
    'new-build',
    'marketing',
    'appraisal',
    'title',
    'fix-flip',
    'mobile-home',
    'open-house',
    'offers',
    'nationwide',
    'efficiency',
    'other',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Specialty Designations</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Discover our trademarked designations that set real estate professionals apart. Each
            designation represents exclusive expertise in a specific market niche.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Apply for a Designation
            </Link>
            <Link
              href="/networks"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Browse by State
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 py-3 text-sm">
            {categoryOrder
              .filter((cat) => designationsByCategory[cat]?.length > 0)
              .map((category) => (
                <a
                  key={category}
                  href={`#category-${category}`}
                  className="px-3 py-1 text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"
                >
                  {categoryNames[category]}
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* Designations by Category */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {categoryOrder
            .filter((category) => designationsByCategory[category]?.length > 0)
            .map((category) => (
              <div key={category} id={`category-${category}`} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
                  {categoryNames[category]}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {designationsByCategory[category].map((designation) => {
                    const icon = typeof designation.icon === 'object' ? designation.icon : null
                    const iconUrl = icon?.url ? getMediaUrl(icon.url) : null
                    const badgeColor = designation.badgeColor || '#dc2626'

                    return (
                      <Link
                        key={designation.id}
                        href={`/designations/${designation.slug}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all group hover:-translate-y-1"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            {iconUrl ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                <Image
                                  src={iconUrl}
                                  alt={designation.title}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ) : (
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                                style={{ backgroundColor: badgeColor }}
                              >
                                {designation.prefix === 'mr' ? 'Mr' : designation.prefix === 'mrs' ? 'Mrs' : 'Ms'}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                {designation.title}
                              </h3>
                              {designation.shortDescription && (
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                  {designation.shortDescription}
                                </p>
                              )}
                            </div>
                          </div>

                          {designation.featured && (
                            <div className="mt-4">
                              <span
                                className="inline-block px-2 py-1 rounded text-xs font-semibold text-white"
                                style={{ backgroundColor: badgeColor }}
                              >
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Featured Designations Highlight */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Most Popular Designations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {designations.docs
              .filter((d) => d.featured)
              .slice(0, 3)
              .map((designation) => {
                const headerImage =
                  typeof designation.headerImage === 'object' ? designation.headerImage : null
                const imageUrl = headerImage?.url ? getMediaUrl(headerImage.url) : null
                const badgeColor = designation.badgeColor || '#dc2626'

                return (
                  <Link
                    key={designation.id}
                    href={`/designations/${designation.slug}`}
                    className="group"
                  >
                    <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-blue-800 to-blue-600">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={designation.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span
                            className="text-6xl font-bold"
                            style={{ color: `${badgeColor}40` }}
                          >
                            {designation.prefix === 'mr' ? 'Mr.' : designation.prefix === 'mrs' ? 'Mrs.' : 'Ms.'}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white">{designation.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{designation.shortDescription}</p>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Claim Your Designation?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Stand out in your market with an exclusive, trademarked designation. Apply today to
            become the definitive expert in your niche.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </Link>
            <Link
              href="/member-relations"
              className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
