import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/analytics/realtime
 * Get real-time analytics data (last 24 hours, last hour, etc.)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const window = searchParams.get('window') || '24h' // 1h, 24h

    const payload = await getPayload({ config: configPromise })

    // Calculate time window
    const now = new Date()
    const windowStart = new Date()

    switch (window) {
      case '1h':
        windowStart.setHours(windowStart.getHours() - 1)
        break
      case '24h':
      default:
        windowStart.setHours(windowStart.getHours() - 24)
        break
    }

    // Get recent events
    const recentEvents = await payload.find({
      collection: 'analytics-events',
      where: {
        serverTimestamp: { greater_than_equal: windowStart.toISOString() },
      },
      limit: 10000,
      depth: 0,
    })

    // Calculate metrics from events
    const sessions = new Set<string>()
    const pageViews = recentEvents.docs.filter((e) => e.event === 'page_view')
    const formSubmissions = recentEvents.docs.filter((e) => e.event === 'form_submission')
    const ctaClicks = recentEvents.docs.filter((e) => e.event === 'cta_click')

    recentEvents.docs.forEach((e) => {
      if (e.sessionId) sessions.add(e.sessionId)
    })

    // Traffic sources breakdown
    const trafficSources: Record<string, number> = {}
    pageViews.forEach((pv) => {
      const source =
        ((pv.eventData as Record<string, unknown>)?.trafficSource as string) || 'direct'
      trafficSources[source] = (trafficSources[source] || 0) + 1
    })

    // Device breakdown
    const devices: Record<string, number> = {}
    pageViews.forEach((pv) => {
      const device = pv.deviceType || 'unknown'
      devices[device] = (devices[device] || 0) + 1
    })

    // Top pages in this window
    const pageCounts = new Map<string, number>()
    pageViews.forEach((pv) => {
      const pageSlug =
        ((pv.eventData as Record<string, unknown>)?.postSlug as string) ||
        ((pv.eventData as Record<string, unknown>)?.pageSlug as string) ||
        'unknown'
      pageCounts.set(pageSlug, (pageCounts.get(pageSlug) || 0) + 1)
    })

    const topPages = Array.from(pageCounts.entries())
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Activity timeline (group by hour or minute depending on window)
    const timeline: { time: string; pageviews: number; sessions: number }[] = []

    if (window === '1h') {
      // Group by minute
      for (let i = 0; i < 60; i++) {
        const minuteStart = new Date(windowStart.getTime() + i * 60 * 1000)
        const minuteEnd = new Date(minuteStart.getTime() + 60 * 1000)

        const minuteEvents = recentEvents.docs.filter((e) => {
          const eventTime = new Date(e.serverTimestamp as string)
          return eventTime >= minuteStart && eventTime < minuteEnd
        })

        const minuteSessions = new Set<string>()
        minuteEvents.forEach((e) => {
          if (e.sessionId) minuteSessions.add(e.sessionId)
        })

        timeline.push({
          time: minuteStart.toISOString(),
          pageviews: minuteEvents.filter((e) => e.event === 'page_view').length,
          sessions: minuteSessions.size,
        })
      }
    } else {
      // Group by hour
      for (let i = 0; i < 24; i++) {
        const hourStart = new Date(windowStart.getTime() + i * 60 * 60 * 1000)
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

        const hourEvents = recentEvents.docs.filter((e) => {
          const eventTime = new Date(e.serverTimestamp as string)
          return eventTime >= hourStart && eventTime < hourEnd
        })

        const hourSessions = new Set<string>()
        hourEvents.forEach((e) => {
          if (e.sessionId) hourSessions.add(e.sessionId)
        })

        timeline.push({
          time: hourStart.toISOString(),
          pageviews: hourEvents.filter((e) => e.event === 'page_view').length,
          sessions: hourSessions.size,
        })
      }
    }

    return NextResponse.json({
      window,
      timeRange: {
        from: windowStart.toISOString(),
        to: now.toISOString(),
      },
      metrics: {
        activeVisitors: sessions.size,
        pageviews: pageViews.length,
        formSubmissions: formSubmissions.length,
        ctaClicks: ctaClicks.length,
      },
      trafficSources,
      devices,
      topPages,
      timeline,
    })
  } catch (error) {
    console.error('Error fetching realtime analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch realtime analytics' }, { status: 500 })
  }
}
