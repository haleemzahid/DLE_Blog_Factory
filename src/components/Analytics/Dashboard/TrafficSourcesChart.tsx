'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface TrafficSourcesChartProps {
  data?: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  loading?: boolean
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

const SOURCE_LABELS: Record<string, string> = {
  organic: 'Organic Search',
  direct: 'Direct',
  referral: 'Referral',
  social: 'Social',
  email: 'Email',
  paid: 'Paid',
}

export function TrafficSourcesChart({ data, loading }: TrafficSourcesChartProps) {
  const formattedData = data?.map((item, index) => ({
    ...item,
    name: SOURCE_LABELS[item.source] || item.source,
    color: COLORS[index % COLORS.length],
  }))

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; visitors: number; percentage: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-700">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-300 text-sm">{data.visitors.toLocaleString()} visitors</p>
          <p className="text-gray-400 text-sm">{data.percentage.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Traffic Sources</h3>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available
        </div>
      ) : (
        <>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="visitors"
                >
                  {formattedData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {formattedData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
