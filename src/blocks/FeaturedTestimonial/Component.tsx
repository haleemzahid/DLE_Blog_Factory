import React from 'react'
import { Media } from '@/components/Media'

import type { FeaturedTestimonialBlock as FeaturedTestimonialBlockProps } from '@/payload-types'

export const FeaturedTestimonialBlock: React.FC<FeaturedTestimonialBlockProps> = (props) => {
  const {
    photo,
    quote,
    clientName,
    nameColor,
    clientTitle,
    photoPosition,
    backgroundColor,
  } = props

  const isPhotoLeft = photoPosition === 'left'

  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: backgroundColor || '#f9fafb' }}
    >
      <div className="container mx-auto px-4">
        <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto ${isPhotoLeft ? '' : 'md:flex-row-reverse'}`}>
          {/* Photo */}
          {photo && typeof photo === 'object' && (
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden shadow-lg">
                <Media
                  resource={photo}
                  imgClassName="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            {/* Quote */}
            {quote && (
              <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                "{quote}"
              </blockquote>
            )}

            {/* Client Name */}
            {clientName && (
              <p
                className="font-bold text-lg mb-1"
                style={{ color: nameColor || '#dc2626' }}
              >
                {clientName}
              </p>
            )}

            {/* Client Title */}
            {clientTitle && (
              <p className="text-gray-600 text-sm">
                {clientTitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
