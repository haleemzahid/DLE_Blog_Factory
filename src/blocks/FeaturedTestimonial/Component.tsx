'use client'

import React, { useState } from 'react'
import { Media } from '@/components/Media'

import type { FeaturedTestimonialBlock as FeaturedTestimonialBlockProps } from '@/payload-types'

export const FeaturedTestimonialBlock: React.FC<FeaturedTestimonialBlockProps> = (props) => {
  const { eyebrow, eyebrowColor, title, testimonials, nameColor, photoPosition, backgroundColor } =
    props

  const [currentIndex, setCurrentIndex] = useState(0)

  const isPhotoLeft = photoPosition === 'left'

  const goToPrevious = () => {
    if (testimonials && testimonials.length > 0) {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
    }
  }

  const goToNext = () => {
    if (testimonials && testimonials.length > 0) {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }
  }

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section
      className="py-6 relative overflow-hidden"
      style={{ backgroundColor: backgroundColor || '#ffffff' }}
    >
      {/* Background decorative element */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-bl from-gray-100/50 to-transparent -z-10" />

      <div className="container mx-auto px-4">
        {/* One row layout: Title on left, Testimonial on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-center">
          {/* Left Side - Title */}
          <div className="text-center lg:text-left">
            {eyebrow && (
              <span
                className="text-sm font-semibold tracking-wide block mb-2"
                style={{ color: eyebrowColor || '#dc2626' }}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{title}</h2>
            )}
          </div>

          {/* Right Side - Testimonial Content with Navigation */}
          <div className="flex items-center gap-4">
            {/* Left Navigation Button */}
            {testimonials.length > 1 && (
              <button
                type="button"
                onClick={goToPrevious}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 bg-white transition-colors"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Testimonial Card */}
            <div
              className={`flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start ${isPhotoLeft ? '' : 'md:flex-row-reverse'}`}
            >
              {/* Photo */}
              {currentTestimonial?.photo && typeof currentTestimonial.photo === 'object' && (
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg overflow-hidden shadow-lg">
                    <Media
                      resource={currentTestimonial.photo}
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="text-center md:text-left flex-1">
                {/* Quote */}
                {currentTestimonial?.quote && (
                  <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                    &ldquo;{currentTestimonial.quote}&rdquo;
                  </blockquote>
                )}

                {/* Client Name */}
                {currentTestimonial?.clientName && (
                  <p className="font-bold text-lg mb-1" style={{ color: nameColor || '#dc2626' }}>
                    {currentTestimonial.clientName}
                  </p>
                )}

                {/* Client Title */}
                {currentTestimonial?.clientTitle && (
                  <p className="text-gray-600 text-sm">{currentTestimonial.clientTitle}</p>
                )}

                {/* Dots indicator */}
                {testimonials.length > 1 && (
                  <div className="flex gap-2 mt-6 justify-center md:justify-start">
                    {testimonials.map((_, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Navigation Button */}
            {testimonials.length > 1 && (
              <button
                type="button"
                onClick={goToNext}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 bg-white transition-colors"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
