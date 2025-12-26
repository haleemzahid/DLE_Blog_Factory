import React from 'react'
import type { TestimonialsBlock as TestimonialsBlockType, Testimonial } from '@/payload-types'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Props = TestimonialsBlockType & {
  id?: string
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const TestimonialCard: React.FC<{
  testimonial: Testimonial
  showRatings?: boolean
  showPhotos?: boolean
  showSource?: boolean
}> = ({ testimonial, showRatings = true, showPhotos = true, showSource = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        {showPhotos && testimonial.clientPhoto && typeof testimonial.clientPhoto === 'object' && (
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Media resource={testimonial.clientPhoto} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{testimonial.clientName}</h4>
          {testimonial.isLocalGuide && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Local Guide
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </div>
      </div>

      {showRatings && testimonial.rating && (
        <div className="mb-3">
          <StarRating rating={testimonial.rating} />
        </div>
      )}

      <p className="text-gray-600 flex-1 text-sm leading-relaxed">{testimonial.review}</p>

      {showSource && testimonial.source && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 capitalize">via {testimonial.source}</span>
        </div>
      )}
    </div>
  )
}

export const TestimonialsBlockComponent: React.FC<Props> = async ({
  title,
  subtitle,
  agent,
  testimonials: manualTestimonials,
  limit = 6,
  layout = 'grid',
  showRatings = true,
  showPhotos = true,
  showSource = true,
}) => {
  const payload = await getPayload({ config: configPromise })

  let testimonials: Testimonial[] = []

  if (manualTestimonials && manualTestimonials.length > 0) {
    // Use manually selected testimonials
    testimonials = manualTestimonials.filter((t): t is Testimonial => typeof t === 'object')
  } else if (agent) {
    // Fetch testimonials for specific agent
    const agentId = typeof agent === 'object' ? agent.id : agent
    const result = await payload.find({
      collection: 'testimonials',
      where: {
        agent: { equals: agentId },
        approved: { equals: true },
      },
      limit: limit || 6,
      sort: '-featured,-rating',
    })
    testimonials = result.docs
  } else {
    // Fetch featured testimonials
    const result = await payload.find({
      collection: 'testimonials',
      where: {
        featured: { equals: true },
        approved: { equals: true },
      },
      limit: limit || 6,
    })
    testimonials = result.docs
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {subtitle && (
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">
              {subtitle}
            </span>
          )}
          {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{title}</h2>}
        </div>

        <div
          className={`
          ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
          ${layout === 'list' ? 'space-y-6 max-w-3xl mx-auto' : ''}
          ${layout === 'carousel' ? 'flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4' : ''}
        `}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className={layout === 'carousel' ? 'min-w-[300px] md:min-w-[400px] snap-center' : ''}
            >
              <TestimonialCard
                testimonial={testimonial}
                showRatings={showRatings ?? true}
                showPhotos={showPhotos ?? true}
                showSource={showSource ?? true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
