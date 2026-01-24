import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { ArrowRight } from 'lucide-react'

import type { SolutionsSectionBlock as SolutionsSectionBlockProps } from '@/payload-types'

export const SolutionsSectionBlock: React.FC<SolutionsSectionBlockProps> = (props) => {
  const {
    image,
    title,
    solutions,
    enableButton,
    link,
    buttonStyle,
    imagePosition,
  } = props

  const isImageLeft = imagePosition === 'left'

  const buttonClasses = {
    dark: 'bg-gray-900 hover:bg-gray-800 text-white',
    red: 'bg-red-600 hover:bg-black text-white',
    outline: 'bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
  }

  return (
    <section className="py-10 md:py-14 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-cyan-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-blue-100/30 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${isImageLeft ? '' : 'lg:flex-row-reverse'}`}>
          {/* Image Side */}
          <div className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
            {image && typeof image === 'object' && (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <Media
                  resource={image}
                  imgClassName="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className={`${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
            {/* Title */}
            {title && (
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {title}
              </h2>
            )}

            {/* Solutions List */}
            {solutions && solutions.length > 0 && (
              <div className="space-y-3">
                {solutions.map((solution, index) => (
                  <div key={`${solution.id}-${index}`}>
                    <h3 className="text-base font-bold text-gray-900 mb-0.5">
                      {solution.heading}
                    </h3>
                    <p className="text-gray-600 text-sm leading-snug">
                      {solution.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {enableButton && link && (
              <div className="mt-6">
                <CMSLink
                  {...link}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${buttonClasses[buttonStyle || 'dark']}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </CMSLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
