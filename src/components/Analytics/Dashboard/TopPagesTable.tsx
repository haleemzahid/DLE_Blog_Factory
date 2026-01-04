'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface TopPagesTableProps {
  data?: Array<{
    id: string
    title: string
    slug: string
    pageviews: number
    uniqueVisitors: number
    avgTimeOnPage: number
    bounceRate: number
  }>
  loading?: boolean
}

type SortKey = 'pageviews' | 'uniqueVisitors' | 'avgTimeOnPage' | 'bounceRate'
type SortDirection = 'asc' | 'desc'

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}m ${secs}s`
}

export function TopPagesTable({ data, loading }: TopPagesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('pageviews')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedData = data
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      })
    : []

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => (
    <svg
      className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-400'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      )}
    </svg>
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Pages</h3>
        <Link
          href="/dashboard/analytics/pages"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          No data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Page
                </th>
                <th
                  onClick={() => handleSort('pageviews')}
                  className="text-right py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <div className="flex items-center justify-end gap-1">
                    Pageviews
                    <SortIcon active={sortKey === 'pageviews'} direction={sortKey === 'pageviews' ? sortDirection : 'desc'} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('uniqueVisitors')}
                  className="text-right py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <div className="flex items-center justify-end gap-1">
                    Visitors
                    <SortIcon active={sortKey === 'uniqueVisitors'} direction={sortKey === 'uniqueVisitors' ? sortDirection : 'desc'} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgTimeOnPage')}
                  className="text-right py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 hidden sm:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    Avg. Time
                    <SortIcon active={sortKey === 'avgTimeOnPage'} direction={sortKey === 'avgTimeOnPage' ? sortDirection : 'desc'} />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('bounceRate')}
                  className="text-right py-3 px-2 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 hidden md:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    Bounce
                    <SortIcon active={sortKey === 'bounceRate'} direction={sortKey === 'bounceRate' ? sortDirection : 'desc'} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.slice(0, 10).map((page, index) => (
                <tr
                  key={page.id}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 w-5">{index + 1}</span>
                      <div className="min-w-0">
                        <Link
                          href={`/posts/${page.slug}`}
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block max-w-[200px] sm:max-w-[300px]"
                          title={page.title}
                        >
                          {page.title}
                        </Link>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate block max-w-[200px] sm:max-w-[300px]">
                          /posts/{page.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {page.pageviews.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {page.uniqueVisitors.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right hidden sm:table-cell">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDuration(page.avgTimeOnPage)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right hidden md:table-cell">
                    <span
                      className={`text-sm ${
                        page.bounceRate > 70
                          ? 'text-red-500'
                          : page.bounceRate > 50
                          ? 'text-yellow-500'
                          : 'text-green-500'
                      }`}
                    >
                      {page.bounceRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
