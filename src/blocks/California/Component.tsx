'use client'

import React from 'react'
import Link from 'next/link'

import type { CaliforniaBlock as CaliforniaBlockProps } from '@/payload-types'

export const CaliforniaBlock: React.FC<CaliforniaBlockProps> = (props) => {
  const { title, mrDesignations, msDesignations } = props

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          {title || 'California'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {/* Mr. California Cities Column */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">
              Mr. California Cities
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {mrDesignations && mrDesignations.length > 0 ? (
                mrDesignations.map((designation, index) => (
                  <Link
                    key={`mr-${index}`}
                    href={designation.link || '#'}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    <span className="text-blue-600">▶</span>
                    {designation.title}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 col-span-2">No Mr. designations added yet.</p>
              )}
            </div>
          </div>

          {/* Ms. California Cities Column */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">
              Ms. California Cities
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {msDesignations && msDesignations.length > 0 ? (
                msDesignations.map((designation, index) => (
                  <Link
                    key={`ms-${index}`}
                    href={designation.link || '#'}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    <span className="text-blue-600">▶</span>
                    {designation.title}
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 col-span-2">No Ms. designations added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
