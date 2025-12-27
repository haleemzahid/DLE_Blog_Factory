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
      title: 'State Network | Designated Local Expert',
    }
  }

  return {
    title: `${state.name} Designated Local Expert Network | DLE`,
    description: `Browse ${state.name} Designated Local Expert agents. Find trademark-protected real estate SEO experts in your ${state.name} city.`,
  }
}

export default async function StateNetworkPage({ params }: Args) {
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

  // Fetch agents in this state
  const agents = await payload.find({
    collection: 'agents',
    where: {
      state: { equals: state.id },
      _status: { equals: 'published' },
    },
    limit: 100,
    sort: 'city',
  })

  // Fetch designations for sidebar
  const designations = await payload.find({
    collection: 'designations',
    limit: 50,
    sort: 'sortOrder',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{state.name} Network</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Browse {state.name} Designated Local Expert agents. Find trademark-protected real estate
            SEO experts in your city.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Become a DLE Member
            </Link>
            <Link
              href="/member-relations"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Check City Availability
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - Agent Listings */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {state.name} Designated Local Experts ({agents.totalDocs})
              </h2>

              {agents.docs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {agents.docs.map((agent) => {
                    const photo = typeof agent.profilePhoto === 'object' ? agent.profilePhoto : null
                    const photoUrl = photo?.url ? getMediaUrl(photo.url) : null
                    const designations = Array.isArray(agent.designation) ? agent.designation : []
                    const firstDesignation =
                      designations.length > 0 && typeof designations[0] === 'object'
                        ? designations[0]
                        : null

                    return (
                      <Link
                        key={agent.id}
                        href={`/agents/${agent.slug}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
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
                            <p className="text-blue-600 font-medium text-sm">
                              {firstDesignation.title}
                            </p>
                          )}
                          <p className="text-gray-600 text-sm mt-1">
                            {agent.city}, {state.abbreviation}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Agents Yet in {state.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Be the first Designated Local Expert in {state.name}! Apply now to claim your
                    city.
                  </p>
                  <Link
                    href="/apply"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar - Designations */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">
                  Browse by Designation
                </h3>
                <ul className="space-y-2">
                  {designations.docs.map((designation) => (
                    <li key={designation.id}>
                      <Link
                        href={`/designations/${designation.slug}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1 text-sm"
                      >
                        <span className="text-blue-600">▶</span>
                        {designation.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-bold text-gray-900 mb-2">Other Networks</h4>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <Link
                        href="/networks/california"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        California Network
                      </Link>
                    </li>
                    <li>
                      <Link href="/networks/texas" className="text-gray-600 hover:text-blue-600">
                        Texas Network
                      </Link>
                    </li>
                    <li>
                      <Link href="/networks/florida" className="text-gray-600 hover:text-blue-600">
                        Florida Network
                      </Link>
                    </li>
                    <li>
                      <Link href="/directory" className="text-blue-600 hover:underline font-medium">
                        View All →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
