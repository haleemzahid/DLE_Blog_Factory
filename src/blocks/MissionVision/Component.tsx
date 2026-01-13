import React from 'react'
import { SimpleRichText } from '@/components/RichText/SimpleRichText'
import { CMSLink } from '@/components/Link'

import type { MissionVisionBlock as MissionVisionBlockProps } from '@/payload-types'

const icons = {
  // Mission icons
  target: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  ),
  rocket: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  star: (color: string) => (
    <svg className="w-8 h-8" fill={color} viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  flag: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  ),
  compass: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polygon fill={color} points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  lightning: (color: string) => (
    <svg className="w-8 h-8" fill={color} viewBox="0 0 24 24">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  // Vision icons
  eye: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  lightbulb: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  globe: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  mountain: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20l5-10 4 6 3-4 4 8H4z" />
    </svg>
  ),
  sparkle: (color: string) => (
    <svg className="w-8 h-8" fill={color} viewBox="0 0 24 24">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
    </svg>
  ),
  sun: (color: string) => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
}

type IconKey = keyof typeof icons

export const MissionVisionBlock: React.FC<MissionVisionBlockProps> = (props) => {
  const { layout, backgroundColor, mission, vision, enableCta, ctaLink, ctaButtonColor, ctaTextColor } = props

  const renderIcon = (iconName: string | null | undefined, color: string) => {
    if (!iconName) return null
    const iconFn = icons[iconName as IconKey]
    return iconFn ? iconFn(color) : null
  }

  const renderCtaButton = () => {
    if (!enableCta || !ctaLink) return null

    const bgColor = ctaButtonColor || '#dc2626'
    const textColor = ctaTextColor || '#ffffff'

    return (
      <div className="flex justify-center pt-8 mt-8">
        <a
          href={
            ctaLink.type === 'reference' && ctaLink.reference?.value
              ? typeof ctaLink.reference.value === 'object'
                ? `/${ctaLink.reference.value.slug}`
                : ctaLink.url || '#'
              : ctaLink.url || '#'
          }
          target={ctaLink.newTab ? '_blank' : undefined}
          rel={ctaLink.newTab ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center justify-center rounded px-8 h-11 font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: bgColor,
            color: textColor,
            borderColor: bgColor,
          }}
        >
          {ctaLink.label}
        </a>
      </div>
    )
  }

  if (layout === 'cards') {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-gray-50">
                  {renderIcon(mission?.icon, mission?.iconColor || '#dc2626')}
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: mission?.titleColor || '#111827' }}
                >
                  {mission?.title}
                </h3>
              </div>
              {mission?.content && (
                <SimpleRichText
                  className="prose prose-gray max-w-none [&_p]:text-gray-600 [&_p]:leading-relaxed"
                  data={mission.content}
                  enableGutter={false}
                />
              )}
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-gray-50">
                  {renderIcon(vision?.icon, vision?.iconColor || '#dc2626')}
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: vision?.titleColor || '#111827' }}
                >
                  {vision?.title}
                </h3>
              </div>
              {vision?.content && (
                <SimpleRichText
                  className="prose prose-gray max-w-none [&_p]:text-gray-600 [&_p]:leading-relaxed"
                  data={vision.content}
                  enableGutter={false}
                />
              )}
            </div>
          </div>
          {renderCtaButton()}
        </div>
      </section>
    )
  }

  if (layout === 'stacked') {
    return (
      <section className="py-16 md:py-24" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Mission */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-red-50">
                {renderIcon(mission?.icon, mission?.iconColor || '#dc2626')}
              </div>
              <h3
                className="text-3xl font-bold"
                style={{ color: mission?.titleColor || '#111827' }}
              >
                {mission?.title}
              </h3>
            </div>
            {mission?.content && (
              <SimpleRichText
                className="prose prose-lg max-w-none [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:text-lg"
                data={mission.content}
                enableGutter={false}
              />
            )}
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-red-600 mx-auto mb-16" />

          {/* Vision */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-red-50">
                {renderIcon(vision?.icon, vision?.iconColor || '#dc2626')}
              </div>
              <h3
                className="text-3xl font-bold"
                style={{ color: vision?.titleColor || '#111827' }}
              >
                {vision?.title}
              </h3>
            </div>
            {vision?.content && (
              <SimpleRichText
                className="prose prose-lg max-w-none [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:text-lg"
                data={vision.content}
                enableGutter={false}
              />
            )}
          </div>
          {renderCtaButton()}
        </div>
      </section>
    )
  }

  // Default: Side by Side
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Mission */}
          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-50 flex-shrink-0">
                {renderIcon(mission?.icon, mission?.iconColor || '#dc2626')}
              </div>
              <div>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ color: mission?.titleColor || '#111827' }}
                >
                  {mission?.title}
                </h3>
                {mission?.content && (
                  <SimpleRichText
                    className="prose max-w-none [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:text-base md:[&_p]:text-lg"
                    data={mission.content}
                    enableGutter={false}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="relative lg:border-l lg:border-gray-200 lg:pl-12">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-50 flex-shrink-0">
                {renderIcon(vision?.icon, vision?.iconColor || '#dc2626')}
              </div>
              <div>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-4"
                  style={{ color: vision?.titleColor || '#111827' }}
                >
                  {vision?.title}
                </h3>
                {vision?.content && (
                  <SimpleRichText
                    className="prose max-w-none [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:text-base md:[&_p]:text-lg"
                    data={vision.content}
                    enableGutter={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {renderCtaButton()}
      </div>
    </section>
  )
}
