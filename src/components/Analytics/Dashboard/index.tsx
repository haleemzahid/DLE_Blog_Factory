'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { MetricCards } from './MetricCards'
import { TrafficChart } from './TrafficChart'
import { TrafficSourcesChart } from './TrafficSourcesChart'
import { TopPagesTable } from './TopPagesTable'
import { DeviceBreakdown } from './DeviceBreakdown'
import { GeographyMap } from './GeographyMap'
import { RealTimeWidget } from './RealTimeWidget'
import { DateRangePicker } from './DateRangePicker'

export interface AnalyticsData {
  overview: {
    pageviews: number
    uniqueVisitors: number
    sessions: number
    avgSessionDuration: number
    bounceRate: number
    pagesPerSession: number
  }
  overviewComparison: {
    pageviews: number
    uniqueVisitors: number
    sessions: number
    avgSessionDuration: number
    bounceRate: number
    pagesPerSession: number
  }
  dailyData: Array<{
    date: string
    pageviews: number
    uniqueVisitors: number
    sessions: number
  }>
  trafficSources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  topPages: Array<{
    id: string
    title: string
    slug: string
    pageviews: number
    uniqueVisitors: number
    avgTimeOnPage: number
    bounceRate: number
  }>
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  browsers: Array<{
    name: string
    visitors: number
    percentage: number
  }>
  countries: Array<{
    country: string
    visitors: number
    percentage: number
  }>
  realtime: {
    activeUsers: number
    pageviewsLastHour: number
    topActivePage: string
  }
}

interface DateRange {
  from: Date
  to: Date
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        from: startOfDay(dateRange.from).toISOString(),
        to: endOfDay(dateRange.to).toISOString(),
      })

      const response = await fetch(`/api/analytics/dashboard?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchAnalytics])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <DateRangePicker
                from={dateRange.from}
                to={dateRange.to}
                onChange={setDateRange}
              />
              <button
                onClick={fetchAnalytics}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Real-time Widget */}
        <div className="mb-8">
          <RealTimeWidget data={data?.realtime} loading={loading} />
        </div>

        {/* Metric Cards */}
        <div className="mb-8">
          <MetricCards
            data={data?.overview}
            comparison={data?.overviewComparison}
            loading={loading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TrafficChart data={data?.dailyData} loading={loading} />
          </div>
          <div>
            <TrafficSourcesChart data={data?.trafficSources} loading={loading} />
          </div>
        </div>

        {/* Tables and Breakdown Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TopPagesTable data={data?.topPages} loading={loading} />
          </div>
          <div>
            <DeviceBreakdown
              devices={data?.devices}
              browsers={data?.browsers}
              loading={loading}
            />
          </div>
        </div>

        {/* Geography */}
        <div className="mb-8">
          <GeographyMap data={data?.countries} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
