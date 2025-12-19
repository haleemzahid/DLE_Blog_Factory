import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Agent, Designation } from '@/payload-types'

interface FeaturedAgentsBlockProps {
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  displayMode?: 'auto' | 'manual' | 'designation' | null
  selectedAgents?: (Agent | string)[] | null
  designation?: Designation | string | null
  limit?: number | null
  layout?: 'carousel' | 'grid' | null
  showDesignation?: boolean | null
  ctaLabel?: string | null
  ctaLink?: string | null
  blockType: 'featuredAgents'
  blockName?: string | null
}

export const FeaturedAgentsBlock: React.FC<FeaturedAgentsBlockProps> = async (props) => {
  const {
    eyebrow,
    title,
    subtitle,
    displayMode = 'auto',
    selectedAgents,
    designation,
    limit = 6,
    layout = 'carousel',
    showDesignation = true,
    ctaLabel,
    ctaLink,
  } = props

  const payload = await getPayload({ config: configPromise })

  let agents: Agent[] = []

  if (displayMode === 'manual' && selectedAgents && selectedAgents.length > 0) {
    // Manual selection - agents are already populated or need to be fetched
    agents = selectedAgents
      .map((agent) => (typeof agent === 'object' ? agent : null))
      .filter((a): a is Agent => a !== null)
  } else if (displayMode === 'designation' && designation) {
    // By designation
    const designationId = typeof designation === 'object' ? designation.id : designation
    const result = await payload.find({
      collection: 'agents',
      where: {
        designation: { equals: designationId },
        _status: { equals: 'published' },
      },
      limit: limit || 6,
      sort: '-createdAt',
    })
    agents = result.docs
  } else {
    // Auto - fetch featured agents
    const result = await payload.find({
      collection: 'agents',
      where: {
        featured: { equals: true },
        _status: { equals: 'published' },
      },
      limit: limit || 6,
      sort: '-createdAt',
    })
    agents = result.docs
  }

  if (agents.length === 0) return null

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {eyebrow && (
            <span className="text-red-600 font-medium text-sm uppercase tracking-wide">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Agents Display */}
        {layout === 'carousel' ? (
          <div className="relative">
            <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  showDesignation={showDesignation || false}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} showDesignation={showDesignation || false} />
            ))}
          </div>
        )}

        {/* CTA */}
        {ctaLabel && ctaLink && (
          <div className="text-center mt-10">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {ctaLabel}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function AgentCard({ agent, showDesignation }: { agent: Agent; showDesignation: boolean }) {
  // Get the first designation from the array
  const designations = agent.designation as (Designation | number)[] | null
  const firstDesignation =
    designations && designations.length > 0 && typeof designations[0] === 'object'
      ? (designations[0] as Designation)
      : null

  return (
    <Link href={`/agents/${agent.slug}`} className="group flex-shrink-0 w-64 snap-start">
      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {agent.profilePhoto && typeof agent.profilePhoto === 'object' && (
            <Media
              resource={agent.profilePhoto}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {/* Designation Badge */}
          {showDesignation && firstDesignation && (
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-block bg-white/90 dark:bg-gray-800/90 text-xs font-semibold px-3 py-1 rounded-full text-gray-800 dark:text-white">
                {firstDesignation.title}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 text-center">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {agent.displayName || agent.name}
          </h3>
          {agent.city && agent.state && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {agent.city},{' '}
              {typeof agent.state === 'object' ? agent.state.abbreviation : agent.state}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
