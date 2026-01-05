import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/analytics/network
 * Get network-wide analytics data (admin only)
 */
export async function GET(req: NextRequest) {
  try {
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

    // Get network analytics
    const networkAnalytics = await payload.find({
      collection: 'network-analytics',
      where: {
        and: [
          { date: { greater_than_equal: dateFrom.toISOString() } },
          { date: { less_than_equal: dateTo.toISOString() } },
        ],
      },
      sort: '-date',
      limit: 365,
    })

    // Calculate summary
    const summary = networkAnalytics.docs.reduce(
      (acc, doc) => {
        acc.totalPageviews += doc.totalPageviews || 0
        acc.totalUniqueVisitors += doc.totalUniqueVisitors || 0
        acc.totalSessions += doc.totalSessions || 0
        acc.totalLeads += doc.totalLeads || 0
        acc.totalAgentsSigned += doc.totalAgentsSigned || 0
        acc.totalRevenue += doc.totalRevenue || 0
        acc.postsPublished += doc.postsPublishedToday || 0
        return acc
      },
      {
        totalPageviews: 0,
        totalUniqueVisitors: 0,
        totalSessions: 0,
        totalLeads: 0,
        totalAgentsSigned: 0,
        totalRevenue: 0,
        postsPublished: 0,
      },
    )

    // Get current counts
    const [totalAgents, totalPosts, activeAgents] = await Promise.all([
      payload.count({ collection: 'agents' }),
      payload.count({ collection: 'posts', where: { _status: { equals: 'published' } } }),
      // Active agents = agents who have posts in last 30 days
      payload
        .find({
          collection: 'posts',
          where: {
            _status: { equals: 'published' },
            createdAt: { greater_than_equal: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
          },
          limit: 0,
          depth: 0,
        })
        .then((res) => res.totalDocs),
    ])

    // Get latest metrics from most recent day
    const latestDay = networkAnalytics.docs[0]

    return NextResponse.json({
      period,
      dateRange: {
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
      },
      realtime: {
        totalAgents: totalAgents.totalDocs,
        totalPosts: totalPosts.totalDocs,
        activeAgents,
        keywordsRanking: latestDay?.totalKeywordsRanking || 0,
        keywordsTop10: latestDay?.keywordsTop10 || 0,
        keywordsTop3: latestDay?.keywordsTop3 || 0,
        domainAuthority: latestDay?.domainAuthority || 0,
      },
      summary: {
        ...summary,
        avgPageviewsPerDay: Math.round(summary.totalPageviews / networkAnalytics.docs.length) || 0,
        conversionRate: summary.totalPageviews > 0
          ? ((summary.totalLeads / summary.totalPageviews) * 100).toFixed(2)
          : '0.00',
      },
      dailyData: networkAnalytics.docs,
    })
  } catch (error) {
    console.error('Error fetching network analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 },
    )
  }
}
