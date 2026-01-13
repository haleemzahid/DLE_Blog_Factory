'use client'

import React from 'react'
import Link from 'next/link'

import type { CaliforniaBlock as CaliforniaBlockProps } from '@/payload-types'

const CircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
  >
    <circle cx="8" cy="8" r="7" stroke="#1e3a8a" strokeWidth="2" fill="none" />
    <path d="M6 5L11 8L6 11V5Z" fill="#1e3a8a" />
  </svg>
)

export const CaliforniaBlock: React.FC<CaliforniaBlockProps> = (props) => {
  const { title, mrDesignations, msDesignations } = props

  return (
    <section
      className="py-16 relative"
      style={{
        backgroundImage: 'url(/california-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          {title || 'California'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {/* Mr. California Cities Column */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-400 pb-2">
              Mr. California Cities
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {mrDesignations && mrDesignations.length > 0 ? (
                mrDesignations.map((designation, index) => (
                  <Link
                    key={`mr-${index}`}
                    href={designation.link}
                    className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors py-1 text-sm"
                  >
                    <CircleIcon />
                    {designation.title}
                  </Link>
                ))
              ) : (
                <p className="text-white/70 col-span-2">No Mr. designations added yet.</p>
              )}
            </div>
          </div>

          {/* Ms. California Cities Column */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-400 pb-2">
              Ms. California Cities
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {msDesignations && msDesignations.length > 0 ? (
                msDesignations.map((designation, index) => (
                  <Link
                    key={`ms-${index}`}
                    href={designation.link}
                    className="flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors py-1 text-sm"
                  >
                    <CircleIcon />
                    {designation.title}
                  </Link>
                ))
              ) : (
                <p className="text-white/70 col-span-2">No Ms. designations added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
