/**
 * Analytics Aggregation Script
 *
 * This script aggregates raw analytics events into daily summaries for:
 * - Post Analytics
 * - Agent Analytics
 * - Network Analytics
 *
 * Run this daily via cron job at 2am:
 * npx tsx src/scripts/aggregate-analytics.ts
 *
 * Or trigger via Payload jobs API:
 * POST /api/payload-jobs/run with Authorization header
 */

import { getPayload } from 'payload'
import config from '@payload-config'

interface EventData {
  trafficSource?: string
  depth?: number
  duration?: number
  timeOnPage?: number
  maxScrollDepth?: number
  metric?: string
  value?: number
  postSlug?: string
  [key: string]: unknown
}

async function aggregatePostAnalytics(
  payload: Awaited<ReturnType<typeof getPayload>>,
  date: Date,
): Promise<void> {
  const dateStr = date.toISOString().split('T')[0]
  const startOfDay = new Date(dateStr + 'T00:00:00.000Z')
  const endOfDay = new Date(dateStr + 'T23:59:59.999Z')

  console.log(`Aggregating post analytics for ${dateStr}...`)

  // Get all events for the day
  const events = await payload.find({
    collection: 'analytics-events',
    where: {
      and: [
        { serverTimestamp: { greater_than_equal: startOfDay.toISOString() } },
        { serverTimestamp: { less_than_equal: endOfDay.toISOString() } },
        { postId: { exists: true } },
      ],
    },
    limit: 100000,
    depth: 0,
  })

  // Group events by post
  const postGroups = new Map<string, typeof events.docs>()

  events.docs.forEach((event) => {
    const postId = typeof event.postId === 'string' ? event.postId : typeof event.postId === 'number' ? String(event.postId) : (event.postId as unknown as { id: string })?.id
    if (!postId) return

    if (!postGroups.has(postId)) {
      postGroups.set(postId, [])
    }
    postGroups.get(postId)!.push(event)
  })

  // Aggregate for each post
  for (const [postId, postEvents] of postGroups) {
    const pageViews = postEvents.filter((e) => e.event === 'page_view')
    const sessions = new Set(postEvents.map((e) => e.sessionId))
    const _scrollEvents = postEvents.filter((e) => e.event === 'scroll_depth')
    const _timeEvents = postEvents.filter((e) => e.event === 'time_on_page')
    const formEvents = postEvents.filter((e) => e.event === 'form_submission')
    const downloadEvents = postEvents.filter((e) => e.event === 'download')
    const videoEvents = postEvents.filter((e) => e.event === 'video_play')
    const linkEvents = postEvents.filter((e) => e.event === 'link_click')
    const ctaEvents = postEvents.filter((e) => e.event === 'cta_click')
    const shareEvents = postEvents.filter((e) => e.event === 'share')
    const exitEvents = postEvents.filter((e) => e.event === 'page_exit')
    const cwvEvents = postEvents.filter((e) => e.event === 'core_web_vitals')

    // Calculate traffic sources
    let organicTraffic = 0
    let directTraffic = 0
    let referralTraffic = 0
    let socialTraffic = 0
    let emailTraffic = 0
    let paidTraffic = 0

    pageViews.forEach((pv) => {
      const source = (pv.eventData as EventData)?.trafficSource || 'direct'
      switch (source) {
        case 'organic':
          organicTraffic++
          break
        case 'direct':
          directTraffic++
          break
        case 'referral':
          referralTraffic++
          break
        case 'social':
          socialTraffic++
          break
        case 'email':
          emailTraffic++
          break
        case 'paid':
          paidTraffic++
          break
      }
    })

    // Calculate averages
    const maxScrollDepths = exitEvents
      .map((e) => (e.eventData as EventData)?.maxScrollDepth)
      .filter((d): d is number => d !== undefined && d !== null)

    const avgScrollDepth = maxScrollDepths.length > 0
      ? maxScrollDepths.reduce((sum, d) => sum + d, 0) / maxScrollDepths.length
      : undefined

    const timeOnPages = exitEvents
      .map((e) => (e.eventData as EventData)?.timeOnPage)
      .filter((t): t is number => t !== undefined && t !== null)

    const avgTimeOnPage = timeOnPages.length > 0
      ? timeOnPages.reduce((sum, t) => sum + t, 0) / timeOnPages.length
      : undefined

    // Calculate bounce rate (sessions with only 1 page view and <10s time)
    const sessionPageCounts = new Map<string, number>()
    const sessionTimes = new Map<string, number>()

    pageViews.forEach((pv) => {
      sessionPageCounts.set(pv.sessionId, (sessionPageCounts.get(pv.sessionId) || 0) + 1)
    })

    exitEvents.forEach((e) => {
      const time = (e.eventData as EventData)?.timeOnPage || 0
      sessionTimes.set(e.sessionId, time)
    })

    let bounces = 0
    sessions.forEach((sessionId) => {
      const pageCount = sessionPageCounts.get(sessionId) || 0
      const time = sessionTimes.get(sessionId) || 0
      if (pageCount === 1 && time < 10) {
        bounces++
      }
    })

    const bounceRate = sessions.size > 0 ? (bounces / sessions.size) * 100 : undefined

    // Core Web Vitals averages
    const lcpValues = cwvEvents
      .filter((e) => (e.eventData as EventData)?.metric === 'LCP')
      .map((e) => (e.eventData as EventData)?.value)
      .filter((v): v is number => v !== undefined && v !== null)

    const fidValues = cwvEvents
      .filter((e) => (e.eventData as EventData)?.metric === 'FID')
      .map((e) => (e.eventData as EventData)?.value)
      .filter((v): v is number => v !== undefined && v !== null)

    const clsValues = cwvEvents
      .filter((e) => (e.eventData as EventData)?.metric === 'CLS')
      .map((e) => (e.eventData as EventData)?.value)
      .filter((v): v is number => v !== undefined && v !== null)

    const avgLcp = lcpValues.length > 0
      ? lcpValues.reduce((sum, v) => sum + v, 0) / lcpValues.length
      : undefined

    const avgFid = fidValues.length > 0
      ? fidValues.reduce((sum, v) => sum + v, 0) / fidValues.length
      : undefined

    const avgCls = clsValues.length > 0
      ? clsValues.reduce((sum, v) => sum + v, 0) / clsValues.length
      : undefined

    // Upsert post analytics
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
      post: parseInt(postId, 10),
      date: startOfDay.toISOString(),
      pageviews: pageViews.length,
      uniqueVisitors: sessions.size,
      sessions: sessions.size,
      avgTimeOnPage,
      avgScrollDepth,
      bounceRate,
      organicTraffic,
      directTraffic,
      referralTraffic,
      socialTraffic,
      emailTraffic,
      paidTraffic,
      formSubmissions: formEvents.length,
      downloads: downloadEvents.length,
      videoPlays: videoEvents.length,
      linkClicks: linkEvents.length,
      ctaClicks: ctaEvents.length,
      shares: shareEvents.length,
      avgLcp,
      avgFid,
      avgCls,
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
  }

  console.log(`Aggregated analytics for ${postGroups.size} posts`)
}

