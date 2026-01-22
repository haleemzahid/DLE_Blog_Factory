'use client'

import {
  DefaultNodeTypes,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'

import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/utilities/ui'
import React from 'react'

// Import block components
import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

// Debug: Check if components are loaded
console.log('=== SimpleRichText Module Loading ===')
console.log('BannerBlock:', BannerBlock, typeof BannerBlock)
console.log('CodeBlock:', CodeBlock, typeof CodeBlock)
console.log('MediaBlock:', MediaBlock, typeof MediaBlock)
console.log('ConvertRichText:', ConvertRichText, typeof ConvertRichText)
console.log('=====================================')

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => {
  console.log('=== jsxConverters called ===')
  console.log('defaultConverters keys:', Object.keys(defaultConverters))
  console.log('defaultConverters:', defaultConverters)
  console.log('defaultConverters.blocks:', defaultConverters.blocks)

  const linkConverter = LinkJSXConverter({ internalDocToHref })
  console.log('linkConverter:', linkConverter)
  console.log('linkConverter keys:', Object.keys(linkConverter))

  // Ensure blocks object exists, even if defaultConverters.blocks is undefined
  const baseBlocks = (defaultConverters.blocks && typeof defaultConverters.blocks === 'object')
    ? defaultConverters.blocks
    : {}

  const converters = {
    ...defaultConverters,
    ...linkConverter,
    blocks: {
      ...baseBlocks,
      banner: ({ node }: any) => {
        console.log('🎨 Rendering banner block:', node)
        if (!node?.fields) {
          console.warn('Banner block has no fields')
          return <div>Banner block error: no fields</div>
        }
        console.log('Banner block fields:', node.fields)
        console.log('BannerBlock component:', BannerBlock)
        if (!BannerBlock) {
          console.error('BannerBlock component is undefined!')
          return <div>BannerBlock component not loaded</div>
        }
        return <BannerBlock {...node.fields} />
      },
      code: ({ node }: any) => {
        console.log('💻 Rendering code block:', node)
        if (!node?.fields) {
          console.warn('Code block has no fields')
          return <div>Code block error: no fields</div>
        }
        console.log('Code block fields:', node.fields)
        console.log('CodeBlock component:', CodeBlock)
        if (!CodeBlock) {
          console.error('CodeBlock component is undefined!')
          return <div>CodeBlock component not loaded</div>
        }
        return <CodeBlock {...node.fields} blockType="code" />
      },
      mediaBlock: ({ node }: any) => {
        console.log('🖼️ Rendering mediaBlock:', node)
        if (!node?.fields) {
          console.warn('MediaBlock has no fields')
          return <div>MediaBlock error: no fields</div>
        }
        console.log('MediaBlock fields:', node.fields)
        console.log('MediaBlock component:', MediaBlock)
        if (!MediaBlock) {
          console.error('MediaBlock component is undefined!')
          return <div>MediaBlock component not loaded</div>
        }
        return <MediaBlock {...node.fields} />
      },
    },
  }

  console.log('Final converters keys:', Object.keys(converters))
  console.log('Final converters.blocks:', converters.blocks)
  console.log('========================')

  return converters
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

/**
 * SimpleRichText - A lightweight RichText component
 */
function SimpleRichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props

  if (!data) {
    console.error('SimpleRichText: No data provided')
    return null
  }

  console.log('SimpleRichText rendering with data:', data)

  // Log all children types
  if (data?.root?.children) {
    console.log('Content children types:', data.root.children.map((child: any) => ({
      type: child.type,
      hasFields: !!child.fields,
      blockType: child.fields?.blockType,
    })))
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

export default SimpleRichText
export { SimpleRichText }
