'use client'

import React from 'react'
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
  if (!members || members.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
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
        </div>

        {/* Team Grid */}
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {members.map((member, index) => (
            <div key={member.id || index} className="group text-center">
              {/* Photo */}
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                {member.photo && typeof member.photo === 'object' && (
                  <Media resource={member.photo} fill className="object-cover" />
                )}
                {/* LinkedIn Overlay */}
                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
              {member.role && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{member.role}</p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        {ctaLabel && ctaLink && (
          <div className="text-center mt-10">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
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
