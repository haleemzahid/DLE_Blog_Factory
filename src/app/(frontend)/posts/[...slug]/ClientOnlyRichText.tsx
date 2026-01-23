'use client'

import { SafeRichText } from '@/components/RichText/SafeRichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

interface Props {
  content: DefaultTypedEditorState
}

export function ClientOnlyRichText({ content }: Props) {
  return (
    <SafeRichText
      className="max-w-[48rem] mx-auto"
      data={content}
      enableGutter={false}
    />
  )
}
