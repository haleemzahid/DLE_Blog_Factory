import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/analytics/dashboard
 * Returns aggregated analytics data for the dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    const { searchParams } = new URL(req.url)
    const fromStr = searchParams.get('from')
    const toStr = searchParams.get('to')

    const from = fromStr ? new Date(fromStr) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const to = toStr ? new Date(toStr) : new Date()

    // Calculate comparison period (same duration before the selected range)
    const duration = to.getTime() - from.getTime()
    const comparisonFrom = new Date(from.getTime() - duration)
    const comparisonTo = new Date(from.getTime() - 1)

    // Fetch events for the selected period
    const events = await payload.find({
      collection: 'analytics-events',
      where: {
        and: [
          { serverTimestamp: { greater_than_equal: from.toISOString() } },
          { serverTimestamp: { less_than_equal: to.toISOString() } },
        ],
      },
      limit: 100000,
      depth: 0,
    })

    // Fetch events for comparison period
    const comparisonEvents = await payload.find({
      collection: 'analytics-events',
      where: {
        and: [
          { serverTimestamp: { greater_than_equal: comparisonFrom.toISOString() } },
          { serverTimestamp: { less_than_equal: comparisonTo.toISOString() } },
        ],
      },
      limit: 100000,
      depth: 0,
    })

    // Calculate overview metrics
    const pageViews = events.docs.filter((e) => e.event === 'page_view')
    const sessions = new Set(events.docs.map((e) => e.sessionId))
    const pageExits = events.docs.filter((e) => e.event === 'page_exit')

    const compPageViews = comparisonEvents.docs.filter((e) => e.event === 'page_view')
    const compSessions = new Set(comparisonEvents.docs.map((e) => e.sessionId))

    // Calculate average session duration from page_exit events
    const avgSessionDuration =
      pageExits.length > 0
        ? pageExits.reduce((sum, e) => {
            const eventData = e.eventData as { timeOnPage?: number } | null
            return sum + (eventData?.timeOnPage || 0)
          }, 0) / pageExits.length
        : 0

    const compPageExits = comparisonEvents.docs.filter((e) => e.event === 'page_exit')
    const compAvgSessionDuration =
      compPageExits.length > 0
        ? compPageExits.reduce((sum, e) => {
            const eventData = e.eventData as { timeOnPage?: number } | null
            return sum + (eventData?.timeOnPage || 0)
          }, 0) / compPageExits.length
        : 0

    // Calculate bounce rate (sessions with only one pageview)
    const sessionPageCounts = new Map<string, number>()
    pageViews.forEach((e) => {
      const count = sessionPageCounts.get(e.sessionId) || 0
      sessionPageCounts.set(e.sessionId, count + 1)
    })
    const bouncedSessions = [...sessionPageCounts.values()].filter((c) => c === 1).length
    const bounceRate = sessions.size > 0 ? (bouncedSessions / sessions.size) * 100 : 0

    const compSessionPageCounts = new Map<string, number>()
    compPageViews.forEach((e) => {
      const count = compSessionPageCounts.get(e.sessionId) || 0
      compSessionPageCounts.set(e.sessionId, count + 1)
    })
    const compBouncedSessions = [...compSessionPageCounts.values()].filter((c) => c === 1).length
    const compBounceRate = compSessions.size > 0 ? (compBouncedSessions / compSessions.size) * 100 : 0

    // Pages per session
    const pagesPerSession = sessions.size > 0 ? pageViews.length / sessions.size : 0
    const compPagesPerSession = compSessions.size > 0 ? compPageViews.length / compSessions.size : 0

    // Daily data for charts
    const dailyMap = new Map<
      string,
      { pageviews: number; uniqueVisitors: Set<string>; sessions: Set<string> }
    >()

    pageViews.forEach((e) => {
      const date = new Date(e.serverTimestamp).toISOString().split('T')[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { pageviews: 0, uniqueVisitors: new Set(), sessions: new Set() })
      }
      const day = dailyMap.get(date)!
      day.pageviews++
      if (e.ipAddress) day.uniqueVisitors.add(e.ipAddress)
      day.sessions.add(e.sessionId)
    })

    const dailyData = [...dailyMap.entries()]
      .map(([date, data]) => ({
        date,
        pageviews: data.pageviews,
        uniqueVisitors: data.uniqueVisitors.size,
        sessions: data.sessions.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Traffic sources
    const sourceMap = new Map<string, Set<string>>()
    pageViews.forEach((e) => {
      const eventData = e.eventData as { trafficSource?: string } | null
      const source = eventData?.trafficSource || 'direct'
      if (!sourceMap.has(source)) {
        sourceMap.set(source, new Set())
      }
      sourceMap.get(source)!.add(e.sessionId)
    })

    const totalSourceVisitors = [...sourceMap.values()].reduce((sum, s) => sum + s.size, 0)
    const trafficSources = [...sourceMap.entries()]
      .map(([source, visitors]) => ({
        source,
        visitors: visitors.size,
        percentage: totalSourceVisitors > 0 ? (visitors.size / totalSourceVisitors) * 100 : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)

    // Top pages
    const pageMap = new Map<
      string,
      {
        id: string
        slug: string
        title: string
        pageviews: number
        visitors: Set<string>
        timeOnPage: number[]
        bounces: number
        exits: number
      }
    >()

    pageViews.forEach((e) => {
      const postId = typeof e.postId === 'string' ? e.postId : (e.postId as { id: string } | null)?.id
      if (!postId) return

      const eventData = e.eventData as { postSlug?: string } | null
      const slug = eventData?.postSlug || 'unknown'

      if (!pageMap.has(postId)) {
        pageMap.set(postId, {
          id: postId,
          slug,
          title: slug, // Will be populated from DB
          pageviews: 0,
          visitors: new Set(),
          timeOnPage: [],
          bounces: 0,
          exits: 0,
        })
      }

      const page = pageMap.get(postId)!
      page.pageviews++
      if (e.ipAddress) page.visitors.add(e.ipAddress)
    })

    // Add time on page data from page_exit events
    pageExits.forEach((e) => {
      const postId = typeof e.postId === 'string' ? e.postId : (e.postId as { id: string } | null)?.id
      if (!postId || !pageMap.has(postId)) return

      const eventData = e.eventData as { timeOnPage?: number } | null
      const page = pageMap.get(postId)!
      if (eventData?.timeOnPage) {
        page.timeOnPage.push(eventData.timeOnPage)
      }
      page.exits++
    })

    // Fetch post titles
    const postIds = [...pageMap.keys()]
    if (postIds.length > 0) {
      const posts = await payload.find({
        collection: 'posts',
        where: {
          id: { in: postIds },
        },
        limit: 100,
        depth: 0,
      })

      posts.docs.forEach((post) => {
        if (pageMap.has(post.id)) {
          const page = pageMap.get(post.id)!
          page.title = post.title || page.slug
          page.slug = post.slug || page.slug
        }
      })
    }

    const topPages = [...pageMap.values()]
      .map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        pageviews: page.pageviews,
        uniqueVisitors: page.visitors.size,
        avgTimeOnPage:
          page.timeOnPage.length > 0
            ? page.timeOnPage.reduce((a, b) => a + b, 0) / page.timeOnPage.length
            : 0,
        bounceRate: page.pageviews > 0 ? (page.bounces / page.pageviews) * 100 : 0,
      }))
      .sort((a, b) => b.pageviews - a.pageviews)
      .slice(0, 20)

    // Device breakdown
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 }
    pageViews.forEach((e) => {
      const device = e.deviceType as 'desktop' | 'mobile' | 'tablet'
      if (device && deviceCounts[device] !== undefined) {
        deviceCounts[device]++
      }
    })

    // Browser breakdown
    const browserMap = new Map<string, number>()
    pageViews.forEach((e) => {
      const browser = e.browser || 'Unknown'
      browserMap.set(browser, (browserMap.get(browser) || 0) + 1)
    })

    const totalBrowsers = [...browserMap.values()].reduce((a, b) => a + b, 0)
    const browsers = [...browserMap.entries()]
      .map(([name, visitors]) => ({
        name,
        visitors,
        percentage: totalBrowsers > 0 ? (visitors / totalBrowsers) * 100 : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 6)

    // Country breakdown
    const countryMap = new Map<string, Set<string>>()
    pageViews.forEach((e) => {
      const country = e.country || 'Unknown'
      if (!countryMap.has(country)) {
        countryMap.set(country, new Set())
      }
      countryMap.get(country)!.add(e.sessionId)
    })

    const totalCountryVisitors = [...countryMap.values()].reduce((sum, s) => sum + s.size, 0)
    const countries = [...countryMap.entries()]
      .filter(([country]) => country !== 'Unknown')
      .map(([country, visitors]) => ({
        country,
        visitors: visitors.size,
        percentage: totalCountryVisitors > 0 ? (visitors.size / totalCountryVisitors) * 100 : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)

    // Real-time data (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const realtimeEvents = await payload.find({
      collection: 'analytics-events',
      where: {
        and: [
          { event: { equals: 'page_view' } },
          { serverTimestamp: { greater_than_equal: oneHourAgo.toISOString() } },
        ],
      },
      limit: 10000,
      depth: 0,
    })

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    const activeUsers = new Set(
      realtimeEvents.docs
        .filter((e) => new Date(e.serverTimestamp) >= fiveMinutesAgo)
        .map((e) => e.sessionId),
    ).size

    // Find most active page in last hour
    const realtimePageCounts = new Map<string, number>()
    realtimeEvents.docs.forEach((e) => {
      const eventData = e.eventData as { postSlug?: string } | null
      const slug = eventData?.postSlug || 'homepage'
      realtimePageCounts.set(slug, (realtimePageCounts.get(slug) || 0) + 1)
    })

    let topActivePage = ''
    let maxPageviews = 0
    realtimePageCounts.forEach((count, slug) => {
      if (count > maxPageviews) {
        maxPageviews = count
        topActivePage = slug
      }
    })

    return NextResponse.json({
      overview: {
        pageviews: pageViews.length,
        uniqueVisitors: new Set(pageViews.map((e) => e.ipAddress).filter(Boolean)).size,
        sessions: sessions.size,
        avgSessionDuration,
        bounceRate,
        pagesPerSession,
      },
      overviewComparison: {
        pageviews: compPageViews.length,
        uniqueVisitors: new Set(compPageViews.map((e) => e.ipAddress).filter(Boolean)).size,
        sessions: compSessions.size,
        avgSessionDuration: compAvgSessionDuration,
        bounceRate: compBounceRate,
        pagesPerSession: compPagesPerSession,
      },
      dailyData,
      trafficSources,
      topPages,
      devices: deviceCounts,
      browsers,
      countries,
      realtime: {
        activeUsers,
        pageviewsLastHour: realtimeEvents.docs.length,
        topActivePage: topActivePage ? `/posts/${topActivePage}` : '/homepage',
      },
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 },
    )
  }
}
