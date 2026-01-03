import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/cron/aggregate-analytics
 *
 * Cron endpoint to aggregate daily analytics data
 * Should be triggered daily at 2am via Vercel Cron
 *
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/aggregate-analytics",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */
export async function GET(req: NextRequest) {
  // Verify authorization
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    // Get yesterday's date
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().split('T')[0]
    const startOfDay = new Date(dateStr + 'T00:00:00.000Z')
    const endOfDay = new Date(dateStr + 'T23:59:59.999Z')

    payload.logger.info(`Starting analytics aggregation for ${dateStr}`)

    // Get all events for the day
    const events = await payload.find({
      collection: 'analytics-events',
      where: {
        and: [
          { serverTimestamp: { greater_than_equal: startOfDay.toISOString() } },
          { serverTimestamp: { less_than_equal: endOfDay.toISOString() } },
        ],
      },
      limit: 100000,
      depth: 0,
    })

    payload.logger.info(`Found ${events.docs.length} events to aggregate`)

    // Group events by post
    const postGroups = new Map<string, typeof events.docs>()
    events.docs.forEach((event) => {
      const postId = typeof event.postId === 'string' ? event.postId : (event.postId as { id: string })?.id
      if (!postId) return

      if (!postGroups.has(postId)) {
        postGroups.set(postId, [])
      }
      postGroups.get(postId)!.push(event)
    })

    // Aggregate post analytics
    let postsAggregated = 0
    for (const [postId, postEvents] of postGroups) {
      const pageViews = postEvents.filter((e) => e.event === 'page_view')
      const sessions = new Set(postEvents.map((e) => e.sessionId))
      const formEvents = postEvents.filter((e) => e.event === 'form_submission')
      const ctaEvents = postEvents.filter((e) => e.event === 'cta_click')
      const shareEvents = postEvents.filter((e) => e.event === 'share')

      // Check if analytics already exists
      const existingAnalytics = await payload.find({
        collection: 'post-analytics',
        where: {
          and: [
            { post: { equals: postId } },
            { date: { equals: startOfDay.toISOString() } },
          ],
        },
        limit: 1,
      })

      const analyticsData = {
        post: postId,
        date: startOfDay.toISOString(),
        pageviews: pageViews.length,
        uniqueVisitors: sessions.size,
        sessions: sessions.size,
        formSubmissions: formEvents.length,
        ctaClicks: ctaEvents.length,
        shares: shareEvents.length,
      }

      if (existingAnalytics.docs.length > 0) {
        await payload.update({
          collection: 'post-analytics',
          id: existingAnalytics.docs[0].id,
          data: analyticsData,
        })
      } else {
        await payload.create({
          collection: 'post-analytics',
          data: analyticsData,
        })
      }

      postsAggregated++
    }

    // Aggregate network analytics
    let totalPageviews = 0
    let totalSessions = 0
    const allSessions = new Set<string>()

    events.docs.forEach((e) => {
      if (e.event === 'page_view') totalPageviews++
      if (e.sessionId) allSessions.add(e.sessionId)
    })

    totalSessions = allSessions.size

    const [totalPosts, totalAgents] = await Promise.all([
      payload.count({ collection: 'posts', where: { _status: { equals: 'published' } } }),
      payload.count({ collection: 'agents' }),
    ])

    // Upsert network analytics
    const existingNetwork = await payload.find({
      collection: 'network-analytics',
      where: {
        date: { equals: startOfDay.toISOString() },
      },
      limit: 1,
    })

    const networkData = {
      date: startOfDay.toISOString(),
      totalPageviews,
      totalUniqueVisitors: totalSessions,
      totalSessions,
      totalPosts: totalPosts.totalDocs,
      totalAgents: totalAgents.totalDocs,
    }

    if (existingNetwork.docs.length > 0) {
      await payload.update({
        collection: 'network-analytics',
        id: existingNetwork.docs[0].id,
        data: networkData,
      })
    } else {
      await payload.create({
        collection: 'network-analytics',
        data: networkData,
      })
    }

    payload.logger.info(`Analytics aggregation completed: ${postsAggregated} posts, ${totalPageviews} pageviews`)

    return NextResponse.json({
      success: true,
      date: dateStr,
      postsAggregated,
      totalPageviews,
      totalSessions,
    })
  } catch (error) {
    console.error('Analytics aggregation error:', error)
    return NextResponse.json(
      { error: 'Aggregation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
