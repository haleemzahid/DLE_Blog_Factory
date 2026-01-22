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

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

// Recursively filter out undefined values from objects
const filterUndefined = (obj: any): any => {
  if (obj === null || obj === undefined) return undefined
  if (typeof obj === 'function') return obj // Keep functions as-is
  if (typeof obj !== 'object') return obj
  if (React.isValidElement(obj)) return obj // Keep React elements as-is
  if (Array.isArray(obj)) return obj // Keep arrays as-is

  const filtered: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      console.log(`Filtering out undefined key: ${key}`)
      continue
    }
    if (typeof value === 'function') {
      filtered[key] = value
    } else if (typeof value === 'object' && value !== null && !React.isValidElement(value) && !Array.isArray(value)) {
      // Recursively filter nested objects
      const filteredValue = filterUndefined(value)
      // Only add if not undefined
      if (filteredValue !== undefined) {
        filtered[key] = filteredValue
      }
    } else {
      filtered[key] = value
    }
  }
  return filtered
}

// Basic converters without block support to avoid circular dependencies
const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => {
  console.log('BasicRichText jsxConverters called')
  console.log('defaultConverters:', defaultConverters)

  // First, filter defaultConverters to remove any undefined values
  const filteredDefaults = filterUndefined(defaultConverters)
  console.log('Filtered defaultConverters:', filteredDefaults)

  const linkConverter = LinkJSXConverter({ internalDocToHref })
  console.log('linkConverter:', linkConverter)

  // Filter linkConverter to remove undefined values
  const filteredLinkConverter = filterUndefined(linkConverter)
  console.log('Filtered linkConverter:', filteredLinkConverter)

  // Manually merge to ensure we don't override with undefined
  const converters = { ...filteredDefaults }

  // Only add properties from linkConverter if they're not undefined
  for (const [key, value] of Object.entries(filteredLinkConverter)) {
    if (value !== undefined) {
      converters[key] = value
    }
  }

  console.log('Final converters:', converters)

  // One more safety check
  const finalFiltered = filterUndefined(converters)
  console.log('After final filter:', finalFiltered)

  return finalFiltered
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

/**
 * BasicRichText - A RichText component without block support
 * Used inside blocks to avoid circular dependencies
 */
function BasicRichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props

  if (!data) {
    console.warn('BasicRichText: No data provided')
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

export default BasicRichText
export { BasicRichText }
