'use client'

import {
  DefaultNodeTypes,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'

import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/utilities/ui'
import React from 'react'

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

// Store block components as they load
// Reset on each module evaluation to avoid stale references during create/delete cycles
const blockComponents: {
  BannerBlock?: any
  CodeBlock?: any
  MediaBlock?: any
} = {
  BannerBlock: undefined,
  CodeBlock: undefined,
  MediaBlock: undefined,
}


// Fallback component for when block components fail to load
const BlockLoadError: React.FC<{ blockType: string }> = ({ blockType }) => {
  return React.createElement(
    'div',
    { className: 'border border-red-500 bg-red-50 p-4 rounded my-4' },
    React.createElement('strong', null, 'Error: '),
    `${blockType} component failed to load. Please refresh the page.`,
  )
}

// Safety wrapper to ensure we never return undefined
const safeRender = (element: React.ReactElement | null, fallbackType: string): React.ReactElement => {
  if (!element || element === null || element === undefined) {
    console.error(`safeRender: element is ${element} for ${fallbackType}`)
    return React.createElement(BlockLoadError, { blockType: fallbackType })
  }
  return element
}


// Recursively remove undefined and null values from an object
const cleanObject = (obj: any): any => {
  if (obj === undefined || obj === null) return undefined
  if (typeof obj !== 'object' || React.isValidElement(obj) || Array.isArray(obj)) return obj
  if (typeof obj === 'function') return obj

  const cleaned: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) {
      console.warn(`Removing ${key} with value: ${value}`)
      continue
    }
    if (typeof value === 'object' && !React.isValidElement(value) && !Array.isArray(value) && typeof value !== 'function') {
      const cleanedValue = cleanObject(value)
      // Keep the object even if it's empty after cleaning
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue
      }
    } else {
      cleaned[key] = value
    }
  }
  return cleaned
}

