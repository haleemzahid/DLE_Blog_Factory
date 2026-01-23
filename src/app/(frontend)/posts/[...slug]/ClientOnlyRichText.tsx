'use client'

import { SimpleRichText } from '@/components/RichText/SimpleRichText'
import { sanitizeRichTextData } from '@/utilities/sanitizeRichTextData'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { useEffect, useState } from 'react'

interface Props {
  content: DefaultTypedEditorState
}

export function ClientOnlyRichText({ content }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [sanitizedContent, setSanitizedContent] = useState<DefaultTypedEditorState | null>(null)

  useEffect(() => {
    setIsMounted(true)

    // Run sanitization on client side only
    console.log('🔧 Client-side sanitization starting')
    const sanitized = sanitizeRichTextData(content)

    if (!sanitized) {
      console.error('❌ Client-side sanitization failed')
      return
    }

    console.log('✅ Client-side sanitization successful')
    setSanitizedContent(sanitized)
  }, [content])

  // Don't render anything during SSR
  if (!isMounted) {
    return (
      <div className="max-w-[48rem] mx-auto">
        <div className="animate-pulse bg-gray-100 h-32 rounded" />
      </div>
    )
  }

  // Show error if sanitization failed
  if (!sanitizedContent) {
    return (
      <div className="max-w-[48rem] mx-auto">
        <div className="border border-red-500 bg-red-50 p-4 rounded">
          <p><strong>Error:</strong> Content data is corrupted. Please re-save this post.</p>
        </div>
      </div>
    )
  }

  // Render the rich text
  return (
    <SimpleRichText
      className="max-w-[48rem] mx-auto"
      data={sanitizedContent}
      enableGutter={false}
    />
  )
}
