'use client'

import React, { useState, useEffect } from 'react'
import { formatNumber, formatPercent, formatDuration } from '@/lib/analytics/utils'

interface PostAnalyticsSummary {
  postId: string
  period: string
  summary: {
    totalPageviews: number
    totalUniqueVisitors: number
    totalSessions: number
    totalLeads: number
    avgTimeOnPage: number
    avgScrollDepth: number
    avgBounceRate: number
    conversionRate: string
  }
}

interface PostAnalyticsCardProps {
  postId: string
  postTitle?: string
  compact?: boolean
}

/**
 * Post Analytics Card Component
 * Displays a compact summary of analytics for a specific post
 */
export function PostAnalyticsCard({ postId, postTitle, compact = false }: PostAnalyticsCardProps) {
  const [analytics, setAnalytics] = useState<PostAnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/analytics/posts/${postId}?period=30d`)
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [postId])

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    )
  }

  if (error || !analytics) {
    return null // Silently fail for non-critical component
  }

  const { summary } = analytics

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span>👁</span> {formatNumber(summary.totalPageviews)}
        </span>
        <span className="flex items-center gap-1">
          <span>🎯</span> {summary.totalLeads}
        </span>
        <span className="flex items-center gap-1">
          <span>📊</span> {summary.conversionRate}%
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {postTitle && (
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">{postTitle}</h4>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(summary.totalPageviews)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pageviews</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(summary.totalUniqueVisitors)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Visitors</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {summary.totalLeads}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Leads</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {summary.conversionRate}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Conversion</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-900 dark:text-white font-medium">
            {formatDuration(summary.avgTimeOnPage)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Time</p>
        </div>

        <div>
          <p className="text-gray-900 dark:text-white font-medium">
            {formatPercent(summary.avgScrollDepth)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Scroll Depth</p>
        </div>

        <div>
          <p className="text-gray-900 dark:text-white font-medium">
            {formatPercent(summary.avgBounceRate)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Bounce Rate</p>
        </div>
      </div>
    </div>
  )
}

export default PostAnalyticsCard
