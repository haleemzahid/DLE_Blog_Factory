'use client'

import React, { useEffect, useState } from 'react'

interface RealTimeWidgetProps {
  data?: {
    activeUsers: number
    pageviewsLastHour: number
    topActivePage: string
  }
  loading?: boolean
}

export function RealTimeWidget({ data, loading }: RealTimeWidgetProps) {
  const [pulse, setPulse] = useState(true)

  // Pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Active Users */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`absolute inset-0 bg-green-400 rounded-full transition-all duration-1000 ${
                pulse ? 'opacity-50 scale-150' : 'opacity-0 scale-100'
              }`}
            />
            <div className="relative w-3 h-3 bg-green-400 rounded-full" />
          </div>
          <div>
            <p className="text-blue-100 text-sm">Active Users Right Now</p>
            {loading ? (
              <div className="animate-pulse h-10 w-16 bg-blue-400/30 rounded mt-1"></div>
            ) : (
              <p className="text-4xl font-bold">{data?.activeUsers ?? 0}</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-16 bg-blue-400/30" />

        {/* Pageviews Last Hour */}
        <div>
          <p className="text-blue-100 text-sm">Pageviews (Last Hour)</p>
          {loading ? (
            <div className="animate-pulse h-8 w-20 bg-blue-400/30 rounded mt-1"></div>
          ) : (
            <p className="text-2xl font-semibold">{data?.pageviewsLastHour ?? 0}</p>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-16 bg-blue-400/30" />

        {/* Top Active Page */}
        <div className="flex-1 min-w-0">
          <p className="text-blue-100 text-sm">Most Active Page</p>
          {loading ? (
            <div className="animate-pulse h-6 w-48 bg-blue-400/30 rounded mt-1"></div>
          ) : (
            <p className="text-lg font-medium truncate" title={data?.topActivePage}>
              {data?.topActivePage || 'No active page'}
            </p>
          )}
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
          <div className="relative">
            <div
              className={`absolute inset-0 bg-red-500 rounded-full transition-all duration-500 ${
                pulse ? 'opacity-100 scale-125' : 'opacity-50 scale-100'
              }`}
            />
            <div className="relative w-2 h-2 bg-red-500 rounded-full" />
          </div>
          <span className="text-sm font-medium">LIVE</span>
        </div>
      </div>
    </div>
  )
}
