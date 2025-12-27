'use client'

import React, { useState } from 'react'
import { Media } from '@/components/Media'
import Link from 'next/link'
import type { Media as MediaType } from '@/payload-types'

interface TeamMember {
  name: string
  role?: string | null
  photo: MediaType | string
  bio?: string | null
  linkedIn?: string | null
  id?: string | null
}

interface TeamSectionBlockProps {
  eyebrow?: string | null
  title?: string | null
  members?: TeamMember[] | null
  ctaLabel?: string | null
  ctaLink?: string | null
  blockType: 'teamSection'
  blockName?: string | null
}

export const TeamSectionBlock: React.FC<TeamSectionBlockProps> = ({
  eyebrow,
  title,
  members,
  ctaLabel,
  ctaLink,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 2

  if (!members || members.length === 0) return null

  // Use all members that have basic data
  const validMembers = members.filter((member) => member.name && member.photo)

  if (validMembers.length === 0) return null

  const maxIndex = Math.max(0, validMembers.length - itemsPerView)
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < maxIndex

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const visibleMembers = validMembers.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <section className="py-6 md:py-24 bg-gradient-to-br from-blue-50/50 via-white to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-100/40 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-center">
          {/* Left Side - Content (Text) */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {eyebrow && <span className="text-red-500 text-lg font-normal">{eyebrow}</span>}
            {title && (
              <h2 className="text-3xl  font-bold text-gray-900 dark:text-white mt-3 leading-tight">
                {title}
              </h2>
            )}

            {/* CTA Button */}
            {ctaLabel && ctaLink && (
              <div className="mt-8">
                <Link
                  href={ctaLink}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-black text-white font-medium px-8 py-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
                >
                  {ctaLabel}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Right Side - Team Members with Navigation */}
          <div className="flex items-center justify-center lg:justify-end gap-4 order-1 lg:order-2">
            {/* Left Navigation Button */}
            {validMembers.length > itemsPerView && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                  canGoPrev
                    ? 'border-gray-300 hover:border-red-600 hover:bg-red-600 hover:text-white text-gray-600'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Team Members */}
            <div className="flex gap-6">
              {visibleMembers.map((member, index) => (
                <div key={`${member.id}-${index}`} className="group text-center">
                  {/* Photo Card */}
                  <div className="relative w-56 md:w-72 h-64 md:h-80 mb-4 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white">
                    {member.photo && typeof member.photo === 'object' && (
                      <Media resource={member.photo} fill imgClassName="object-cover" />
                    )}
                    {/* LinkedIn Overlay */}
                    {member.linkedIn && (
                      <a
                        href={member.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${member.name}'s LinkedIn profile`}
                        className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors flex items-center justify-center"
                      >
                        <svg
                          className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  {member.role && <p className="text-sm text-red-500 mt-1">{member.role}</p>}
                </div>
              ))}
            </div>

            {/* Right Navigation Button */}
            {validMembers.length > itemsPerView && (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                  canGoNext
                    ? 'border-gray-300 hover:border-red-600 hover:bg-red-600 hover:text-white text-gray-600'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
