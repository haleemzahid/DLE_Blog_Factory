'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { SimpleRichText } from '@/components/RichText/SimpleRichText'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  logo,
  headingColor,
  subtitleColor,
  paragraphColor,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  // Use hex color values directly from the color picker
  const headingColorValue = headingColor || '#ffffff'
  const subtitleColorValue = subtitleColor || '#e8b44a'
  const paragraphColorValue = paragraphColor || '#ffffff'

  // Create dynamic styles for different text elements
  const richTextStyles = `
    mb-6
    [&_p:first-child]:text-sm [&_p:first-child]:md:text-base [&_p:first-child]:tracking-widest [&_p:first-child]:uppercase [&_p:first-child]:mb-4
    [&_p]:text-lg [&_p]:md:text-xl [&_p]:mb-4
    [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:lg:text-5xl [&_h1]:font-bold [&_h1]:uppercase [&_h1]:tracking-wide [&_h1]:leading-tight [&_h1]:mb-6 [&_h1]:drop-shadow-lg
    [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:mb-4
  `

  return (
    <div
      className="relative flex items-center justify-center text-white"
      data-theme="dark"
    >
      {/* Background Image */}
      <div className="absolute inset-0 min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="object-cover" priority resource={media} size="100vw" />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container z-10 relative flex items-center justify-center min-h-[80vh] py-20">
        <div className="max-w-[53rem] text-center">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .hero-rich-text h1, .hero-rich-text h2 { color: ${headingColorValue}; }
                .hero-rich-text p:first-child { color: ${subtitleColorValue}; }
                .hero-rich-text p:not(:first-child) { color: ${paragraphColorValue}; }
              `,
            }}
          />
          {richText && (
            <SimpleRichText
              className={`hero-rich-text ${richTextStyles}`}
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex justify-center gap-4 mb-8">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
          {/* Hero Logo */}
          {logo && typeof logo === 'object' && (
            <div className="mt-8 flex justify-center">
              <Media
                resource={logo}
                className="max-w-[320px] h-auto"
                imgClassName="object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
