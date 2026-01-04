'use client'

import React, { useState, useEffect } from 'react'
import {
  formatNumber,
  formatPercent,
  formatDuration,
  calculateChange,
} from '@/lib/analytics/utils'

interface AgentAnalytics {
  agentId: string
  period: string
  dateRange: {
    from: string
    to: string
  }
  summary: {
    totalPageviews: number
    totalUniqueVisitors: number
    totalSessions: number
    totalLeads: number
    totalFormSubmissions: number
    totalPosts: number
    conversionRate: string
  }
  topPosts: Array<{
    id: string
    title: string
    slug: string
    pageviews: number
    leads: number
    conversionRate: string
  }>
  dailyData: Array<{
    date: string
    totalPageviews: number
    uniqueVisitors: number
    leadsGenerated: number
  }>
}

interface AgentDashboardProps {
  agentId: string
  agentName?: string
}

/**
 * Agent Dashboard Component
 * Displays analytics data for a specific agent
 */
export function AgentDashboard({ agentId, agentName }: AgentDashboardProps) {
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null)
  const [previousAnalytics, setPreviousAnalytics] = useState<AgentAnalytics | null>(null)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch current period
        const response = await fetch(`/api/analytics/agents/${agentId}?period=${period}`)
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const data = await response.json()
        setAnalytics(data)

        // Fetch previous period for comparison
        const previousPeriod = period === '7d' ? '14d' : period === '30d' ? '60d' : '180d'
        const prevResponse = await fetch(`/api/analytics/agents/${agentId}?period=${previousPeriod}`)
        if (prevResponse.ok) {
          const prevData = await prevResponse.json()
          setPreviousAnalytics(prevData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [agentId, period])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
        No analytics data available
      </div>
    )
  }

  const { summary, topPosts, dailyData } = analytics

  // Calculate changes
  const pageviewChange = previousAnalytics
    ? calculateChange(summary.totalPageviews, previousAnalytics.summary.totalPageviews)
    : null

  const leadsChange = previousAnalytics
    ? calculateChange(summary.totalLeads, previousAnalytics.summary.totalLeads)
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {agentName ? `${agentName}'s Dashboard` : 'Agent Dashboard'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Visitors"
          value={formatNumber(summary.totalUniqueVisitors)}
          change={pageviewChange}
          icon="👥"
        />
        <MetricCard
          title="Total Leads"
          value={summary.totalLeads}
          change={leadsChange}
          icon="🎯"
        />
        <MetricCard
          title="Conversion Rate"
          value={summary.conversionRate + '%'}
          icon="📈"
        />
        <MetricCard
          title="Published Posts"
          value={summary.totalPosts}
          icon="📝"
        />
      </div>

      {/* Traffic Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Traffic Trend
        </h3>
        <div className="h-64">
          <SimpleLineChart data={dailyData} />
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🏆 Top Performing Posts
        </h3>
        {topPosts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No posts with analytics data yet</p>
        ) : (
          <div className="space-y-3">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatNumber(post.pageviews)} views • {post.leads} leads •{' '}
                      {post.conversionRate}% conversion
                    </p>
                  </div>
                </div>
                <a
                  href={`/posts/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Metric Card Component
 */
interface MetricCardProps {
  title: string
  value: string | number
  change?: { value: number; direction: 'up' | 'down' | 'same' } | null
  icon?: string
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {change && (
        <p
          className={`mt-1 text-sm ${
            change.direction === 'up'
              ? 'text-green-600'
              : change.direction === 'down'
                ? 'text-red-600'
                : 'text-gray-500'
          }`}
        >
          {change.direction === 'up' ? '↑' : change.direction === 'down' ? '↓' : '→'}
          {' '}
          {formatPercent(change.value)} vs previous period
        </p>
      )}
    </div>
  )
}

/**
 * Simple Line Chart Component (CSS-based)
 */
interface ChartData {
  date: string
  totalPageviews: number
  uniqueVisitors: number
  leadsGenerated: number
}

function SimpleLineChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    )
  }

  const maxPageviews = Math.max(...data.map((d) => d.totalPageviews || 0), 1)

  return (
    <div className="flex items-end justify-between h-full gap-1">
      {data.map((day, index) => {
        const height = ((day.totalPageviews || 0) / maxPageviews) * 100
        return (
          <div
            key={day.date || index}
            className="flex-1 group relative"
            style={{ height: '100%' }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t transition-all group-hover:bg-blue-600"
              style={{ height: `${height}%`, minHeight: day.totalPageviews ? '4px' : '0' }}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              <div>{new Date(day.date).toLocaleDateString()}</div>
              <div>{day.totalPageviews || 0} pageviews</div>
              <div>{day.leadsGenerated || 0} leads</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AgentDashboard
