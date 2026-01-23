'use client'

import { SimpleRichText } from '@/components/RichText/SimpleRichText.v2'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import React from 'react'

interface Props {
  content: DefaultTypedEditorState
}

export function ClientOnlyRichText({ content }: Props) {
  // Generate a stable key from content to force remount when content changes
  const contentKey = React.useMemo(() => {
    try {
      return JSON.stringify(content?.root?.children?.slice(0, 2) || [])
    } catch {
      return Date.now().toString()
    }
  }, [content])

  return (
    <SimpleRichText
      key={contentKey}
      className="max-w-[48rem] mx-auto"
      data={content}
      enableGutter={false}
    />
  )
}
