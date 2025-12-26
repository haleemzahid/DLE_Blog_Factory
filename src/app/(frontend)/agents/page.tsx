import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const metadata: Metadata = {
  title: 'Our Agents | Designated Local Expert',
  description:
    'Browse our network of trademark-protected Designated Local Expert real estate agents.',
}

export default async function AgentsPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all published agents
  const agents = await payload.find({
    collection: 'agents',
    where: {
      _status: { equals: 'published' },
    },
    limit: 100,
    sort: '-createdAt',
  })

  // Fetch designations for filter
  const designations = await payload.find({
    collection: 'designations',
    limit: 50,
    sort: 'sortOrder',
  })

  // Fetch states for filter
  const states = await payload.find({
    collection: 'states',
    where: {
      country: { equals: 'usa' },
      isUnincorporated: { equals: false },
    },
    limit: 100,
    sort: 'name',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Agents</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Browse our network of trademark-protected Designated Local Expert real estate agents
            across the nation.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Join Our Network
            </Link>
            <Link
              href="/directory"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - Agent Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Agents ({agents.totalDocs})
                </h2>
              </div>

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
                    const state = typeof agent.state === 'object' ? agent.state : null

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
                            {agent.city}
                            {state ? `, ${state.abbreviation}` : ''}
                          </p>
                          {agent.tagline && (
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                              {agent.tagline}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-gray-600 mb-6">
                    Our agent network is growing! Check back soon or apply to become a Designated
                    Local Expert.
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

            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                {/* By Designation */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">
                    By Designation
                  </h3>
                  <ul className="space-y-2">
                    {designations.docs.slice(0, 10).map((designation) => (
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
                    {designations.docs.length > 10 && (
                      <li>
                        <Link
                          href="/directory"
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View All Designations →
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                {/* By State */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">By State</h3>
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {states.docs.slice(0, 15).map((state) => (
                      <li key={state.id}>
                        <Link
                          href={`/networks/${state.slug}`}
                          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1 text-sm"
                        >
                          <span className="text-blue-600">▶</span>
                          {state.name}
                        </Link>
                      </li>
                    ))}
                    {states.docs.length > 15 && (
                      <li>
                        <Link
                          href="/directory"
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View All States →
                        </Link>
                      </li>
                    )}
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
