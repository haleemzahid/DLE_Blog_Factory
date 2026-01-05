'use client'

import React, { useState, useEffect } from 'react'
import {
  formatNumber,
  formatPercent,
  formatCurrency,
  calculateChange,
} from '@/lib/analytics/utils'

interface NetworkAnalytics {
  period: string
  dateRange: {
    from: string
    to: string
  }
  realtime: {
    totalAgents: number
    totalPosts: number
    activeAgents: number
    keywordsRanking: number
    keywordsTop10: number
    keywordsTop3: number
    domainAuthority: number
  }
  summary: {
    totalPageviews: number
    totalUniqueVisitors: number
    totalSessions: number
    totalLeads: number
    totalAgentsSigned: number
    totalRevenue: number
    postsPublished: number
    avgPageviewsPerDay: number
    conversionRate: string
  }
  dailyData: Array<{
    date: string
    totalPageviews: number
    totalUniqueVisitors: number
    totalLeads: number
  }>
}

interface RealtimeAnalytics {
  window: string
  metrics: {
    activeVisitors: number
    pageviews: number
    formSubmissions: number
    ctaClicks: number
  }
  trafficSources: Record<string, number>
  devices: Record<string, number>
  topPages: Array<{ slug: string; count: number }>
}

/**
 * Network Admin Dashboard Component
 * Displays network-wide analytics for administrators
 */
export function NetworkDashboard() {
  const [analytics, setAnalytics] = useState<NetworkAnalytics | null>(null)
  const [realtime, setRealtime] = useState<RealtimeAnalytics | null>(null)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch analytics data
  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true)
      setError(null)

      try {
        const [analyticsRes, realtimeRes] = await Promise.all([
          fetch(`/api/analytics/network?period=${period}`),
          fetch('/api/analytics/realtime?window=24h'),
        ])

        if (!analyticsRes.ok) throw new Error('Failed to fetch analytics')

        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)

        if (realtimeRes.ok) {
          const realtimeData = await realtimeRes.json()
          setRealtime(realtimeData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()

    // Refresh realtime data every 30 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/analytics/realtime?window=24h')
        if (res.ok) {
          setRealtime(await res.json())
        }
      } catch (e) {
        // Silently fail realtime updates
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [period])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded"></div>
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

  const { summary, realtime: networkRealtime, dailyData } = analytics

  return (
    <div className="space-y-6">
      {/* Header with Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            DLE Network Command Center
          </h2>
          <span className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            LIVE
          </span>
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

      {/* Real-Time Metrics */}
      {realtime && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">🌍 Network Health (Real-Time)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RealtimeMetric
              value={formatNumber(realtime.metrics.activeVisitors)}
              label="Active Now"
            />
            <RealtimeMetric
              value={formatNumber(realtime.metrics.pageviews)}
              label="Pageviews Today"
            />
            <RealtimeMetric
              value={formatNumber(networkRealtime.totalAgents)}
              label="Total Agents"
            />
            <RealtimeMetric
              value={formatCurrency(summary.totalRevenue || 0)}
              label="MRR"
            />
          </div>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Visitors"
          value={formatNumber(summary.totalUniqueVisitors)}
          subtitle={`${formatNumber(summary.totalPageviews)} pageviews`}
          icon="👥"
        />
        <MetricCard
          title="Total Leads"
          value={formatNumber(summary.totalLeads)}
          subtitle={`${summary.conversionRate}% conversion`}
          icon="🎯"
        />
        <MetricCard
          title="Content Published"
          value={formatNumber(summary.postsPublished)}
          subtitle={`${formatNumber(networkRealtime.totalPosts)} total posts`}
          icon="📝"
        />
        <MetricCard
          title="Active Agents"
          value={formatNumber(networkRealtime.activeAgents)}
          subtitle={`of ${networkRealtime.totalAgents} total`}
          icon="👨‍💼"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 SEO Performance
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(networkRealtime.keywordsRanking)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Keywords Ranking</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(networkRealtime.keywordsTop10)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top 10 Keywords</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {networkRealtime.keywordsTop3}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top 3 Keywords</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {networkRealtime.domainAuthority || 'N/A'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Domain Authority</p>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        {realtime && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔗 Traffic Sources (Today)
            </h3>
            <div className="space-y-3">
              {Object.entries(realtime.trafficSources).map(([source, count]) => {
                const total = Object.values(realtime.trafficSources).reduce((a, b) => a + b, 0)
                const percent = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-700 dark:text-gray-300">{source}</span>
                      <span className="text-gray-500">{formatNumber(count)} ({formatPercent(percent)})</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Traffic Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📈 Network Traffic Trend
        </h3>
        <div className="h-64">
          <TrafficChart data={dailyData} />
        </div>
      </div>

      {/* Top Pages Today */}
      {realtime && realtime.topPages.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔥 Hot Pages (Today)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {realtime.topPages.slice(0, 10).map((page, index) => (
              <div
                key={page.slug}
                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {page.slug}
                  </p>
                  <p className="text-xs text-gray-500">{page.count} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Realtime Metric Component
 */
function RealtimeMetric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-blue-100">{label}</p>
    </div>
  )
}

/**
 * Metric Card Component
 */
interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
}

function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  )
}

/**
 * Traffic Chart Component
 */
interface ChartData {
  date: string
  totalPageviews: number
  totalUniqueVisitors: number
  totalLeads: number
}

function TrafficChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.totalPageviews || 0), 1)

  return (
    <div className="flex items-end justify-between h-full gap-1">
      {data.map((day, index) => {
        const height = ((day.totalPageviews || 0) / maxValue) * 100
        return (
          <div
            key={day.date || index}
            className="flex-1 group relative"
            style={{ height: '100%' }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all group-hover:from-blue-700 group-hover:to-blue-500"
              style={{ height: `${height}%`, minHeight: day.totalPageviews ? '4px' : '0' }}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              <div>{new Date(day.date).toLocaleDateString()}</div>
              <div>{formatNumber(day.totalPageviews || 0)} pageviews</div>
              <div>{formatNumber(day.totalUniqueVisitors || 0)} visitors</div>
              <div>{day.totalLeads || 0} leads</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NetworkDashboard
