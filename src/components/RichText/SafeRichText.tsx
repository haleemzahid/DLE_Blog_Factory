'use client'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/utilities/ui'
import React, { useEffect, useState } from 'react'

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  className?: string
}

export function SafeRichText({ data, enableGutter = true, enableProse = true, className }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn('payload-richtext', className)}>
        <div className="animate-pulse bg-gray-100 h-32 rounded" />
      </div>
    )
  }

  if (!data?.root?.children) {
    return null
  }

  try {
    return (
      <ConvertRichText
        data={data}
        className={cn(
          'payload-richtext',
          {
            container: enableGutter,
            'max-w-none': !enableGutter,
            'mx-auto prose md:prose-md dark:prose-invert': enableProse,
          },
          className,
        )}
      />
    )
  } catch (error) {
    return (
      <div className={cn('payload-richtext', className)}>
        <div className="border border-red-500 bg-red-50 p-4 rounded">
          <p><strong>Error:</strong> Failed to render content.</p>
        </div>
      </div>
    )
  }
}
