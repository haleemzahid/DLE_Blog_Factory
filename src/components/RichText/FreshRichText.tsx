'use client'

import {
  DefaultNodeTypes,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'

import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/utilities/ui'
import React from 'react'

// Static imports to avoid dynamic loading issues
import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

/**
 * FreshRichText - Ensures no stale state by recreating converters on each render
 */
export function FreshRichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Create converters fresh on every render to avoid stale closures
  const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = React.useMemo(
    () => ({ defaultConverters }) => {
      if (!defaultConverters || typeof defaultConverters !== 'object') {
        return {}
      }

      const converters: any = { ...defaultConverters }

      const baseBlocks =
        defaultConverters.blocks && typeof defaultConverters.blocks === 'object'
          ? { ...defaultConverters.blocks }
          : {}

      converters.blocks = {
        ...baseBlocks,
        banner: ({ node }: any) => {
          if (!node?.fields) {
            return <div className="border border-yellow-500 bg-yellow-50 p-4 rounded my-4">Banner block missing data</div>
          }
          return <BannerBlock {...node.fields} />
        },
        code: ({ node }: any) => {
          if (!node?.fields) {
            return <div className="border border-yellow-500 bg-yellow-50 p-4 rounded my-4">Code block missing data</div>
          }
          return <CodeBlock {...node.fields} blockType="code" />
        },
        mediaBlock: ({ node }: any) => {
          if (!node?.fields) {
            return <div className="border border-yellow-500 bg-yellow-50 p-4 rounded my-4">Media block missing data</div>
          }
          return <MediaBlock {...node.fields} />
        },
      }

      return converters
    },
    [], // Empty deps - create fresh function reference on mount only
  )

  if (!isMounted) {
    return (
      <div
        className={cn(
          'payload-richtext',
          {
            container: enableGutter,
            'max-w-none': !enableGutter,
            'mx-auto prose md:prose-md dark:prose-invert': enableProse,
          },
          className,
        )}
        suppressHydrationWarning
      >
        <div className="animate-pulse bg-gray-100 h-32 rounded" />
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <ConvertRichText
      data={data}
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
