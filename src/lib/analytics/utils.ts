/**
 * Analytics Utility Functions
 * Helper functions for analytics calculations and data processing
 */

/**
 * Calculate position-based attribution for a user journey
 * 40% first touch, 40% last touch, 20% distributed among middle touches
 */
export interface Touchpoint {
  postId: string
  timestamp: string
  position: number
}

export interface AttributedPost {
  postId: string
  attributionPercent: number
  revenue: number
}

export function calculateAttribution(
  touchpoints: Touchpoint[],
  conversionValue: number,
): AttributedPost[] {
  if (touchpoints.length === 0) return []

  if (touchpoints.length === 1) {
    return [
      {
        postId: touchpoints[0].postId,
        attributionPercent: 100,
        revenue: conversionValue,
      },
    ]
  }

  const firstPost = touchpoints[0]
  const lastPost = touchpoints[touchpoints.length - 1]
  const middlePosts = touchpoints.slice(1, -1)

  const attributed: AttributedPost[] = []

  // First touch: 40%
  attributed.push({
    postId: firstPost.postId,
    attributionPercent: 40,
    revenue: conversionValue * 0.4,
  })

  // Last touch: 40%
  if (lastPost.postId !== firstPost.postId) {
    attributed.push({
      postId: lastPost.postId,
      attributionPercent: 40,
      revenue: conversionValue * 0.4,
    })
  } else {
    // If first and last are same, give them 80%
    attributed[0].attributionPercent = 80
    attributed[0].revenue = conversionValue * 0.8
  }

  // Middle touches: Split remaining 20%
  if (middlePosts.length > 0) {
    const middlePercent = 20 / middlePosts.length
    middlePosts.forEach((post) => {
      attributed.push({
        postId: post.postId,
        attributionPercent: middlePercent,
        revenue: conversionValue * (middlePercent / 100),
      })
    })
  }

  return attributed
}

/**
 * Calculate time decay attribution
 * More recent touchpoints get more credit
 */
export function calculateTimeDecayAttribution(
  touchpoints: Touchpoint[],
  conversionValue: number,
  halfLifeDays: number = 7,
): AttributedPost[] {
  if (touchpoints.length === 0) return []

  const conversionTime = new Date(touchpoints[touchpoints.length - 1].timestamp).getTime()
  const halfLifeMs = halfLifeDays * 24 * 60 * 60 * 1000

  // Calculate decay weights
  const weights = touchpoints.map((tp) => {
    const touchTime = new Date(tp.timestamp).getTime()
    const timeDiff = conversionTime - touchTime
    return Math.pow(0.5, timeDiff / halfLifeMs)
  })

  // Normalize weights
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  const normalizedWeights = weights.map((w) => w / totalWeight)

  return touchpoints.map((tp, i) => ({
    postId: tp.postId,
    attributionPercent: normalizedWeights[i] * 100,
    revenue: conversionValue * normalizedWeights[i],
  }))
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(
  conversions: number,
  visitors: number,
): number {
  if (visitors === 0) return 0
  return (conversions / visitors) * 100
}

/**
 * Calculate bounce rate from events
 */
export function calculateBounceRate(
  singlePageSessions: number,
  totalSessions: number,
): number {
  if (totalSessions === 0) return 0
  return (singlePageSessions / totalSessions) * 100
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return value.toFixed(decimals) + '%'
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Calculate percentage change between two values
 */
export function calculateChange(
  current: number,
  previous: number,
): { value: number; direction: 'up' | 'down' | 'same' } {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, direction: current > 0 ? 'up' : 'same' }
  }
  const change = ((current - previous) / previous) * 100
  return {
    value: Math.abs(change),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
  }
}

/**
 * Group analytics data by period
 */
export function groupByPeriod<T extends { date: string }>(
  data: T[],
  period: 'day' | 'week' | 'month',
): Map<string, T[]> {
  const grouped = new Map<string, T[]>()

  data.forEach((item) => {
    const date = new Date(item.date)
    let key: string

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0]
        break
      case 'week':
        // Get start of week (Sunday)
        const startOfWeek = new Date(date)
        startOfWeek.setDate(date.getDate() - date.getDay())
        key = startOfWeek.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
    }

    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(item)
  })

  return grouped
}

/**
 * Calculate moving average for trend analysis
 */
export function calculateMovingAverage(
  values: number[],
  window: number = 7,
): number[] {
  const result: number[] = []

  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1)
    const windowValues = values.slice(start, i + 1)
    const average = windowValues.reduce((sum, v) => sum + v, 0) / windowValues.length
    result.push(average)
  }

  return result
}

/**
 * Detect anomalies in data using standard deviation
 */
export function detectAnomalies(
  values: number[],
  threshold: number = 2,
): { index: number; value: number; zscore: number }[] {
  if (values.length < 3) return []

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2))
  const stdDev = Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length)

  if (stdDev === 0) return []

  const anomalies: { index: number; value: number; zscore: number }[] = []

  values.forEach((value, index) => {
    const zscore = (value - mean) / stdDev
    if (Math.abs(zscore) > threshold) {
      anomalies.push({ index, value, zscore })
    }
  })

  return anomalies
}

/**
 * Calculate funnel conversion rates
 */
export interface FunnelStep {
  name: string
  count: number
}

export interface FunnelResult {
  steps: Array<{
    name: string
    count: number
    conversionRate: number
    dropoffRate: number
  }>
  overallConversionRate: number
}

export function calculateFunnelMetrics(steps: FunnelStep[]): FunnelResult {
  if (steps.length === 0) {
    return { steps: [], overallConversionRate: 0 }
  }

  const resultSteps = steps.map((step, index) => {
    const prevCount = index > 0 ? steps[index - 1].count : step.count
    const conversionRate = prevCount > 0 ? (step.count / prevCount) * 100 : 0
    const dropoffRate = 100 - conversionRate

    return {
      name: step.name,
      count: step.count,
      conversionRate,
      dropoffRate: index === 0 ? 0 : dropoffRate,
    }
  })

  const overallConversionRate =
    steps[0].count > 0
      ? (steps[steps.length - 1].count / steps[0].count) * 100
      : 0

  return {
    steps: resultSteps,
    overallConversionRate,
  }
}

/**
 * Generate date range for analytics queries
 */
export function getDateRange(
  period: '7d' | '30d' | '90d' | '1y' | 'custom',
  customStart?: Date,
  customEnd?: Date,
): { start: Date; end: Date } {
  const end = customEnd || new Date()
  let start: Date

  switch (period) {
    case '7d':
      start = new Date(end)
      start.setDate(start.getDate() - 7)
      break
    case '30d':
      start = new Date(end)
      start.setDate(start.getDate() - 30)
      break
    case '90d':
      start = new Date(end)
      start.setDate(start.getDate() - 90)
      break
    case '1y':
      start = new Date(end)
      start.setFullYear(start.getFullYear() - 1)
      break
    case 'custom':
      start = customStart || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
  }

  return { start, end }
}
