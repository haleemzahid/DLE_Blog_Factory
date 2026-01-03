'use client'

import { useEffect } from 'react'
import { initDLEAnalytics } from '@/lib/analytics'

interface AnalyticsTrackerProps {
  postId?: string
  postSlug?: string
  pageId?: string
  pageSlug?: string
  agentId?: string
  tenantId?: string
  debug?: boolean
}

/**
 * Analytics Tracker Component
 * Include this component on pages that need analytics tracking
 * Initializes the DLE Analytics tracker with the provided context
 */
export function AnalyticsTracker({
  postId,
  postSlug,
  pageId,
  pageSlug,
  agentId,
  tenantId,
  debug = false,
}: AnalyticsTrackerProps) {
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return

    // Check for consent
    const consent = localStorage.getItem('dle_analytics_consent')
    if (consent !== 'all' && consent !== 'analytics') {
      return
    }

    // Check Do Not Track
    if (navigator.doNotTrack === '1') {
      return
    }

    // Initialize analytics with context
    const analytics = initDLEAnalytics({
      postId,
      postSlug,
      pageId,
      pageSlug,
      agentId,
      tenantId,
      debug,
    })

    analytics.init()
  }, [postId, postSlug, pageId, pageSlug, agentId, tenantId, debug])

  // This component doesn't render anything
  return null
}

export default AnalyticsTracker
