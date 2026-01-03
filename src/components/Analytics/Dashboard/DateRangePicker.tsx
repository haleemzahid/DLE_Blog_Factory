'use client'

import React, { useState, useRef, useEffect } from 'react'
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear } from 'date-fns'

interface DateRangePickerProps {
  from: Date
  to: Date
  onChange: (range: { from: Date; to: Date }) => void
}

type PresetKey = 'today' | '7d' | '30d' | '90d' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom'

const PRESETS: Array<{ key: PresetKey; label: string; getRange: () => { from: Date; to: Date } }> = [
  {
    key: 'today',
    label: 'Today',
    getRange: () => ({ from: new Date(), to: new Date() }),
  },
  {
    key: '7d',
    label: 'Last 7 Days',
    getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    key: '30d',
    label: 'Last 30 Days',
    getRange: () => ({ from: subDays(new Date(), 30), to: new Date() }),
  },
  {
    key: '90d',
    label: 'Last 90 Days',
    getRange: () => ({ from: subDays(new Date(), 90), to: new Date() }),
  },
  {
    key: 'thisMonth',
    label: 'This Month',
    getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }),
  },
  {
    key: 'lastMonth',
    label: 'Last Month',
    getRange: () => ({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    key: 'thisYear',
    label: 'This Year',
    getRange: () => ({ from: startOfYear(new Date()), to: new Date() }),
  },
]

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePreset, setActivePreset] = useState<PresetKey>('7d')
  const [customFrom, setCustomFrom] = useState(format(from, 'yyyy-MM-dd'))
  const [customTo, setCustomTo] = useState(format(to, 'yyyy-MM-dd'))
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePresetSelect = (preset: (typeof PRESETS)[0]) => {
    setActivePreset(preset.key)
    const range = preset.getRange()
    onChange(range)
    setCustomFrom(format(range.from, 'yyyy-MM-dd'))
    setCustomTo(format(range.to, 'yyyy-MM-dd'))
    setIsOpen(false)
  }

  const handleCustomApply = () => {
    setActivePreset('custom')
    onChange({
      from: new Date(customFrom),
      to: new Date(customTo),
    })
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {format(from, 'MMM d')} - {format(to, 'MMM d, yyyy')}
        </span>
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Presets */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">
              Quick Select
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    activePreset === preset.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Range */}
          <div className="p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">
              Custom Range
            </p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">To</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleCustomApply}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Custom Range
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
