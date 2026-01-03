'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Custom admin navigation link to the Analytics Dashboard
 * Renders under the Analytics section in the admin sidebar
 */
export const AnalyticsDashboardNavLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname === '/admin/analytics-dashboard'

  return (
    <div
      style={{
        marginTop: '-0.5rem',
        marginBottom: '0.5rem',
      }}
    >
      <div
        style={{
          padding: '0.75rem 1.25rem 0.5rem',
          fontSize: '0.6875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: 'var(--theme-elevation-450)',
        }}
      >
        Analytics
      </div>
      <Link
        href="/admin/analytics-dashboard"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1.25rem',
          color: isActive ? 'var(--theme-text)' : 'var(--theme-elevation-650)',
          textDecoration: 'none',
          fontSize: '0.8125rem',
          fontWeight: isActive ? 500 : 400,
          backgroundColor: isActive ? 'var(--theme-elevation-100)' : 'transparent',
          borderLeft: isActive ? '2px solid var(--theme-elevation-800)' : '2px solid transparent',
          transition: 'all 0.15s ease',
        }}
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
          <path d="M3 3v18h18" />
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
        </svg>
        <span>Dashboard</span>
      </Link>
    </div>
  )
}

export default AnalyticsDashboardNavLink