async function aggregateAgentAnalytics(
  payload: Awaited<ReturnType<typeof getPayload>>,
  date: Date,
): Promise<void> {
  const dateStr = date.toISOString().split('T')[0]
  const startOfDay = new Date(dateStr + 'T00:00:00.000Z')
  const _endOfDay = new Date(dateStr + 'T23:59:59.999Z')

  console.log(`Aggregating agent analytics for ${dateStr}...`)

  // Get all post analytics for the day
  const postAnalytics = await payload.find({
    collection: 'post-analytics',
    where: {
      date: { equals: startOfDay.toISOString() },
    },
    limit: 100000,
    depth: 1,
  })

  // Get post -> agent mapping
  const postAgentMap = new Map<string, string>()
  const postIds = postAnalytics.docs.map((pa) =>
    typeof pa.post === 'string' ? pa.post : typeof pa.post === 'number' ? String(pa.post) : String(pa.post?.id),
  ).filter(Boolean) as string[]

  if (postIds.length === 0) {
    console.log('No post analytics to aggregate for agents')
    return
  }

  const posts = await payload.find({
    collection: 'posts',
    where: {
      id: { in: postIds },
    },
    limit: 100000,
    depth: 1,
  })

  posts.docs.forEach((post) => {
    // Get first author as the agent
    const authors = post.authors as Array<{ value: { id: string } | string }> | undefined
    if (authors && authors.length > 0) {
      const author = authors[0]
      const agentId = typeof author.value === 'string' ? author.value : author.value?.id
      if (agentId) {
        postAgentMap.set(String(post.id), String(agentId))
      }
    }
  })

  // Group post analytics by agent
  const agentGroups = new Map<string, typeof postAnalytics.docs>()

  postAnalytics.docs.forEach((pa) => {
    const postId = typeof pa.post === 'string' ? pa.post : typeof pa.post === 'number' ? String(pa.post) : String(pa.post?.id)
    if (!postId) return

    const agentId = postAgentMap.get(postId)
    if (!agentId) return

    if (!agentGroups.has(agentId)) {
      agentGroups.set(agentId, [])
    }
    agentGroups.get(agentId)!.push(pa)
  })

  // Aggregate for each agent
  for (const [agentId, agentPostAnalytics] of agentGroups) {
    let totalPageviews = 0
    let uniqueVisitors = 0
    let sessions = 0
    let organicTraffic = 0
    let directTraffic = 0
    let referralTraffic = 0
    let socialTraffic = 0
    let leadsGenerated = 0
    let formSubmissions = 0

    let topPostId: string | undefined
    let topPostViews = 0

    agentPostAnalytics.forEach((pa) => {
      totalPageviews += pa.pageviews || 0
      uniqueVisitors += pa.uniqueVisitors || 0
      sessions += pa.sessions || 0
      organicTraffic += pa.organicTraffic || 0
      directTraffic += pa.directTraffic || 0
      referralTraffic += pa.referralTraffic || 0
      socialTraffic += pa.socialTraffic || 0
      leadsGenerated += pa.leadsGenerated || 0
      formSubmissions += pa.formSubmissions || 0

      if ((pa.pageviews || 0) > topPostViews) {
        topPostViews = pa.pageviews || 0
        topPostId = typeof pa.post === 'string' ? pa.post : typeof pa.post === 'number' ? String(pa.post) : String(pa.post?.id)
      }
    })

    // Upsert agent analytics
    const existingAnalytics = await payload.find({
      collection: 'agent-analytics',
      where: {
        and: [
          { agent: { equals: agentId } },
          { date: { equals: startOfDay.toISOString() } },
        ],
      },
      limit: 1,
    })

    const analyticsData = {
      agent: parseInt(agentId, 10),
      date: startOfDay.toISOString(),
      totalPageviews,
      uniqueVisitors,
      sessions,
      organicTraffic,
      directTraffic,
      referralTraffic,
      socialTraffic,
      leadsGenerated,
      formSubmissions,
      topPost: topPostId ? parseInt(topPostId, 10) : undefined,
      topPostViews,
    }

    if (existingAnalytics.docs.length > 0) {
      await payload.update({
        collection: 'agent-analytics',
        id: existingAnalytics.docs[0].id,
        data: analyticsData,
      })
    } else {
      await payload.create({
        collection: 'agent-analytics',
        data: analyticsData,
      })
    }
  }

  console.log(`Aggregated analytics for ${agentGroups.size} agents`)
}

