'use client'

import React from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import { cn } from '@/utilities/ui'

// Import blocks for rendering
import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

type PostContentDisplayProps = {
  content: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  className?: string
}

/**
 * PostContentDisplay - Simplified component for rendering blog post content
 *
 * This component uses a straightforward approach to render content:
 * 1. Uses PayloadCMS default converters as the base
 * 2. Only adds custom block converters (no complex processing)
 * 3. No filtering or wrapping of converters
 * 4. Direct, simple spread pattern
 */
export function PostContentDisplay({
  content,
  enableGutter = true,
  enableProse = true,
  className,
}: PostContentDisplayProps) {
  // Safety check
  if (!content) {
    console.warn('PostContentDisplay: No content provided')
    return null
  }

  // Simple converter function - uses same pattern as RichText/index.tsx
  const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = React.useMemo(
    () =>
      ({ defaultConverters }) => ({
        ...defaultConverters,
        blocks: {
          ...defaultConverters?.blocks,
          banner: ({ node }: any) => {
            if (!node?.fields) return null
            return <BannerBlock {...node.fields} />
          },
          code: ({ node }: any) => {
            if (!node?.fields) return null
            return <CodeBlock {...node.fields} blockType="code" />
          },
          mediaBlock: ({ node }: any) => {
            if (!node?.fields) return null
            return <MediaBlock {...node.fields} />
          },
        },
      }),
    [],
  )

  return (
    <div
      className={cn(
        'post-content-display',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
        },
        className,
      )}
    >
      <ConvertRichText
        data={content}
        converters={jsxConverters}
        className={cn('payload-richtext', {
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        })}
      />
    </div>
  )
}

export default PostContentDisplay
