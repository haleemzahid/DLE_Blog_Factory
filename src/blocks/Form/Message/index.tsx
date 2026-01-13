import { SimpleRichText } from '@/components/RichText/SimpleRichText'
import React from 'react'

import { Width } from '../Width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return (
    <Width className="my-12" width="100">
      {message && <SimpleRichText data={message} />}
    </Width>
  )
}
