'use client'

import React from 'react'

/**
 * Analytics Dashboard View for Payload Admin
 * Uses an iframe to load the dashboard in the frontend context with full Tailwind support
 * Note: No need to import globals.css here as it would conflict with Payload's admin styles
 * The iframe loads /analytics-dashboard which has its own frontend layout with proper styles
 */
export const AnalyticsDashboardView: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - 60px)',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <iframe
        src="/analytics-dashboard"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        title="Analytics Dashboard"
      />
    </div>
  )
}

export default AnalyticsDashboardView
