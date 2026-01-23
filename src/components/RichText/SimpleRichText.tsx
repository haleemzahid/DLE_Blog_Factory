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

// Filter out undefined/null values from objects
const filterUndefined = (obj: any): any => {
  if (obj === null || obj === undefined) return undefined
  if (typeof obj === 'function') return obj
  if (typeof obj !== 'object') return obj
  if (React.isValidElement(obj)) return obj
  if (Array.isArray(obj)) return obj

  const filtered: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) {
      console.log(`Filtering out undefined/null key: ${key}`)
      continue
    }
    if (typeof value === 'function') {
      filtered[key] = value
    } else if (typeof value === 'object' && value !== null && !React.isValidElement(value) && !Array.isArray(value)) {
      const filteredValue = filterUndefined(value)
      if (filteredValue !== undefined) {
        filtered[key] = filteredValue
      }
    } else {
      filtered[key] = value
    }
  }
  return filtered
}

// Create converters with statically imported components
const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => {
  console.log('=== Creating converters ===')
  console.log('defaultConverters:', defaultConverters)

  if (!defaultConverters || typeof defaultConverters !== 'object') {
    console.error('⚠️ defaultConverters is invalid:', defaultConverters)
    return {}
  }

  // Filter out any undefined values from defaultConverters
  const filteredDefaults = filterUndefined(defaultConverters)
  console.log('Filtered defaultConverters:', filteredDefaults)

  const converters: any = { ...filteredDefaults }

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
        const element = React.createElement(BannerBlock, node.fields)
        if (!element) {
          console.error('BannerBlock createElement returned undefined')
          return React.createElement(BlockLoadError, { blockType: 'BannerBlock' })
        }
        return element
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
        const element = React.createElement(CodeBlock, { ...node.fields, blockType: 'code' })
        if (!element) {
          console.error('CodeBlock createElement returned undefined')
          return React.createElement(BlockLoadError, { blockType: 'CodeBlock' })
        }
        return element
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
        const element = React.createElement(MediaBlock, node.fields)
        if (!element) {
          console.error('MediaBlock createElement returned undefined')
          return React.createElement(BlockLoadError, { blockType: 'MediaBlock' })
        }
        return element
      } catch (error) {
        console.error('Error rendering MediaBlock:', error)
        return React.createElement(BlockLoadError, { blockType: 'MediaBlock' })
      }
    },
  }

  // Deep validation to find any undefined values
  const validateConverters = (obj: any, path = 'converters'): boolean => {
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined || value === null) {
        console.error(`❌ FOUND UNDEFINED/NULL at ${path}.${key}`)
        return false
      }
      if (typeof value === 'object' && !React.isValidElement(value) && typeof value !== 'function') {
        if (!validateConverters(value, `${path}.${key}`)) {
          return false
        }
      }
    }
    return true
  }

  validateConverters(converters)
  console.log('✅ Converters validated:', converters)

  // Final filter to ensure no undefined values slip through
  const finalConverters = filterUndefined(converters)
  console.log('✅ Final filtered converters:', finalConverters)

  return finalConverters
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

  // Wrap in try-catch as final safety net
  try {
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
  } catch (error) {
    console.error('❌ Error rendering ConvertRichText:', error)
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
      >
        <div className="border border-red-500 bg-red-50 p-6 rounded">
          <h3 className="text-red-800 font-bold mb-2">Content Rendering Error</h3>
          <p className="text-red-700 mb-2">
            There was an error rendering this content. Please try refreshing the page.
          </p>
          <details className="text-sm text-red-600">
            <summary>Error details</summary>
            <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        </div>
      </div>
    )
  }
}

export default SimpleRichText
export { SimpleRichText }
