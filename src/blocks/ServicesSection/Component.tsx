import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

import type { ServicesSectionBlock as ServicesSectionBlockProps } from '@/payload-types'

export const ServicesSectionBlock: React.FC<ServicesSectionBlockProps> = (props) => {
  const {
    eyebrow,
    eyebrowColor,
    title,
    enableButton,
    headerLink,
    buttonStyle,
    services,
    columns,
    backgroundColor,
  } = props

  const buttonClasses = {
    red: 'bg-red-500 hover:bg-red-600 text-white',
    dark: 'bg-gray-900 hover:bg-gray-800 text-white',
    outline: 'bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
  }

  const gridCols = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: backgroundColor || '#ffffff' }}
    >
      {/* Background decorative elements */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-purple-100/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            {eyebrow && (
              <span
                className="text-sm font-semibold tracking-wide uppercase block mb-2"
                style={{ color: eyebrowColor || '#dc2626' }}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                {title}
              </h2>
            )}
          </div>

          {enableButton && headerLink && (
            <div className="mt-4 md:mt-0">
              <CMSLink
                {...headerLink}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-colors ${buttonClasses[buttonStyle || 'red']}`}
              />
            </div>
          )}
        </div>

        {/* Services Grid */}
        {services && services.length > 0 && (
          <div className={`grid grid-cols-1 ${gridCols[columns || '3']} gap-6`}>
            {services.map((service, index) => (
              <div
                key={service.id || index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                {/* Icon */}
                {service.icon && typeof service.icon === 'object' && (
                  <div className="w-12 h-12 mb-4">
                    <Media
                      resource={service.icon}
                      imgClassName="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Title */}
                {service.title && (
                  service.enableLink && service.serviceLink ? (
                    <CMSLink
                      {...service.serviceLink}
                      className="block"
                    >
                      <h3
                        className="text-base font-bold mb-3 hover:underline"
                        style={{ color: service.titleColor || '#dc2626' }}
                      >
                        {service.title}
                      </h3>
                    </CMSLink>
                  ) : (
                    <h3
                      className="text-base font-bold mb-3"
                      style={{ color: service.titleColor || '#dc2626' }}
                    >
                      {service.title}
                    </h3>
                  )
                )}

                {/* Description */}
                {service.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
