'use client'

import React, { useState, useEffect } from 'react'
import { useAnalytics } from './index'

interface CookieConsentProps {
  privacyPolicyUrl?: string
  className?: string
}

/**
 * Cookie Consent Banner Component
 * GDPR/CCPA compliant cookie consent for analytics tracking
 */
export function CookieConsent({
  privacyPolicyUrl = '/privacy-policy',
  className = '',
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { setConsent, isConsentGiven } = useAnalytics()

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('dle_analytics_consent')
    if (!consent) {
      // Small delay for better UX
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    setConsent('all')
    setIsVisible(false)
  }

  const handleAcceptAnalytics = () => {
    setConsent('analytics')
    setIsVisible(false)
  }

  const handleRejectNonEssential = () => {
    setConsent('essential')
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    setConsent('none')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 ${className}`}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h2
              id="cookie-consent-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              We value your privacy
            </h2>
            <p
              id="cookie-consent-description"
              className="mt-1 text-sm text-gray-600 dark:text-gray-400"
            >
              We use cookies to enhance your browsing experience, serve personalized content, and
              analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
              {' '}
              <a
                href={privacyPolicyUrl}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline"
              >
                Read our Privacy Policy
              </a>
            </p>

            {showDetails && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Cookie Categories
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-gray-900 dark:text-white">Essential Cookies</strong>
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      Always Active
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Required for the website to function properly. These cannot be disabled.
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Analytics Cookies</strong>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Help us understand how visitors interact with our website, allowing us to
                      improve content and user experience.
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Marketing Cookies</strong>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Used to track visitors across websites to display relevant advertisements.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
            >
              {showDetails ? 'Hide Details' : 'Cookie Settings'}
            </button>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleRejectNonEssential}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAnalytics}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Accept Analytics
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