// Create converters function that will be called inside the component
const createJsxConverters = (loadedBlockComponents: typeof blockComponents): JSXConvertersFunction<DefaultNodeTypes> => {
  return ({ defaultConverters }) => {
    console.log('=== jsxConverters called ===')
    console.log('defaultConverters:', defaultConverters)

    // Validate that we have loaded components before proceeding
    if (!loadedBlockComponents.BannerBlock || !loadedBlockComponents.CodeBlock || !loadedBlockComponents.MediaBlock) {
      console.error('⚠️ Block components not fully loaded:', loadedBlockComponents)
      // Return only default converters if blocks aren't ready
      return defaultConverters
    }

    // Validate that defaultConverters is not null/undefined
    if (!defaultConverters || typeof defaultConverters !== 'object') {
      console.error('⚠️ defaultConverters is invalid:', defaultConverters)
      return {}
    }

    // DON'T clean or modify defaultConverters - use them as-is
    const converters: any = { ...defaultConverters }

    // Ensure blocks object exists
    const baseBlocks = (defaultConverters.blocks && typeof defaultConverters.blocks === 'object')
      ? { ...defaultConverters.blocks }
      : {}

    // Now add our custom blocks
    converters.blocks = {
        ...baseBlocks,
        banner: ({ node }: any) => {
          console.log('🎨 Rendering banner block:', node)
          if (!node?.fields) {
            console.warn('Banner block has no fields')
            return React.createElement(BlockLoadError, { blockType: 'Banner (no fields)' })
          }
          console.log('Banner block fields:', node.fields)
          console.log('BannerBlock component:', loadedBlockComponents.BannerBlock)

          if (!loadedBlockComponents.BannerBlock || typeof loadedBlockComponents.BannerBlock !== 'function') {
            console.error('BannerBlock component is undefined or not a function!', typeof loadedBlockComponents.BannerBlock)
            return React.createElement(BlockLoadError, { blockType: 'BannerBlock' })
          }

          try {
            const element = React.createElement(loadedBlockComponents.BannerBlock, node.fields)
            return safeRender(element, 'BannerBlock')
          } catch (error) {
            console.error('Error rendering BannerBlock:', error)
            return React.createElement(BlockLoadError, { blockType: 'BannerBlock' })
          }
        },
        code: ({ node }: any) => {
          console.log('💻 Rendering code block:', node)
          if (!node?.fields) {
            console.warn('Code block has no fields')
            return React.createElement(BlockLoadError, { blockType: 'Code (no fields)' })
          }
          console.log('Code block fields:', node.fields)
          console.log('CodeBlock component:', loadedBlockComponents.CodeBlock)

          if (!loadedBlockComponents.CodeBlock || typeof loadedBlockComponents.CodeBlock !== 'function') {
            console.error('CodeBlock component is undefined or not a function!', typeof loadedBlockComponents.CodeBlock)
            return React.createElement(BlockLoadError, { blockType: 'CodeBlock' })
          }

          try {
            const element = React.createElement(loadedBlockComponents.CodeBlock, { ...node.fields, blockType: 'code' })
            return safeRender(element, 'CodeBlock')
          } catch (error) {
            console.error('Error rendering CodeBlock:', error)
            return React.createElement(BlockLoadError, { blockType: 'CodeBlock' })
          }
        },
        mediaBlock: ({ node }: any) => {
          console.log('🖼️ Rendering mediaBlock:', node)
          if (!node?.fields) {
            console.warn('MediaBlock has no fields')
            return React.createElement(BlockLoadError, { blockType: 'MediaBlock (no fields)' })
          }
          console.log('MediaBlock fields:', node.fields)
          console.log('MediaBlock component:', loadedBlockComponents.MediaBlock)

          if (!loadedBlockComponents.MediaBlock || typeof loadedBlockComponents.MediaBlock !== 'function') {
            console.error('MediaBlock component is undefined or not a function!', typeof loadedBlockComponents.MediaBlock)
            return React.createElement(BlockLoadError, { blockType: 'MediaBlock' })
          }

          try {
            const element = React.createElement(loadedBlockComponents.MediaBlock, node.fields)
            return safeRender(element, 'MediaBlock')
          } catch (error) {
            console.error('Error rendering MediaBlock:', error)
            return React.createElement(BlockLoadError, { blockType: 'MediaBlock' })
          }
        },
      }

    console.log('Final converters keys:', Object.keys(converters))
    console.log('Final converters.blocks:', converters.blocks)
    console.log('Full converters object:', converters)

    // Deep check for undefined or invalid converters at all levels
    const undefinedConverters: string[] = []
    const checkValue = (val: any, path: string, depth = 0) => {
      // Prevent infinite recursion
      if (depth > 3) return true

      if (val === undefined || val === null) {
        console.error(`❌ CRITICAL: ${path} is ${val}!`)
        undefinedConverters.push(path)
        return false
      }
      // Check if it's a function or valid React element
      if (typeof val === 'function' || React.isValidElement(val) || typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return true
      }
      // For objects, check recursively (but not too deep to avoid issues)
      if (typeof val === 'object' && !Array.isArray(val)) {
        for (const [nestedKey, nestedValue] of Object.entries(val)) {
          checkValue(nestedValue, `${path}.${nestedKey}`, depth + 1)
        }
      }
      return true
    }

    Object.entries(converters).forEach(([key, value]) => {
      checkValue(value, `converters.${key}`)
    })

    if (undefinedConverters.length > 0) {
      console.error(`🚨 FOUND ${undefinedConverters.length} UNDEFINED/NULL CONVERTERS:`, undefinedConverters)
      // Remove undefined converters to prevent the error
      undefinedConverters.forEach(path => {
        const parts = path.replace('converters.', '').split('.')
        if (parts.length === 1) {
          console.log(`Deleting converters.${parts[0]}`)
          delete converters[parts[0]]
        } else if (parts.length === 2) {
          if (converters[parts[0]] && typeof converters[parts[0]] === 'object') {
            console.log(`Deleting converters.${parts[0]}.${parts[1]}`)
            delete (converters[parts[0]] as any)[parts[1]]
          }
        } else if (parts.length === 3) {
          if (converters[parts[0]] && typeof converters[parts[0]] === 'object') {
            const parent = converters[parts[0]] as any
            if (parent[parts[1]] && typeof parent[parts[1]] === 'object') {
              console.log(`Deleting converters.${parts[0]}.${parts[1]}.${parts[2]}`)
              delete parent[parts[1]][parts[2]]
            }
          }
        }
      })
      console.log('✅ Removed undefined/null converters, new keys:', Object.keys(converters))
    }

    console.log('========================')
    console.log('🎯 Final validated converters:', converters)
    console.log('🎯 Converters type:', typeof converters)
    console.log('🎯 Is converters an object?', converters && typeof converters === 'object')

    return converters
  }
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
  const [isClient, setIsClient] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [loadedComponents, setLoadedComponents] = React.useState<typeof blockComponents | null>(null)
  const [converters, setConverters] = React.useState<JSXConvertersFunction<DefaultNodeTypes> | null>(null)

  // Create a stable key based on content to force re-render on content changes
  // This helps prevent stale state during create/delete cycles
  // MUST be before any conditional returns to follow Rules of Hooks
  const contentKey = React.useMemo(() => {
    return JSON.stringify(data?.root?.children?.slice(0, 3) || [])
  }, [data])

  // Ensure component is mounted (prevents SSR/hydration issues on Vercel)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load block components on the client side
  React.useEffect(() => {
    let mounted = true

    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    // Set client flag first
    setIsClient(true)

    // Small delay to ensure DOM is ready (helps with Vercel SSR)
    const loadBlocks = async () => {
      try {
        console.log('=== Loading Block Components ===')

        const results = await Promise.all([
          import('@/blocks/Banner/Component').then((mod) => {
            console.log('✅ BannerBlock loaded:', mod.BannerBlock)
            if (!mod.BannerBlock) throw new Error('BannerBlock export is undefined')
            return { BannerBlock: mod.BannerBlock }
          }),
          import('@/blocks/Code/Component').then((mod) => {
            console.log('✅ CodeBlock loaded:', mod.CodeBlock)
            if (!mod.CodeBlock) throw new Error('CodeBlock export is undefined')
            return { CodeBlock: mod.CodeBlock }
          }),
          import('@/blocks/MediaBlock/Component').then((mod) => {
            console.log('✅ MediaBlock loaded:', mod.MediaBlock)
            if (!mod.MediaBlock) throw new Error('MediaBlock export is undefined')
            return { MediaBlock: mod.MediaBlock }
          }),
        ])

        // Only update state if component is still mounted
        if (!mounted) {
          console.log('⚠️ Component unmounted before blocks loaded, skipping state update')
          return
        }

        // Merge all loaded components
        const components = {
          BannerBlock: results[0].BannerBlock,
          CodeBlock: results[1].CodeBlock,
          MediaBlock: results[2].MediaBlock,
        }

        // Validate all components loaded successfully
        if (!components.BannerBlock || !components.CodeBlock || !components.MediaBlock) {
          console.error('❌ Some block components failed to load:', components)
          return
        }

        console.log('✅ All blocks loaded:', components)

        // Store in module-level object for backwards compatibility
        blockComponents.BannerBlock = components.BannerBlock
        blockComponents.CodeBlock = components.CodeBlock
        blockComponents.MediaBlock = components.MediaBlock

        // Create converters with the loaded components
        const jsxConverters = createJsxConverters(components)
        console.log('✅ Converters created')

        // Use a single state update to ensure atomicity
        setLoadedComponents(components)
        setConverters(() => jsxConverters)
      } catch (error) {
        console.error('❌ Failed to load blocks:', error)
      }
    }

    // Use requestIdleCallback if available (better for production), otherwise setTimeout
    if (typeof window.requestIdleCallback !== 'undefined') {
      window.requestIdleCallback(() => loadBlocks())
    } else {
      setTimeout(() => loadBlocks(), 0)
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false
    }
  }, [])

  // Don't render anything during SSR or before mounted
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

  console.log('SimpleRichText rendering with data:', data)
  console.log('Is client:', isClient)
  console.log('Is mounted:', isMounted)
  console.log('Converters ready:', !!converters)
  console.log('Components loaded:', loadedComponents)

  // Log all children types
  if (data?.root?.children) {
    const children = data.root.children.map((child: any) => ({
      type: child.type,
      hasFields: !!child.fields,
      blockType: child.fields?.blockType,
      fields: child.fields,
    }))
    console.log('Content children types:', children)
    console.log('Full children array:', data.root.children)
  }

  // During SSR or before blocks load, show placeholder
  if (!isClient || !converters || !loadedComponents) {
    console.log('Rendering placeholder - isClient:', isClient, 'converters:', !!converters, 'loadedComponents:', !!loadedComponents)
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

  console.log('Rendering full content with blocks')
  console.log('🔍 About to render ConvertRichText with converters:', converters)
  console.log('🔍 Converters is function?', typeof converters === 'function')
  console.log('🔍 Converters is null?', converters === null)
  console.log('🔍 Converters is undefined?', converters === undefined)

  // Final safety check before rendering
  if (!converters) {
    console.error('❌ CRITICAL: Converters is null/undefined, rendering placeholder instead')
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
        <div className="border border-yellow-500 bg-yellow-50 p-4 rounded">
          <strong>Warning:</strong> Content converters not ready. Please refresh the page.
        </div>
      </div>
    )
  }

  return (
    <RichTextErrorBoundary>
      <ConvertRichText
        key={contentKey}
        data={data}
        converters={converters}
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
