import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * GET /api/analytics/posts/:postId
 * Get analytics data for a specific post
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { postId } = await params
    const { searchParams } = new URL(req.url)

    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y, all

    const payload = await getPayload({ config: configPromise })

    // Calculate date range
    let dateFrom: Date
    const dateTo = endDate ? new Date(endDate) : new Date()

    if (startDate) {
      dateFrom = new Date(startDate)
    } else {
      dateFrom = new Date()
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
        case 'all':
          dateFrom = new Date('2020-01-01')
          break
        default:
          dateFrom.setDate(dateFrom.getDate() - 30)
      }
    }

    // Get post analytics
    const analytics = await payload.find({
      collection: 'post-analytics',
      where: {
        and: [
          { post: { equals: postId } },
          { date: { greater_than_equal: dateFrom.toISOString() } },
          { date: { less_than_equal: dateTo.toISOString() } },
        ],
      },
      sort: '-date',
      limit: 365,
    })

    // Calculate summary
    const summary = analytics.docs.reduce(
      (acc, doc) => {
        acc.totalPageviews += doc.pageviews || 0
        acc.totalUniqueVisitors += doc.uniqueVisitors || 0
        acc.totalSessions += doc.sessions || 0
        acc.totalLeads += doc.leadsGenerated || 0
        acc.totalFormSubmissions += doc.formSubmissions || 0
        acc.totalShares += doc.shares || 0

        // For averages
        if (doc.avgTimeOnPage) {
          acc.avgTimeOnPageSum += doc.avgTimeOnPage
          acc.avgTimeOnPageCount++
        }
        if (doc.avgScrollDepth) {
          acc.avgScrollDepthSum += doc.avgScrollDepth
          acc.avgScrollDepthCount++
        }
        if (doc.bounceRate) {
          acc.bounceRateSum += doc.bounceRate
          acc.bounceRateCount++
        }

        return acc
      },
      {
        totalPageviews: 0,
        totalUniqueVisitors: 0,
        totalSessions: 0,
        totalLeads: 0,
        totalFormSubmissions: 0,
        totalShares: 0,
        avgTimeOnPageSum: 0,
        avgTimeOnPageCount: 0,
        avgScrollDepthSum: 0,
        avgScrollDepthCount: 0,
        bounceRateSum: 0,
        bounceRateCount: 0,
      },
    )

    return NextResponse.json({
      postId,
      period,
      dateRange: {
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
      },
      summary: {
        totalPageviews: summary.totalPageviews,
        totalUniqueVisitors: summary.totalUniqueVisitors,
        totalSessions: summary.totalSessions,
        totalLeads: summary.totalLeads,
        totalFormSubmissions: summary.totalFormSubmissions,
        totalShares: summary.totalShares,
        avgTimeOnPage: summary.avgTimeOnPageCount > 0
          ? Math.round(summary.avgTimeOnPageSum / summary.avgTimeOnPageCount)
          : 0,
        avgScrollDepth: summary.avgScrollDepthCount > 0
          ? Math.round(summary.avgScrollDepthSum / summary.avgScrollDepthCount)
          : 0,
        avgBounceRate: summary.bounceRateCount > 0
          ? Math.round(summary.bounceRateSum / summary.bounceRateCount)
          : 0,
        conversionRate: summary.totalPageviews > 0
          ? ((summary.totalLeads / summary.totalPageviews) * 100).toFixed(2)
          : '0.00',
      },
      dailyData: analytics.docs,
    })
  } catch (error) {
    console.error('Error fetching post analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 },
    )
  }
}
