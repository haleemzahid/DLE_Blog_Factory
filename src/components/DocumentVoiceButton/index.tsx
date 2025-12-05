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

type DocumentVoiceButtonProps = {
  children?: React.ReactNode
}

export const DocumentVoiceButton: React.FC<DocumentVoiceButtonProps> = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const portalTargetRef = useRef<HTMLElement | null>(null)

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

        portalTargetRef.current = container as HTMLElement
        setPortalTarget(container as HTMLElement)
        return true
      }
      return false
    }

    // Check periodically until we find the target (handles tab switching)
    const interval = setInterval(() => {
      // Check if current portal target is still in DOM
      if (portalTargetRef.current && !document.body.contains(portalTargetRef.current)) {
        portalTargetRef.current = null
        setPortalTarget(null)
      }
      // Try to find a new target if we don't have one
      if (!portalTargetRef.current) {
        findComposeButton()
      }
    }, 1000)

    // Initial check
    findComposeButton()

    return () => {
      clearInterval(interval)
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
    recognition.lang = selectedLanguage

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

  // Text-to-Speech preview - reads content from the Lexical editor
  const handleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const lexicalEditor = document.querySelector('[contenteditable="true"]') as HTMLElement
    const text = lexicalEditor?.innerText || ''
    if (!text.trim()) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = selectedLanguage
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleUndo = () => {
    const lexicalEditor = document.querySelector('[contenteditable="true"]') as HTMLElement
    if (lexicalEditor) {
      lexicalEditor.focus()
      document.execCommand('undo', false)
    }
  }

  const handleRedo = () => {
    const lexicalEditor = document.querySelector('[contenteditable="true"]') as HTMLElement
    if (lexicalEditor) {
      lexicalEditor.focus()
      document.execCommand('redo', false)
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
        className={`voice-btn-document ${isRecording ? 'recording' : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
      </button>

      {/* Text-to-Speech Button */}
      <button
        type="button"
        onClick={handleTextToSpeech}
        title={isSpeaking ? 'Stop Speaking' : 'Listen to Text'}
        className={`tts-btn ${isSpeaking ? 'speaking' : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        className="undo-redo-btn-text"
      >
        Undo
      </button>

      {/* Redo Button */}
      <button
        type="button"
        onClick={handleRedo}
        title="Redo"
        className="undo-redo-btn-text"
      >
        Redo
      </button>
    </>
  )

  return (
    <>
      {children}
      {portalTarget && createPortal(actionButtons, portalTarget)}
    </>
  )
}

export default DocumentVoiceButton
