import React from 'react'

import type { Page } from '@/payload-types'

import { BasicRichText } from '@/components/RichText/BasicRichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container">
      <div className="max-w-[48rem]">
        {children || (richText && <BasicRichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
