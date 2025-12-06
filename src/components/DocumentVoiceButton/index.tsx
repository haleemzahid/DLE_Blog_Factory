'use client'

import React from 'react'

type DocumentVoiceButtonProps = {
  children?: React.ReactNode
}

// Simple pass-through component - buttons only shown on title field via VoiceComposeField
export const DocumentVoiceButton: React.FC<DocumentVoiceButtonProps> = ({ children }) => {
  return <>{children}</>
}

export default DocumentVoiceButton
