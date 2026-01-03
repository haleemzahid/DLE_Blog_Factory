'use client'

import React from 'react'

interface MetricCardsProps {
  data?: {
    pageviews: number
    uniqueVisitors: number
    sessions: number
    avgSessionDuration: number
    bounceRate: number
    pagesPerSession: number
  }
  comparison?: {
    pageviews: number
    uniqueVisitors: number
    sessions: number
    avgSessionDuration: number
    bounceRate: number
    pagesPerSession: number
  }
  loading?: boolean
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs}s`
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

interface MetricCardProps {
  title: string
  value: string
  change?: number
  icon: React.ReactNode
  loading?: boolean
  invertChange?: boolean // For metrics where decrease is good (like bounce rate)
}

function MetricCard({ title, value, change, icon, loading, invertChange }: MetricCardProps) {
  const isPositive = invertChange ? (change ?? 0) < 0 : (change ?? 0) > 0
  const isNegative = invertChange ? (change ?? 0) > 0 : (change ?? 0) < 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</span>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
          {change !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              {isPositive && (
                <>
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-green-500">{Math.abs(change).toFixed(1)}%</span>
                </>
              )}
              {isNegative && (
                <>
                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="text-red-500">{Math.abs(change).toFixed(1)}%</span>
                </>
              )}
              {!isPositive && !isNegative && (
                <span className="text-gray-500">0%</span>
              )}
              <span className="text-gray-400 ml-1">vs previous period</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export function MetricCards({ data, comparison, loading }: MetricCardsProps) {
  const metrics = [
    {
      title: 'Total Pageviews',
      value: data ? formatNumber(data.pageviews) : '0',
      change: data && comparison ? calculateChange(data.pageviews, comparison.pageviews) : undefined,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: 'Unique Visitors',
      value: data ? formatNumber(data.uniqueVisitors) : '0',
      change: data && comparison ? calculateChange(data.uniqueVisitors, comparison.uniqueVisitors) : undefined,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Sessions',
      value: data ? formatNumber(data.sessions) : '0',
      change: data && comparison ? calculateChange(data.sessions, comparison.sessions) : undefined,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Avg. Session Duration',
      value: data ? formatDuration(data.avgSessionDuration) : '0s',
      change: data && comparison ? calculateChange(data.avgSessionDuration, comparison.avgSessionDuration) : undefined,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Bounce Rate',
      value: data ? formatPercentage(data.bounceRate) : '0%',
      change: data && comparison ? calculateChange(data.bounceRate, comparison.bounceRate) : undefined,
      invertChange: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Pages / Session',
      value: data ? data.pagesPerSession.toFixed(2) : '0',
      change: data && comparison ? calculateChange(data.pagesPerSession, comparison.pagesPerSession) : undefined,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          loading={loading}
          invertChange={metric.invertChange}
        />
      ))}
    </div>
  )
}
