'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../VoiceComposeField/styles.css'

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

type DocumentVoiceButtonProps = {
  children?: React.ReactNode
}

export const DocumentVoiceButton: React.FC<DocumentVoiceButtonProps> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    // Find the document-level compose button container (for description/content rich text field)
    const findComposeButton = () => {
      // Find payloadai-compose__actions containers NOT inside the title field
      const containers = document.querySelectorAll('[class*="payloadai-compose__actions"]')

      for (const container of containers) {
        // Skip if it's inside the voice-compose-field-wrapper (title field)
        if (container.closest('.voice-compose-field-wrapper')) continue
        // Skip if already has voice button
        if (container.querySelector('.voice-btn-document')) continue

        setPortalTarget(container as HTMLElement)
        return
      }
    }

    // Initial check with delay to allow DOM to render
    const timeout = setTimeout(findComposeButton, 300)

    // Use MutationObserver to detect when the compose button is added
    const observer = new MutationObserver(() => {
      findComposeButton()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [])

  const handleVoiceClick = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setIsRecording(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported. Use Chrome, Edge, or Safari.')
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsRecording(true)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }

      if (finalTranscript) {
        // Find the Lexical editor and insert text
        const lexicalEditor = document.querySelector('[contenteditable="true"]') as HTMLElement
        if (lexicalEditor) {
          // Focus the editor
          lexicalEditor.focus()

          // Use execCommand to insert text at cursor position
          document.execCommand('insertText', false, finalTranscript + ' ')
        }
      }
    }

    recognition.onerror = () => {
      setIsRecording(false)
      recognitionRef.current = null
    }

    recognition.onend = () => {
      setIsRecording(false)
      recognitionRef.current = null
    }

    recognition.start()
  }

  const voiceButton = (
    <button
      type="button"
      onClick={handleVoiceClick}
      title={isRecording ? 'Stop Recording' : 'Voice Record'}
      className={`voice-btn-document ${isRecording ? 'recording' : ''}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    </button>
  )

  return (
    <>
      {children}
      {portalTarget && createPortal(voiceButton, portalTarget)}
    </>
  )
}

export default DocumentVoiceButton
