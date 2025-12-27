'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import type { Agent, Designation, Media as MediaType } from '@/payload-types'

interface CustomMember {
  name: string
  photo: number | MediaType | null
  link?: string | null
  id?: string | null
}

interface CarouselClientProps {
  agents: Agent[]
  customMembers?: CustomMember[] | null
  isCustomMode: boolean
  showDesignation: boolean
}

export const CarouselClient: React.FC<CarouselClientProps> = ({
  agents,
  customMembers,
  isCustomMode,
  showDesignation,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(5)
  const containerRef = useRef<HTMLDivElement>(null)

  const items = isCustomMode ? customMembers || [] : agents
  const totalItems = items.length

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setItemsPerView(1)
      } else if (width < 768) {
        setItemsPerView(2)
      } else if (width < 1024) {
        setItemsPerView(3)
      } else if (width < 1280) {
        setItemsPerView(4)
      } else {
        setItemsPerView(5)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, totalItems - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-all -ml-5 ${
          !canGoPrev ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
        }`}
        aria-label="Previous"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden px-8" ref={containerRef}>
        <div
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {isCustomMode
            ? customMembers?.map((member, idx) => (
                <div
                  key={`${member.id}-${idx}`}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                >
                  <CustomMemberCard member={member} />
                </div>
              ))
            : agents.map((agent, idx) => (
                <div
                  key={`${agent.id}-${idx}`}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                >
                  <AgentCard agent={agent} showDesignation={showDesignation} />
                </div>
              ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-all -mr-5 ${
          !canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
        }`}
        aria-label="Next"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

function AgentCard({ agent, showDesignation }: { agent: Agent; showDesignation: boolean }) {
  const designations = agent.designation as (Designation | number)[] | null
  const firstDesignation =
    designations && designations.length > 0 && typeof designations[0] === 'object'
      ? (designations[0] as Designation)
      : null

  return (
    <Link href={`/agents/${agent.slug}`} className="block">
      <div className="w-full">
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
          {agent.profilePhoto && typeof agent.profilePhoto === 'object' && (
            <Media
              resource={agent.profilePhoto}
              fill
              imgClassName="object-cover"
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
          <h3 className="font-semibold text-gray-900">
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
    <div className="w-full">
      {/* Photo */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
        {photo && (
          <Media
            resource={photo}
            fill
            imgClassName="object-cover"
          />
        )}
      </div>

      {/* Name */}
      <div className="text-center mt-3">
        <h3 className="font-semibold text-gray-900">
          {member.name}
        </h3>
      </div>
    </div>
  )

  if (member.link) {
    return (
      <Link href={member.link} className="block">
        {cardContent}
      </Link>
    )
  }

  return <div>{cardContent}</div>
}
