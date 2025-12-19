import React from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

import type { AboutSectionBlock as AboutSectionBlockProps } from '@/payload-types'

export const AboutSectionBlock: React.FC<AboutSectionBlockProps> = (props) => {
  const {
    heading,
    headingColor,
    content,
    enableButton,
    link,
    image,
    imagePosition,
    backgroundColor,
  } = props

  const isImageLeft = imagePosition === 'left'

  return (
    <section
      className="py-16 md:py-24"
      style={{ backgroundColor: backgroundColor || '#f3f4f6' }}
    >
      <div className="container">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
            isImageLeft ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Content Side */}
          <div className={`${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
            {/* Heading */}
            {heading && (
              <h2
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color: headingColor || '#dc2626' }}
              >
                {heading}
              </h2>
            )}

            {/* Rich Text Content */}
            {content && (
              <RichText
                className="prose prose-lg max-w-none mb-8 [&_p]:mb-4 [&_p]:text-gray-700 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_li]:mb-2 [&_em]:italic"
                data={content}
                enableGutter={false}
              />
            )}

            {/* Button */}
            {enableButton && link && (
              <CMSLink
                {...link}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
              />
            )}
          </div>

          {/* Image Side */}
          <div className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
            {image && typeof image === 'object' && (
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Media
                  resource={image}
                  imgClassName="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
