'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useField } from '@payloadcms/ui'
import { TextField } from '@payloadcms/ui'
import { ComposeField } from '@ai-stack/payloadcms/fields'
import './styles.css'

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

type VoiceComposeFieldProps = {
  field?: any
  path?: string
  schemaPath?: string
  [key: string]: any
}

export const VoiceComposeField: React.FC<VoiceComposeFieldProps> = (props) => {
  const [isRecording, setIsRecording] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { path, field } = props
  const { value, setValue } = useField<string>({ path: path || '' })

  // Find the compose button container to inject voice button next to it
  useEffect(() => {
    const findComposeButton = () => {
      if (!containerRef.current) return

      // Find the payloadai-compose__actions element within this field wrapper
      const composeContainer = containerRef.current.querySelector('[class*="payloadai-compose__actions"]')
      if (composeContainer && !composeContainer.querySelector('.voice-btn-title')) {
        setPortalTarget(composeContainer as HTMLElement)
      }
    }

    // Initial check with delay to allow ComposeField to render
    const timeout = setTimeout(findComposeButton, 200)

    // Use MutationObserver to detect when the compose button is added
    const observer = new MutationObserver(() => {
      findComposeButton()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      })
    }

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
    } else {
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
          const currentValue = value || ''
          const newValue = currentValue ? `${currentValue} ${finalTranscript}` : finalTranscript
          setValue(newValue)
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
  }

  const voiceButton = (
    <button
      type="button"
      onClick={handleVoiceClick}
      title={isRecording ? 'Stop Recording' : 'Voice Record'}
      className={`voice-btn-title ${isRecording ? 'recording' : ''}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    </button>
  )

  return (
    <div ref={containerRef} className="voice-compose-field-wrapper">
      <TextField
        field={field}
        path={path || ''}
      />
      <ComposeField field={field} path={path} schemaPath={props.schemaPath} />
      {portalTarget && createPortal(voiceButton, portalTarget)}
    </div>
  )
}

export default VoiceComposeField
