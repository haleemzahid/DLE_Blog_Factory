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
        {/* Header with title and navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
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

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button
                onClick={goToPrevious}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
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
              <button
                onClick={goToNext}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
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
            </div>
          )}
        </div>

        {/* Testimonial Content */}
        <div
          className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${isPhotoLeft ? '' : 'md:flex-row-reverse'}`}
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
          <div className="flex-1 text-center md:text-left">
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
          </div>
        </div>

        {/* Dots indicator */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
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
    </section>
  )
}
