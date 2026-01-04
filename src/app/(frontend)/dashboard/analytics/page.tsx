import React from 'react'
import { Metadata } from 'next'
import { AnalyticsDashboard } from '@/components/Analytics/Dashboard'

export const metadata: Metadata = {
  title: 'Analytics Dashboard | DLE Blog Factory',
  description: 'Comprehensive analytics dashboard for your blog network',
}

/**
 * Analytics Dashboard Page
 * Main entry point for the analytics dashboard
 */
export default function AnalyticsDashboardPage() {
  return <AnalyticsDashboard />
}
