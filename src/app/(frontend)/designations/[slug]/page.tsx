import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { BasicRichText } from '@/components/RichText/BasicRichText'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const designations = await payload.find({
    collection: 'designations',
    limit: 100,
    select: { slug: true },
  })

  return designations.docs.map(({ slug }) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params

  const payload = await getPayload({ config: configPromise })
  const designations = await payload.find({
    collection: 'designations',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const designation = designations.docs[0]
  if (!designation) {
    return {
      title: 'Designation Directory | Designated Local Expert',
    }
  }

  return {
    title: `${designation.title} Directory | Designated Local Expert`,
    description: `Browse all ${designation.title} designated real estate agents. Find your local trademark-protected SEO expert.`,
  }
}

export default async function DesignationPage({ params }: Args) {
  const { slug } = await params

  const payload = await getPayload({ config: configPromise })

  // Fetch the designation
  const designations = await payload.find({
    collection: 'designations',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const designation = designations.docs[0]
  if (!designation) {
    notFound()
  }

  // Fetch agents with this designation
  const agents = await payload.find({
    collection: 'agents',
    where: {
      designation: { equals: designation.id },
      _status: { equals: 'published' },
    },
    limit: 100,
    sort: 'lastName',
  })

  // Fetch states for sidebar
  const states = await payload.find({
    collection: 'states',
    where: {
      country: { equals: 'usa' },
      isUnincorporated: { equals: false },
    },
    limit: 100,
    sort: 'name',
  })

  // Group agents by state
  const agentsByState: Record<string, typeof agents.docs> = {}
  agents.docs.forEach((agent) => {
    const state = typeof agent.state === 'object' ? agent.state : null
    if (state) {
      const stateName = state.name
      if (!agentsByState[stateName]) {
        agentsByState[stateName] = []
      }
      agentsByState[stateName].push(agent)
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{designation.title}</h1>
          {designation.description && (
            <div className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              <BasicRichText data={designation.description} enableGutter={false} />
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Apply for {designation.title}
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
                {designation.title} Directory ({agents.totalDocs} Agents)
              </h2>

              {agents.docs.length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(agentsByState)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([stateName, stateAgents]) => (
                      <div key={stateName}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                          {stateName} ({stateAgents.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {stateAgents.map((agent) => {
                            const photo =
                              typeof agent.profilePhoto === 'object' ? agent.profilePhoto : null
                            const photoUrl = photo?.url ? getMediaUrl(photo.url) : null
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
                                      <svg
                                        className="w-16 h-16"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div className="p-4">
                                  <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {agent.displayName || agent.name}
                                  </h4>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {agent.city}
                                    {state ? `, ${state.abbreviation}` : ''}
                                  </p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No {designation.title} Agents Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Be the first {designation.title}! Apply now to claim this designation in your
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

            {/* Sidebar - States */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">
                  Browse by State
                </h3>
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {states.docs.map((state) => (
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
                </ul>

                <div className="mt-6 pt-4 border-t">
                  <Link
                    href="/directory"
                    className="text-blue-600 hover:underline font-medium text-sm"
                  >
                    ← Back to Directory
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
