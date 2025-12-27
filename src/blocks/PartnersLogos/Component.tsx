'use client'

import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

interface Partner {
  name: string
  logo: MediaType | string
  url?: string | null
  id?: string | null
}

interface PartnersLogosBlockProps {
  eyebrow?: string | null
  title?: string | null
  logos?: Partner[] | null
  style?: 'carousel' | 'grid' | 'inline' | null
  grayscale?: boolean | null
  blockType: 'partnersLogos'
  blockName?: string | null
}

export const PartnersLogosBlock: React.FC<PartnersLogosBlockProps> = ({
  eyebrow,
  title,
  logos,
  style = 'carousel',
  grayscale = true,
}) => {
  if (!logos || logos.length === 0) return null

  const LogoItem = ({ partner }: { partner: Partner }) => {
    const content = (
      <div className="relative h-16 w-32 flex items-center justify-center p-4">
        {partner.logo && typeof partner.logo === 'object' && (
          <Media resource={partner.logo} className="object-contain max-h-full max-w-full" />
        )}
      </div>
    )

    if (partner.url) {
      return (
        <a href={partner.url} target="_blank" rel="noopener noreferrer" title={partner.name}>
          {content}
        </a>
      )
    }

    return content
  }

  return (
    <section className="py-6 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          {eyebrow && (
            <span className="text-red-600 text-lg uppercase tracking-wide">{eyebrow}</span>
          )}
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {title}
            </h2>
          )}
        </div>

        {/* Carousel Style */}
        {style === 'carousel' && (
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll gap-12 py-4">
              {/* Double the logos for infinite scroll effect */}
              {[...logos, ...logos].map((partner, index) => (
                <div key={`${partner.id}-${index}`} className="flex-shrink-0">
                  <LogoItem partner={partner} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid Style */}
        {style === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {logos.map((partner, index) => (
              <LogoItem key={`${partner.id}-${index}`} partner={partner} />
            ))}
          </div>
        )}

        {/* Inline Style */}
        {style === 'inline' && (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((partner, index) => (
              <LogoItem key={`${partner.id}-${index}`} partner={partner} />
            ))}
          </div>
        )}
      </div>

      {/* CSS for infinite scroll animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
