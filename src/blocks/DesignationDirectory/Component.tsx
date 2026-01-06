'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import type { DesignationDirectoryBlock as DesignationDirectoryBlockProps } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const DesignationDirectoryBlock: React.FC<DesignationDirectoryBlockProps> = (props) => {
  const {
    title,
    subtitle,
    headerBackgroundColor,
    videoUrl,
    showVideo,
    state,
    mrDesignations,
    msDesignations,
    showMapBackground,
    mapBackgroundImage,
    showCTA,
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonLink,
    ctaSecondaryText,
    ctaSecondaryLink,
  } = props

  // Get state name if state is selected
  const stateName = typeof state === 'object' && state !== null ? state.name : null
  const stateSlug = typeof state === 'object' && state !== null ? state.slug : null

  // Get background image URL
  const bgImageUrl =
    typeof mapBackgroundImage === 'object' && mapBackgroundImage !== null
      ? getMediaUrl(mapBackgroundImage.url || '')
      : '/map-background.png'

  return (
    <div>
      {/* Hero Section - Blue Header */}
      <section
        className="text-white py-8"
        style={{ backgroundColor: headerBackgroundColor || '#2B7CB3' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {stateName ? `${stateName} ${title}` : title}
          </h1>
          {subtitle && <p className="text-lg text-blue-100">{subtitle}</p>}
        </div>
      </section>

      {/* Video Section */}
      {showVideo && videoUrl && (
        <section
          className="pb-8"
          style={{ backgroundColor: headerBackgroundColor || '#2B7CB3' }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-900">
                <iframe
                  src={videoUrl}
                  title="DLE Network Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Designation Directory Section - Two Columns */}
      <section
        className="py-12 relative"
        style={
          showMapBackground
            ? {
                backgroundImage: `url('${bgImageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }
            : {}
        }
      >
        {/* Overlay for better readability */}
        {showMapBackground && <div className="absolute inset-0 bg-white/90" />}

        <div className="container mx-auto px-4 relative z-10">
          {/* Two Column Layout for Mr. and Ms. Designations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mr. Designations Column */}
            <div>
              <ul className="space-y-2">
                {mrDesignations && mrDesignations.length > 0 ? (
                  mrDesignations.map((designation, index) => (
                    <li key={`mr-${index}`}>
                      <Link
                        href={designation.link || '#'}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                      >
                        <span className="text-blue-500">●</span>
                        <span>{designation.title}</span>
                      </Link>
                    </li>
                  ))
                ) : stateSlug ? (
                  <li>
                    <Link
                      href={`/designations/mr-${stateSlug}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                    >
                      <span className="text-blue-500">●</span>
                      <span>Mr. {stateName} ™</span>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>

            {/* Ms. Designations Column */}
            <div>
              <ul className="space-y-2">
                {msDesignations && msDesignations.length > 0 ? (
                  msDesignations.map((designation, index) => (
                    <li key={`ms-${index}`}>
                      <Link
                        href={designation.link || '#'}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                      >
                        <span className="text-blue-500">●</span>
                        <span>{designation.title}</span>
                      </Link>
                    </li>
                  ))
                ) : stateSlug ? (
                  <li>
                    <Link
                      href={`/designations/ms-${stateSlug}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                    >
                      <span className="text-blue-500">●</span>
                      <span>Ms. {stateName} ™</span>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {showCTA && (
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {stateName ? `${ctaTitle} in ${stateName}` : ctaTitle}
            </h2>
            {ctaDescription && (
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{ctaDescription}</p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              {ctaButtonText && ctaButtonLink && (
                <Link
                  href={ctaButtonLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  {ctaButtonText}
                </Link>
              )}
              {ctaSecondaryText && ctaSecondaryLink && (
                <Link
                  href={ctaSecondaryLink}
                  className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-8 rounded-lg border border-gray-300 transition-colors"
                >
                  {ctaSecondaryText}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
