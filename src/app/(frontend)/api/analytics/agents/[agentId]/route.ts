import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/analytics/agents/:agentId
 * Get analytics data for a specific agent
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> },
) {
  try {
    const { agentId } = await params
    const { searchParams } = new URL(req.url)

    const period = searchParams.get('period') || '30d'

    const payload = await getPayload({ config: configPromise })

    // Calculate date range
    let dateFrom = new Date()
    const dateTo = new Date()

    switch (period) {
      case '7d':
        dateFrom.setDate(dateFrom.getDate() - 7)
        break
      case '30d':
        dateFrom.setDate(dateFrom.getDate() - 30)
        break
      case '90d':
        dateFrom.setDate(dateFrom.getDate() - 90)
        break
      case '1y':
        dateFrom.setFullYear(dateFrom.getFullYear() - 1)
        break
      default:
        dateFrom.setDate(dateFrom.getDate() - 30)
    }

    // Get agent analytics
    const agentAnalytics = await payload.find({
      collection: 'agent-analytics',
      where: {
        and: [
          { agent: { equals: agentId } },
          { date: { greater_than_equal: dateFrom.toISOString() } },
          { date: { less_than_equal: dateTo.toISOString() } },
        ],
      },
      sort: '-date',
      limit: 365,
    })

    // Get agent's posts
    const agentPosts = await payload.find({
      collection: 'posts',
      where: {
        'authors.value': { equals: agentId },
      },
      limit: 1000,
      depth: 0,
    })

    const postIds = agentPosts.docs.map((p) => p.id)

    // Get post analytics for all agent's posts
    const postAnalytics = await payload.find({
      collection: 'post-analytics',
      where: {
        and: [
          { post: { in: postIds } },
          { date: { greater_than_equal: dateFrom.toISOString() } },
        ],
      },
      sort: '-pageviews',
      limit: 1000,
    })

    // Calculate summary from agent analytics
    const agentSummary = agentAnalytics.docs.reduce(
      (acc, doc) => {
        acc.totalPageviews += doc.totalPageviews || 0
        acc.totalUniqueVisitors += doc.uniqueVisitors || 0
        acc.totalSessions += doc.sessions || 0
        acc.totalLeads += doc.leadsGenerated || 0
        acc.totalFormSubmissions += doc.formSubmissions || 0
        return acc
      },
      {
        totalPageviews: 0,
        totalUniqueVisitors: 0,
        totalSessions: 0,
        totalLeads: 0,
        totalFormSubmissions: 0,
      },
    )

    // Get top performing posts
    const postSummaries = new Map<string, { pageviews: number; leads: number }>()
    postAnalytics.docs.forEach((doc) => {
      const postId = typeof doc.post === 'number' ? String(doc.post) : doc.post?.id?.toString()
      if (!postId) return

      const existing = postSummaries.get(postId) || { pageviews: 0, leads: 0 }
      postSummaries.set(postId, {
        pageviews: existing.pageviews + (doc.pageviews || 0),
        leads: existing.leads + (doc.leadsGenerated || 0),
      })
    })

    // Sort and get top 10
    const topPosts = Array.from(postSummaries.entries())
      .map(([postId, stats]) => {
        const post = agentPosts.docs.find((p) => p.id === postId)
        return {
          id: postId,
          title: post?.title || 'Unknown',
          slug: post?.slug,
          pageviews: stats.pageviews,
          leads: stats.leads,
          conversionRate: stats.pageviews > 0
            ? ((stats.leads / stats.pageviews) * 100).toFixed(2)
            : '0.00',
        }
      })
      .sort((a, b) => b.pageviews - a.pageviews)
      .slice(0, 10)

    return NextResponse.json({
      agentId,
      period,
      dateRange: {
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
      },
      summary: {
        ...agentSummary,
        totalPosts: agentPosts.totalDocs,
        conversionRate: agentSummary.totalPageviews > 0
          ? ((agentSummary.totalLeads / agentSummary.totalPageviews) * 100).toFixed(2)
          : '0.00',
      },
      topPosts,
      dailyData: agentAnalytics.docs,
    })
  } catch (error) {
    console.error('Error fetching agent analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 },
    )
  }
}
