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
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

type VoiceComposeFieldProps = {
  field?: any
  path?: string
  schemaPath?: string
  [key: string]: any
}

// Supported languages for speech recognition
const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'bn-BD', name: 'Bengali (Bangladesh)', flag: '🇧🇩' },
  { code: 'bn-IN', name: 'Bengali (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'nl-NL', name: 'Dutch', flag: '🇳🇱' },
  { code: 'tr-TR', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th-TH', name: 'Thai', flag: '🇹🇭' },
]

export const VoiceComposeField: React.FC<VoiceComposeFieldProps> = (props) => {
  console.log('[VoiceComposeField] Rendering with props:', { path: props.path, field: props.field?.name })

  const [isRecording, setIsRecording] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [history, setHistory] = useState<string[]>([''])
  const [historyIndex, setHistoryIndex] = useState(0)
  const recognitionRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const isUndoRedoRef = useRef(false)

  const { path, field } = props
  const { value, setValue } = useField<string>({ path: path || '' })

  console.log('[VoiceComposeField] Field value:', value)

  // Track value changes for undo/redo
  // Using refs to avoid infinite loops with history state
  const historyRef = useRef<string[]>([''])
  const historyIndexRef = useRef(0)

  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false
      return
    }
    const currentHistory = historyRef.current
    const currentIndex = historyIndexRef.current

    if (value !== currentHistory[currentIndex]) {
      const newHistory = currentHistory.slice(0, currentIndex + 1)
      newHistory.push(value || '')
      historyRef.current = newHistory
      historyIndexRef.current = newHistory.length - 1
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [value])

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      isUndoRedoRef.current = true
      const newIndex = historyIndexRef.current - 1
      historyIndexRef.current = newIndex
      setHistoryIndex(newIndex)
      setValue(historyRef.current[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoRef.current = true
      const newIndex = historyIndexRef.current + 1
      historyIndexRef.current = newIndex
      setHistoryIndex(newIndex)
      setValue(historyRef.current[newIndex])
    }
  }

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Text-to-Speech preview
  const handleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    if (!value) return
    const utterance = new SpeechSynthesisUtterance(value)
    utterance.lang = selectedLanguage
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  // Find the compose button container to inject voice button next to it
  useEffect(() => {
    let foundTarget = false

    const findComposeButton = () => {
      if (!containerRef.current || foundTarget) return

      // Find the payloadai-compose__actions element within this field wrapper
      const composeContainer = containerRef.current.querySelector(
        '[class*="payloadai-compose__actions"]',
      )
      if (composeContainer) {
        foundTarget = true
        setPortalTarget(composeContainer as HTMLElement)
        observer.disconnect() // Stop observing once found
      }
    }

    // Initial check with delay to allow ComposeField to render
    const timeout = setTimeout(findComposeButton, 200)

    // Use MutationObserver to detect when the compose button is added
    const observer = new MutationObserver(() => {
      if (!foundTarget) {
        findComposeButton()
      }
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
      recognition.lang = selectedLanguage

      recognition.onstart = () => setIsRecording(true)

      recognition.onresult = (event: any) => {
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

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)

  const actionButtons = (
    <>
      {/* Language Selector */}
      <div className="language-selector" ref={languageMenuRef}>
        <button
          type="button"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          title={`Language: ${currentLang?.name}`}
          className="language-btn"
        >
          <span className="language-flag">{currentLang?.flag}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {showLanguageMenu && (
          <div className="language-menu">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`language-option ${lang.code === selectedLanguage ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedLanguage(lang.code)
                  setShowLanguageMenu(false)
                }}
              >
                <span className="language-flag">{lang.flag}</span>
                <span className="language-name">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voice Record Button */}
      <button
        type="button"
        onClick={handleVoiceClick}
        title={isRecording ? 'Stop Recording' : 'Voice Record'}
        className={`voice-btn-title ${isRecording ? 'recording' : ''}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </button>

      {/* Text-to-Speech Button */}
      <button
        type="button"
        onClick={handleTextToSpeech}
        title={isSpeaking ? 'Stop Speaking' : 'Listen to Text'}
        className={`tts-btn ${isSpeaking ? 'speaking' : ''} ${!value ? 'disabled' : ''}`}
        disabled={!value}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isSpeaking ? (
            <>
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          )}
        </svg>
      </button>

      {/* Undo Button */}
      <button
        type="button"
        onClick={handleUndo}
        title="Undo"
        className={`undo-redo-btn ${historyIndex <= 0 ? 'disabled' : ''}`}
        disabled={historyIndex <= 0}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </button>

      {/* Redo Button */}
      <button
        type="button"
        onClick={handleRedo}
        title="Redo"
        className={`undo-redo-btn ${historyIndex >= history.length - 1 ? 'disabled' : ''}`}
        disabled={historyIndex >= history.length - 1}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
        </svg>
      </button>
    </>
  )

  return (
    <div ref={containerRef} className="voice-compose-field-wrapper">
      <TextField field={field} path={path || ''} />
      {portalTarget && createPortal(actionButtons, portalTarget)}
      <ComposeField field={field} path={path} schemaPath={props.schemaPath} />
    </div>
  )
}

export default VoiceComposeField
