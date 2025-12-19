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
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50/50 via-white to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-100/40 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Team Members */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
            {members.map((member, index) => (
              <div key={member.id || index} className="group text-center">
                {/* Photo Card */}
                <div className="relative w-56 h-72 mb-4 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white">
                  {member.photo && typeof member.photo === 'object' && (
                    <Media resource={member.photo} fill imgClassName="object-cover" />
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
                        className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{member.role}</p>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Content */}
          <div className="text-center lg:text-left">
            {eyebrow && (
              <span className="text-red-500 font-medium text-base italic">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-3 leading-tight">
                {title}
              </h2>
            )}

            {/* CTA Button */}
            {ctaLabel && ctaLink && (
              <div className="mt-8">
                <Link
                  href={ctaLink}
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
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
        </div>
      </div>
    </section>
  )
}
