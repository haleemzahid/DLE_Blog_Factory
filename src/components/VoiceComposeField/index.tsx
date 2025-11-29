'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useDocumentInfo, useField, FieldLabel } from '@payloadcms/ui'
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
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { collectionSlug } = useDocumentInfo()

  const { path, field } = props
  const { value, setValue } = useField<string>({ path: path || '' })

  // Calculate schemaPath like ComposeField does
  const finalSchemaPath = props?.schemaPath ??
    (collectionSlug ? `${collectionSlug}.${props?.path ?? ''}` : (props?.path ?? ''))

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

  return (
    <div ref={containerRef} className="voice-compose-field-wrapper">
      <div className="voice-compose-field-header">
        <FieldLabel
          label={field?.label || field?.name || 'Title'}
          required={field?.required}
          path={path}
        />
        <div className="voice-compose-actions">
          {/* Voice Button */}
          <button
            type="button"
            onClick={handleVoiceClick}
            title={isRecording ? 'Stop Recording' : 'Voice Record'}
            className={`voice-compose-btn ${isRecording ? 'recording' : ''}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
          </button>
          {/* Compose Button */}
          <ComposeField
            {...props}
            schemaPath={finalSchemaPath}
          />
        </div>
      </div>
      <TextField
        field={field}
        path={path || ''}
      />
    </div>
  )
}

export default VoiceComposeField
