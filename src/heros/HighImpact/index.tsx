'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText, logo }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      {/* Background Image */}
      <div className="absolute inset-0 min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="object-cover" priority resource={media} />
        )}
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container z-10 relative flex items-center justify-center min-h-[80vh] py-20">
        <div className="max-w-[53rem] text-center">
          {richText && (
            <RichText
              className="mb-6 [&_p]:text-lg [&_p]:text-white/90 [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl [&_h1]:font-bold [&_h1]:uppercase [&_h1]:tracking-wide [&_h1]:leading-tight [&_h1]:mb-6 [&_h1]:drop-shadow-lg"
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
                className="max-w-[220px] h-auto"
                imgClassName="object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
