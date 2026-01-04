'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { initDLEAnalytics, getDLEAnalytics, trackEvent } from '@/lib/analytics'
import type { AnalyticsConfig } from '@/lib/analytics'

interface AnalyticsContextValue {
  isInitialized: boolean
  isConsentGiven: boolean
  setConsent: (level: 'all' | 'analytics' | 'essential' | 'none') => void
  track: (eventName: string, data?: Record<string, unknown>) => void
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  isInitialized: false,
  isConsentGiven: false,
  setConsent: () => {},
  track: () => {},
})

interface AnalyticsProviderProps {
  children: React.ReactNode
  config?: AnalyticsConfig
  autoInit?: boolean
}

/**
 * Analytics Provider Component
 * Wraps the application and provides analytics tracking functionality
 */
export function AnalyticsProvider({
  children,
  config = {},
  autoInit = true,
}: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isConsentGiven, setIsConsentGiven] = useState(false)

  // Check consent on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('dle_analytics_consent')
      setIsConsentGiven(consent === 'all' || consent === 'analytics')
    }
  }, [])

  // Initialize analytics
  useEffect(() => {
    if (autoInit && isConsentGiven && !isInitialized) {
      const analytics = initDLEAnalytics(config)
      analytics.init()
      setIsInitialized(true)
    }
  }, [autoInit, isConsentGiven, isInitialized, config])

  const setConsent = useCallback((level: 'all' | 'analytics' | 'essential' | 'none') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dle_analytics_consent', level)
      setIsConsentGiven(level === 'all' || level === 'analytics')

      const analytics = getDLEAnalytics()
      if (analytics) {
        analytics.setConsent(level)
      }
    }
  }, [])

  const track = useCallback((eventName: string, data?: Record<string, unknown>) => {
    if (isConsentGiven) {
      trackEvent(eventName, data)
    }
  }, [isConsentGiven])

  return (
    <AnalyticsContext.Provider
      value={{
        isInitialized,
        isConsentGiven,
        setConsent,
        track,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Hook to access analytics context
 */
export function useAnalytics() {
  return useContext(AnalyticsContext)
}

/**
 * Hook to track page views for a specific post
 */
export function usePostAnalytics(postId: string, postSlug: string) {
  const { isConsentGiven } = useAnalytics()

  useEffect(() => {
    if (isConsentGiven && postId) {
      const analytics = getDLEAnalytics()
      if (!analytics) {
        // Initialize with post context
        const newAnalytics = initDLEAnalytics({ postId, postSlug })
        newAnalytics.init()
      }
    }
  }, [isConsentGiven, postId, postSlug])
}

/**
 * Hook to track page views for a specific page
 */
export function usePageAnalytics(pageId: string, pageSlug: string) {
  const { isConsentGiven } = useAnalytics()

  useEffect(() => {
    if (isConsentGiven && pageId) {
      const analytics = getDLEAnalytics()
      if (!analytics) {
        const newAnalytics = initDLEAnalytics({ pageId, pageSlug })
        newAnalytics.init()
      }
    }
  }, [isConsentGiven, pageId, pageSlug])
}

/**
 * Hook to track CTA clicks
 */
export function useTrackCTA() {
  const { track, isConsentGiven } = useAnalytics()

  return useCallback(
    (ctaName: string, ctaType?: string, additionalData?: Record<string, unknown>) => {
      if (isConsentGiven) {
        track('cta_click', {
          ctaName,
          ctaType,
          ...additionalData,
        })
      }
    },
    [track, isConsentGiven],
  )
}

/**
 * Hook to track form submissions
 */
export function useTrackFormSubmission() {
  const { track, isConsentGiven } = useAnalytics()

  return useCallback(
    (formName: string, formType?: string, additionalData?: Record<string, unknown>) => {
      if (isConsentGiven) {
        track('form_submission', {
          formName,
          formType,
          ...additionalData,
        })
      }
    },
    [track, isConsentGiven],
  )
}

/**
 * Hook to track downloads
 */
export function useTrackDownload() {
  const { track, isConsentGiven } = useAnalytics()

  return useCallback(
    (fileName: string, fileType?: string, additionalData?: Record<string, unknown>) => {
      if (isConsentGiven) {
        track('download', {
          fileName,
          fileType,
          ...additionalData,
        })
      }
    },
    [track, isConsentGiven],
  )
}

/**
 * Hook to track social shares
 */
export function useTrackShare() {
  const { track, isConsentGiven } = useAnalytics()

  return useCallback(
    (platform: string, contentType: string, additionalData?: Record<string, unknown>) => {
      if (isConsentGiven) {
        track('share', {
          platform,
          contentType,
          ...additionalData,
        })
      }
    },
    [track, isConsentGiven],
  )
}

export default AnalyticsProvider
