import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Agent, Designation } from '@/payload-types'

interface CustomMember {
  name: string
  photo: number | { id: number; url?: string; alt?: string; filename?: string } | null
  link?: string | null
  id?: string | null
}

interface FeaturedAgentsBlockProps {
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
  displayMode?: 'auto' | 'manual' | 'designation' | 'custom' | null
  selectedAgents?: (Agent | string)[] | null
  designation?: Designation | string | null
  customMembers?: CustomMember[] | null
  limit?: number | null
  layout?: 'carousel' | 'grid' | null
  showDesignation?: boolean | null
  ctaLabel?: string | null
  ctaLink?: string | null
  backgroundColor?: string | null
  eyebrowColor?: string | null
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
    customMembers,
    limit = 6,
    layout = 'carousel',
    showDesignation = true,
    ctaLabel,
    ctaLink,
    backgroundColor = '#f9fafb',
    eyebrowColor = '#dc2626',
  } = props

  const payload = await getPayload({ config: configPromise })

  let agents: Agent[] = []
  const isCustomMode = displayMode === 'custom'

  if (isCustomMode) {
    // Custom members mode - we'll render customMembers array directly
    if (!customMembers || customMembers.length === 0) return null
  } else if (displayMode === 'manual' && selectedAgents && selectedAgents.length > 0) {
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

  if (!isCustomMode && agents.length === 0) return null

  return (
    <section className="py-16" style={{ backgroundColor: backgroundColor || '#f9fafb' }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {eyebrow && (
            <span
              className="font-medium text-sm uppercase tracking-wide"
              style={{ color: eyebrowColor || '#dc2626' }}
            >
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Members Display */}
        {layout === 'carousel' ? (
          <div className="relative">
            {/* Left Arrow */}
            <button
              type="button"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-colors -ml-5"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Carousel */}
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide px-8">
              {isCustomMode
                ? customMembers?.map((member) => (
                    <CustomMemberCard key={member.id || member.name} member={member} />
                  ))
                : agents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      showDesignation={showDesignation || false}
                    />
                  ))}
            </div>

            {/* Right Arrow */}
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-colors -mr-5"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isCustomMode
              ? customMembers?.map((member) => (
                  <CustomMemberCard key={member.id || member.name} member={member} />
                ))
              : agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} showDesignation={showDesignation || false} />
                ))}
          </div>
        )}

        {/* CTA */}
        {ctaLabel && ctaLink && (
          <div className="text-center mt-10">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              {ctaLabel}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
    <Link href={`/agents/${agent.slug}`} className="group flex-shrink-0 snap-start">
      <div className="w-48 md:w-56">
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
              <span className="inline-block bg-white/90 text-xs font-semibold px-3 py-1 rounded-full text-gray-800">
                {firstDesignation.title}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="text-center mt-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
            {agent.displayName || agent.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}

function CustomMemberCard({ member }: { member: CustomMember }) {
  const photo = typeof member.photo === 'object' ? member.photo : null

  const cardContent = (
    <div className="w-48 md:w-56">
      {/* Photo */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {photo && (
          <Media
            resource={photo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* Name */}
      <div className="text-center mt-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
          {member.name}
        </h3>
      </div>
    </div>
  )

  if (member.link) {
    return (
      <Link href={member.link} className="group flex-shrink-0 snap-start">
        {cardContent}
      </Link>
    )
  }

  return <div className="flex-shrink-0 snap-start">{cardContent}</div>
}
