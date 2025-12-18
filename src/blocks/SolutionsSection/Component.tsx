import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

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
    red: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
  }

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-cyan-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-blue-100/30 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isImageLeft ? '' : 'lg:flex-row-reverse'}`}>
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
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                {title}
              </h2>
            )}

            {/* Solutions List */}
            {solutions && solutions.length > 0 && (
              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={solution.id || index}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {solution.heading}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {enableButton && link && (
              <div className="mt-10">
                <CMSLink
                  {...link}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-colors ${buttonClasses[buttonStyle || 'dark']}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
