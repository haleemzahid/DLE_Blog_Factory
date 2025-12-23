import React from 'react'
import type { ServicesGridBlock as ServicesGridBlockType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from 'next/link'

type Props = ServicesGridBlockType & {
  id?: string
}

export const ServicesGridBlock: React.FC<Props> = ({
  title,
  subtitle,
  services,
  layout = 'twoColumn',
  showIcons = true,
  cardBorderRadius = 8,
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            {subtitle}
          </p>
        )}

        <div className={`grid ${getGridCols()} gap-8`}>
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className={`
                ${layout === 'alternating' && index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow
              `}
              style={{ borderRadius: `${cardBorderRadius}px` }}
            >
              {showIcons && service.icon && typeof service.icon === 'object' && (
                <div className="w-16 h-16 mb-6">
                  <Media resource={service.icon} className="w-full h-full object-contain" />
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>

              {service.description && (
                <div className="text-gray-600 mb-4">
                  <RichText data={service.description} />
                </div>
              )}

              {service.link?.type !== 'none' && service.link?.label && (
                <div className="mt-4">
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
