import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type Args = {
  params: Promise<{
    state: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const states = await payload.find({
    collection: 'states',
    limit: 100,
    select: { slug: true },
  })

  return states.docs.map(({ slug }) => ({
    state: slug,
  }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { state: stateSlug } = await params

  const payload = await getPayload({ config: configPromise })
  const states = await payload.find({
    collection: 'states',
    where: { slug: { equals: stateSlug } },
    limit: 1,
  })

  const state = states.docs[0]
  if (!state) {
    return {
      title: 'Designation Directory | Designated Local Expert',
    }
  }

  return {
    title: `${state.name} Designation Directory | Designated Local Expert`,
    description: `Browse all ${state.name} Designated Local Expert designations. Find Mr. and Ms. trademark-protected real estate designations for every city in ${state.name}.`,
  }
}

export default async function DesignationDirectoryPage({ params }: Args) {
  const { state: stateSlug } = await params

  const payload = await getPayload({ config: configPromise })

  // Fetch the state
  const states = await payload.find({
    collection: 'states',
    where: { slug: { equals: stateSlug } },
    limit: 1,
  })

  const state = states.docs[0]
  if (!state) {
    notFound()
  }

  // Fetch agents in this state to get cities
  const agents = await payload.find({
    collection: 'agents',
    where: {
      state: { equals: state.id },
      _status: { equals: 'published' },
    },
    limit: 500,
    sort: 'city',
  })

  // Get unique cities from agents for designation list
  const cities = [...new Set(agents.docs.map((agent) => agent.city).filter(Boolean))].sort()

  // Get featured video URL from state (if available) or use default DLE video
  const featuredVideoUrl =
    typeof state.featuredVideo === 'string'
      ? state.featuredVideo
      : 'https://www.youtube.com/embed/VIDEO_ID_HERE'

  return (
    <div className="min-h-screen">
      {/* Hero Section - Blue Header */}
      <section className="bg-[#2B7CB3] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {state.name} Designation Directory
          </h1>
          <p className="text-lg text-blue-100">Agent Designations™</p>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-[#2B7CB3] pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-900">
              <iframe
                src={featuredVideoUrl}
                title={`${state.name} DLE Network Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Designation Directory Section - Two Columns with Map Background */}
      <section className="py-12 relative bg-[url('/map-background.png')] bg-cover bg-center bg-no-repeat">
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-white/90" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Two Column Layout for Mr. and Ms. Designations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mr. Designations Column */}
            <div>
              <ul className="space-y-2">
                {/* State-level Mr. designation */}
                <li>
                  <Link
                    href={`/designations/mr-${state.slug}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    <span className="text-blue-500">●</span>
                    <span>Mr. {state.name} ™</span>
                  </Link>
                </li>
                {/* City designations */}
                {cities.map((city) => (
                  <li key={`mr-${city}`}>
                    <Link
                      href={`/designations/mr-${city?.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                    >
                      <span className="text-blue-500">●</span>
                      <span>Mr. {city} ™</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ms. Designations Column */}
            <div>
              <ul className="space-y-2">
                {/* State-level Ms. designation */}
                <li>
                  <Link
                    href={`/designations/ms-${state.slug}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    <span className="text-blue-500">●</span>
                    <span>Ms. {state.name} ™</span>
                  </Link>
                </li>
                {/* City designations */}
                {cities.map((city) => (
                  <li key={`ms-${city}`}>
                    <Link
                      href={`/designations/ms-${city?.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                    >
                      <span className="text-blue-500">●</span>
                      <span>Ms. {city} ™</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Claim Your {state.name} Designation
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Become the exclusive Designated Local Expert for your city in {state.name}. Get
            trademark-protected branding and SEO dominance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Apply for DLE Membership
            </Link>
            <Link
              href="/member-relations"
              className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-8 rounded-lg border border-gray-300 transition-colors"
            >
              Inquire About Availability
            </Link>
          </div>
        </div>
      </section>

      {/* Agent Listings Section (if there are agents) */}
      {agents.docs.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {state.name} Designated Local Experts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {agents.docs.map((agent) => {
                const photo = typeof agent.profilePhoto === 'object' ? agent.profilePhoto : null
                const photoUrl = photo?.url ? getMediaUrl(photo.url) : null
                const agentDesignations = Array.isArray(agent.designation) ? agent.designation : []
                const firstDesignation =
                  agentDesignations.length > 0 && typeof agentDesignations[0] === 'object'
                    ? agentDesignations[0]
                    : null

                return (
                  <Link
                    key={agent.id}
                    href={`/agents/${agent.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group border"
                  >
                    <div className="aspect-[4/3] relative bg-gray-200">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={agent.displayName || agent.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {agent.displayName || agent.name}
                      </h3>
                      {firstDesignation && (
                        <p className="text-blue-600 font-medium text-sm">{firstDesignation.title}</p>
                      )}
                      <p className="text-gray-600 text-sm mt-1">
                        {agent.city}, {state.abbreviation}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