async function aggregateNetworkAnalytics(
  payload: Awaited<ReturnType<typeof getPayload>>,
  date: Date,
): Promise<void> {
  const dateStr = date.toISOString().split('T')[0]
  const startOfDay = new Date(dateStr + 'T00:00:00.000Z')

  console.log(`Aggregating network analytics for ${dateStr}...`)

  // Get all post analytics for the day
  const postAnalytics = await payload.find({
    collection: 'post-analytics',
    where: {
      date: { equals: startOfDay.toISOString() },
    },
    limit: 100000,
    depth: 0,
  })

  // Calculate totals
  let totalPageviews = 0
  let totalUniqueVisitors = 0
  let totalSessions = 0
  let totalLeads = 0

  postAnalytics.docs.forEach((pa) => {
    totalPageviews += pa.pageviews || 0
    totalUniqueVisitors += pa.uniqueVisitors || 0
    totalSessions += pa.sessions || 0
    totalLeads += pa.leadsGenerated || 0
  })

  // Get counts
  const [totalPosts, totalAgents, postsToday] = await Promise.all([
    payload.count({ collection: 'posts', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'agents' }),
    payload.count({
      collection: 'posts',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { publishedAt: { greater_than_equal: startOfDay.toISOString() } },
        ],
      },
    }),
  ])

  // Upsert network analytics
  const existingAnalytics = await payload.find({
    collection: 'network-analytics',
    where: {
      date: { equals: startOfDay.toISOString() },
    },
    limit: 1,
  })

  const avgPageviewsPerPost = postAnalytics.docs.length > 0
    ? totalPageviews / postAnalytics.docs.length
    : 0

  const analyticsData = {
    date: startOfDay.toISOString(),
    totalPageviews,
    totalUniqueVisitors,
    totalSessions,
    totalPosts: totalPosts.totalDocs,
    postsPublishedToday: postsToday.totalDocs,
    avgPageviewsPerPost,
    totalAgents: totalAgents.totalDocs,
    totalLeads,
  }

  if (existingAnalytics.docs.length > 0) {
    await payload.update({
      collection: 'network-analytics',
      id: existingAnalytics.docs[0].id,
      data: analyticsData,
    })
  } else {
    await payload.create({
      collection: 'network-analytics',
      data: analyticsData,
    })
  }

  console.log(`Network analytics aggregated: ${totalPageviews} pageviews, ${totalLeads} leads`)
}

async function main(): Promise<void> {
  console.log('Starting analytics aggregation...')

  const payload = await getPayload({ config })

  // Get date to aggregate (default: yesterday)
  const dateArg = process.argv[2]
  let aggregationDate: Date

  if (dateArg) {
    aggregationDate = new Date(dateArg)
  } else {
    aggregationDate = new Date()
    aggregationDate.setDate(aggregationDate.getDate() - 1)
  }

  console.log(`Aggregation date: ${aggregationDate.toISOString().split('T')[0]}`)

  try {
    // Aggregate in order
    await aggregatePostAnalytics(payload, aggregationDate)
    await aggregateAgentAnalytics(payload, aggregationDate)
    await aggregateNetworkAnalytics(payload, aggregationDate)

    console.log('✅ Analytics aggregation completed successfully!')
  } catch (error) {
    console.error('❌ Analytics aggregation failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
