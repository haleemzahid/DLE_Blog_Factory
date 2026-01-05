'use client'

import React from 'react'

interface GeographyMapProps {
  data?: Array<{
    country: string
    visitors: number
    percentage: number
  }>
  loading?: boolean
}

// Country code to flag emoji mapping (using regional indicator symbols)
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

// Country code to full name
const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  IN: 'India',
  BR: 'Brazil',
  JP: 'Japan',
  PK: 'Pakistan',
  NL: 'Netherlands',
  IT: 'Italy',
  ES: 'Spain',
  MX: 'Mexico',
  KR: 'South Korea',
  RU: 'Russia',
  CN: 'China',
  SG: 'Singapore',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  ZA: 'South Africa',
  NG: 'Nigeria',
  EG: 'Egypt',
  PH: 'Philippines',
  ID: 'Indonesia',
  MY: 'Malaysia',
  TH: 'Thailand',
  VN: 'Vietnam',
  TR: 'Turkey',
  PL: 'Poland',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  BE: 'Belgium',
  CH: 'Switzerland',
  AT: 'Austria',
  IE: 'Ireland',
  NZ: 'New Zealand',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  BD: 'Bangladesh',
  UA: 'Ukraine',
  CZ: 'Czech Republic',
  RO: 'Romania',
  HU: 'Hungary',
  GR: 'Greece',
  PT: 'Portugal',
  IL: 'Israel',
}

export function GeographyMap({ data, loading }: GeographyMapProps) {
  const maxVisitors = data ? Math.max(...data.map((d) => d.visitors)) : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Visitors by Country
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {data?.length || 0} countries
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No geographic data available</p>
          <p className="text-xs mt-1">Country data will appear once tracking is active</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.slice(0, 12).map((country, index) => {
            const barWidth = maxVisitors > 0 ? (country.visitors / maxVisitors) * 100 : 0

            return (
              <div
                key={country.country}
                className="relative p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Rank badge */}
                <div className="absolute top-2 right-2">
                  <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getCountryFlag(country.country)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {COUNTRY_NAMES[country.country] || country.country}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {country.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {country.visitors.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {country.percentage.toFixed(1)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {data && data.length > 12 && (
        <div className="mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View all {data.length} countries
          </button>
        </div>
      )}
    </div>
  )
}
