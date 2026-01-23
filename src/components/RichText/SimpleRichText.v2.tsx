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

// Static imports to avoid dynamic loading issues on Vercel
import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

// Error Boundary to catch rendering errors
class RichTextErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RichText Error Boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border border-red-500 bg-red-50 p-6 rounded my-4">
          <h3 className="text-red-800 font-bold mb-2">Content Rendering Error</h3>
          <p className="text-red-700 mb-2">
            There was an error rendering this content. Please try refreshing the page.
          </p>
          {this.state.error && (
            <details className="text-sm text-red-600">
              <summary>Error details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// Fallback component for when block rendering fails
const BlockLoadError: React.FC<{ blockType: string }> = ({ blockType }) => {
  return (
    <div className="border border-red-500 bg-red-50 p-4 rounded my-4">
      <strong>Error: </strong>
      {blockType} component failed to render. Please refresh the page.
    </div>
  )
}

// Create converters with statically imported components
const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => {
  console.log('=== Creating converters ===')

  if (!defaultConverters || typeof defaultConverters !== 'object') {
    console.error('⚠️ defaultConverters is invalid:', defaultConverters)
    return {}
  }

  const converters: any = { ...defaultConverters }

  const baseBlocks = (defaultConverters.blocks && typeof defaultConverters.blocks === 'object')
    ? { ...defaultConverters.blocks }
    : {}

  converters.blocks = {
    ...baseBlocks,
    banner: ({ node }: any) => {
      if (!node?.fields) {
        console.warn('Banner block has no fields')
        return React.createElement(BlockLoadError, { blockType: 'Banner' })
      }

      try {
        return React.createElement(BannerBlock, node.fields)
      } catch (error) {
        console.error('Error rendering BannerBlock:', error)
        return React.createElement(BlockLoadError, { blockType: 'BannerBlock' })
      }
    },
    code: ({ node }: any) => {
      if (!node?.fields) {
        console.warn('Code block has no fields')
        return React.createElement(BlockLoadError, { blockType: 'Code' })
      }

      try {
        return React.createElement(CodeBlock, { ...node.fields, blockType: 'code' })
      } catch (error) {
        console.error('Error rendering CodeBlock:', error)
        return React.createElement(BlockLoadError, { blockType: 'CodeBlock' })
      }
    },
    mediaBlock: ({ node }: any) => {
      if (!node?.fields) {
        console.warn('MediaBlock has no fields')
        return React.createElement(BlockLoadError, { blockType: 'MediaBlock' })
      }

      try {
        return React.createElement(MediaBlock, node.fields)
      } catch (error) {
        console.error('Error rendering MediaBlock:', error)
        return React.createElement(BlockLoadError, { blockType: 'MediaBlock' })
      }
    },
  }

  return converters
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

/**
 * SimpleRichText V2 - Static imports for better Vercel compatibility
 */
function SimpleRichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props
  const [isMounted, setIsMounted] = React.useState(false)

  // Ensure component is mounted (prevents SSR/hydration issues)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Create a stable key based on content
  const contentKey = React.useMemo(() => {
    return JSON.stringify(data?.root?.children?.slice(0, 3) || [])
  }, [data])

  // Show placeholder during SSR or before mounted
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
    console.error('SimpleRichText: No data provided')
    return null
  }

  return (
    <RichTextErrorBoundary>
      <ConvertRichText
        key={contentKey}
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
    </RichTextErrorBoundary>
  )
}

export default SimpleRichText
export { SimpleRichText }
