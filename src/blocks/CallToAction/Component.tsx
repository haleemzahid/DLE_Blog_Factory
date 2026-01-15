import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { BasicRichText } from '@/components/RichText/BasicRichText'
import { CMSLink } from '@/components/Link'

// Check if richText has actual content
const hasRichTextContent = (richText: CTABlockProps['richText']): boolean => {
  if (!richText?.root?.children) return false
  return richText.root.children.some((child: any) => {
    if (child.children && child.children.length > 0) {
      return child.children.some((c: any) => c.text && c.text.trim().length > 0)
    }
    return false
  })
}

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  const hasContent = hasRichTextContent(richText)

  // If only links (no rich text content), center the buttons
  if (!hasContent) {
    return (
      <div className="container">
        <div className="flex justify-center py-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} size="lg" {...link} />
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && <BasicRichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
    </div>
  )
}
