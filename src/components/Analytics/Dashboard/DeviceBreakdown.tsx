'use client'

import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

interface DeviceBreakdownProps {
  devices?: {
    desktop: number
    mobile: number
    tablet: number
  }
  browsers?: Array<{
    name: string
    visitors: number
    percentage: number
  }>
  loading?: boolean
}

type Tab = 'devices' | 'browsers'

const DEVICE_COLORS = {
  desktop: '#3B82F6',
  mobile: '#10B981',
  tablet: '#F59E0B',
}

const DEVICE_ICONS = {
  desktop: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  mobile: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  tablet: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
}

const BROWSER_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export function DeviceBreakdown({ devices, browsers, loading }: DeviceBreakdownProps) {
  const [activeTab, setActiveTab] = useState<Tab>('devices')

  const totalDevices = devices ? devices.desktop + devices.mobile + devices.tablet : 0

  const deviceData = devices
    ? [
        {
          name: 'Desktop',
          value: devices.desktop,
          percentage: totalDevices > 0 ? (devices.desktop / totalDevices) * 100 : 0,
          color: DEVICE_COLORS.desktop,
          icon: DEVICE_ICONS.desktop,
        },
        {
          name: 'Mobile',
          value: devices.mobile,
          percentage: totalDevices > 0 ? (devices.mobile / totalDevices) * 100 : 0,
          color: DEVICE_COLORS.mobile,
          icon: DEVICE_ICONS.mobile,
        },
        {
          name: 'Tablet',
          value: devices.tablet,
          percentage: totalDevices > 0 ? (devices.tablet / totalDevices) * 100 : 0,
          color: DEVICE_COLORS.tablet,
          icon: DEVICE_ICONS.tablet,
        },
      ]
    : []

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab('devices')}
          className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
            activeTab === 'devices'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Devices
        </button>
        <button
          onClick={() => setActiveTab('browsers')}
          className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
            activeTab === 'browsers'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Browsers
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : activeTab === 'devices' ? (
        <div className="space-y-4">
          {deviceData.map((device) => (
            <div key={device.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  {device.icon}
                  <span className="text-sm">{device.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({device.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${device.percentage}%`,
                    backgroundColor: device.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {browsers && browsers.length > 0 ? (
            browsers.slice(0, 6).map((browser, index) => (
              <div key={browser.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{browser.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {browser.visitors.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({browser.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${browser.percentage}%`,
                      backgroundColor: BROWSER_COLORS[index % BROWSER_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No browser data available
            </div>
          )}
        </div>
      )}
    </div>
  )
}
