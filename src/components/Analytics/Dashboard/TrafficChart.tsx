'use client'

import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface TrafficChartProps {
  data?: Array<{
    date: string
    pageviews: number
    uniqueVisitors: number
    sessions: number
  }>
  loading?: boolean
}

type ChartType = 'line' | 'area'
type MetricType = 'pageviews' | 'uniqueVisitors' | 'sessions' | 'all'

export function TrafficChart({ data, loading }: TrafficChartProps) {
  const [chartType, setChartType] = useState<ChartType>('area')
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('all')

  const formattedData = data?.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM d'),
  }))

  const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            dataKey="formattedDate"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#F9FAFB',
            }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Legend />
          {(selectedMetric === 'all' || selectedMetric === 'pageviews') && (
            <Area
              type="monotone"
              dataKey="pageviews"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorPageviews)"
              name="Pageviews"
            />
          )}
          {(selectedMetric === 'all' || selectedMetric === 'uniqueVisitors') && (
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorVisitors)"
              name="Unique Visitors"
            />
          )}
          {(selectedMetric === 'all' || selectedMetric === 'sessions') && (
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#F59E0B"
              fillOpacity={1}
              fill="url(#colorSessions)"
              name="Sessions"
            />
          )}
        </AreaChart>
      )
    }

    return (
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis
          dataKey="formattedDate"
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#9CA3AF"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: 'none',
            borderRadius: '8px',
            color: '#F9FAFB',
          }}
          labelStyle={{ color: '#9CA3AF' }}
        />
        <Legend />
        {(selectedMetric === 'all' || selectedMetric === 'pageviews') && (
          <Line
            type="monotone"
            dataKey="pageviews"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            name="Pageviews"
          />
        )}
        {(selectedMetric === 'all' || selectedMetric === 'uniqueVisitors') && (
          <Line
            type="monotone"
            dataKey="uniqueVisitors"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            name="Unique Visitors"
          />
        )}
        {(selectedMetric === 'all' || selectedMetric === 'sessions') && (
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            name="Sessions"
          />
        )}
      </LineChart>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Traffic Overview</h3>
        <div className="flex items-center gap-2">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Metrics</option>
            <option value="pageviews">Pageviews</option>
            <option value="uniqueVisitors">Unique Visitors</option>
            <option value="sessions">Sessions</option>
          </select>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                chartType === 'line'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available for the selected period
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
