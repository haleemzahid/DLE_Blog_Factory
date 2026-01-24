import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const metadata: Metadata = {
  title: 'Real Estate Networks by State | Designated Local Expert',
  description:
    'Browse our state-by-state real estate networks. Find trademark-protected Designated Local Experts in every major US market.',
}

export default async function NetworksPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all US states with navigation enabled
  const usStates = await payload.find({
    collection: 'states',
    where: {
      country: { equals: 'usa' },
      isUnincorporated: { equals: false },
    },
    limit: 100,
    sort: 'name',
  })

  // Fetch international networks
  const internationalStates = await payload.find({
    collection: 'states',
    where: {
      country: { not_equals: 'usa' },
    },
    limit: 50,
    sort: 'name',
  })

  // Fetch agent counts per state
  const agentCounts: Record<string, number> = {}
  for (const state of usStates.docs) {
    const count = await payload.count({
      collection: 'agents',
      where: {
        state: { equals: state.id },
        _status: { equals: 'published' },
      },
    })
    agentCounts[state.id] = count.totalDocs
  }

  // Group states by first letter for alphabetical navigation
  const statesByLetter: Record<string, typeof usStates.docs> = {}
  usStates.docs.forEach((state) => {
    const letter = state.name.charAt(0).toUpperCase()
    if (!statesByLetter[letter]) {
      statesByLetter[letter] = []
    }
    statesByLetter[letter].push(state)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">State Networks</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Explore our growing network of Designated Local Experts across the United States. Each
            agent holds exclusive trademark rights to their city designation.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Apply for DLE Membership
            </Link>
            <Link
              href="/directory"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              View Full Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Alphabet Navigation */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-1 py-3">
            {Object.keys(statesByLetter)
              .sort()
              .map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"
                >
                  {letter}
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* US States Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">United States Networks</h2>

          {Object.keys(statesByLetter)
            .sort()
            .map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="mb-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-2">{letter}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {statesByLetter[letter].map((state) => {
                    const headerImage =
                      typeof state.headerImage === 'object' ? state.headerImage : null
                    const imageUrl = headerImage?.url ? getMediaUrl(headerImage.url) : null
                    const agentCount = agentCounts[state.id] || 0

                    return (
                      <Link
                        key={state.id}
                        href={`/networks/${state.slug}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        <div className="aspect-[3/2] relative bg-gradient-to-br from-blue-800 to-blue-600">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={state.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl font-bold text-white/30">
                                {state.abbreviation}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h4 className="font-bold text-lg text-white">{state.name}</h4>
                            <p className="text-white/80 text-sm">
                              {agentCount} Agent{agentCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* International Networks */}
      {internationalStates.docs.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">International Networks</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {internationalStates.docs.map((region) => {
                const headerImage =
                  typeof region.headerImage === 'object' ? region.headerImage : null
                const imageUrl = headerImage?.url ? getMediaUrl(headerImage.url) : null

                return (
                  <Link
                    key={region.id}
                    href={`/networks/${region.slug}`}
                    className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-[3/2] relative bg-gradient-to-br from-gray-700 to-gray-500">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={region.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl font-bold text-white/30">
                            {region.abbreviation}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="font-bold text-lg text-white">{region.name}</h4>
                        <p className="text-white/80 text-sm capitalize">
                          {region.country?.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don&apos;t See Your State?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We&apos;re expanding rapidly. Apply today to become the first Designated Local Expert in
            your city!
          </p>
          <Link
            href="/apply"
            className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  )
}
