import React from 'react'
import type { ServicesGridBlock as ServicesGridBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { CMSLink } from '@/components/Link'

type Props = ServicesGridBlockType & {
  id?: string
}

export const ServicesGridBlock: React.FC<Props> = ({
  title,
  subtitle,
  enableButton,
  headerLink,
  buttonStyle = 'red',
  services,
  layout = 'twoColumn',
  showIcons = true,
  cardBorderRadius = 16,
}) => {
  if (!services || services.length === 0) {
    return null
  }

  const getGridCols = () => {
    switch (layout) {
      case 'twoColumn':
        return 'grid-cols-1 md:grid-cols-2'
      case 'threeColumn':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 'fourColumn':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 'alternating':
        return 'grid-cols-1 md:grid-cols-2'
      default:
        return 'grid-cols-1 md:grid-cols-2'
    }
  }

  const buttonClasses: Record<string, string> = {
    red: 'bg-red-600 hover:bg-black text-white',
    dark: 'bg-gray-900 hover:bg-gray-800 text-white',
    outline: 'bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
  }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 mt-1 max-w-2xl text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {enableButton && headerLink && (
            <div className="mt-3 md:mt-0">
              <CMSLink
                {...headerLink}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-colors ${buttonClasses[buttonStyle || 'red']}`}
              />
            </div>
          )}
        </div>

        <div className={`grid ${getGridCols()} gap-5`}>
          {services.map((service, index) => (
            <div
              key={`${service.id}-${index}`}
              className={`
                ${layout === 'alternating' && index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow
              `}
              style={{ borderRadius: `${cardBorderRadius}px` }}
            >
              {showIcons && service.icon && typeof service.icon === 'object' && (
                <div className="w-12 h-12 mb-3">
                  <Media resource={service.icon} className="w-full h-full object-contain" />
                </div>
              )}

              <h3 className="text-base font-bold text-gray-900 mb-2">{service.title}</h3>

              {service.description && (
                <div className="text-gray-600 text-sm leading-snug [&_p]:mb-1 [&_p]:leading-snug">
                  <RichText data={service.description} />
                </div>
              )}

              {service.link?.type !== 'none' && service.link?.label && (
                <div className="mt-3">
                  {service.link.type === 'external' && service.link.url ? (
                    <a
                      href={service.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-2"
                    >
                      {service.link.label}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  ) : service.link.type === 'internal' && service.link.page ? (
                    <Link
                      href={
                        typeof service.link.page === 'object' ? `/${service.link.page.slug}` : '#'
                      }
                      className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-2"
                    >
                      {service.link.label}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
