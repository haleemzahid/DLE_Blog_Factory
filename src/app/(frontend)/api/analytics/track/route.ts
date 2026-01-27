import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Anonymize IP address for privacy compliance
 * Removes the last octet (IPv4) or last 80 bits (IPv6)
 */
function anonymizeIP(ip: string): string {
  if (!ip) return ''

  // IPv4
  if (ip.includes('.')) {
    return ip.split('.').slice(0, 3).join('.') + '.0'
  }

  // IPv6
  if (ip.includes(':')) {
    const parts = ip.split(':')
    return parts.slice(0, 4).join(':') + '::0'
  }

  return ip
}

/**
 * Get client IP from request headers
 */
function getClientIP(req: NextRequest): string {
  // Check various headers in order of reliability
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = req.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  const cfConnectingIP = req.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  return ''
}

/**
 * Parse user agent for device info
 */
function parseUserAgent(ua: string | null): {
  browser: string
  os: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
} {
  if (!ua) {
    return { browser: 'Unknown', os: 'Unknown', deviceType: 'desktop' }
  }

  // Detect browser
  let browser = 'Other'
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Opera')) browser = 'Opera'

  // Detect OS
  let os = 'Other'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS'

  // Detect device type
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'
  if (/mobile/i.test(ua)) deviceType = 'mobile'
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet'

  return { browser, os, deviceType }
}

/**
 * Determine traffic source from referrer
 */
function getTrafficSource(
  referrer: string | null | undefined,
  utmSource: string | null | undefined,
): string {
  if (utmSource) {
    if (['google', 'bing', 'yahoo', 'duckduckgo'].includes(utmSource.toLowerCase())) {
      return 'organic'
    }
    if (['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok'].includes(utmSource.toLowerCase())) {
      return 'social'
    }
    if (['email', 'newsletter', 'mailchimp'].includes(utmSource.toLowerCase())) {
      return 'email'
    }
    if (['google_ads', 'facebook_ads', 'ppc', 'cpc'].includes(utmSource.toLowerCase())) {
      return 'paid'
    }
  }

  if (!referrer) return 'direct'

  try {
    const url = new URL(referrer)
    const domain = url.hostname.toLowerCase()

    // Organic search
    if (['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com'].some((d) => domain.includes(d))) {
      return 'organic'
    }

    // Social
    if (['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 't.co', 'x.com'].some((d) => domain.includes(d))) {
      return 'social'
    }

    return 'referral'
  } catch {
    return 'direct'
  }
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json()

    // Validate required fields
    if (!event.event || !event.sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Get server-side data
    const ip = getClientIP(req)
    const userAgent = req.headers.get('user-agent')
    const { browser, os, deviceType } = parseUserAgent(userAgent)

    // Determine traffic source
    const trafficSource = getTrafficSource(event.referrer, event.utmSource)

    // Build enriched event - only include fields that are defined
    const enrichedEvent: Record<string, unknown> = {
      event: event.event,
      sessionId: event.sessionId,

      // Event data (all additional fields)
      eventData: {
        postSlug: event.postSlug,
        pageSlug: event.pageSlug,
        referrer: event.referrer,
        utmSource: event.utmSource,
        utmMedium: event.utmMedium,
        utmCampaign: event.utmCampaign,
        linkUrl: event.linkUrl,
        linkText: event.linkText,
        linkType: event.linkType,
        formId: event.formId,
        formType: event.formType,
        formAction: event.formAction,
        videoSrc: event.videoSrc,
        ctaText: event.ctaText,
        ctaType: event.ctaType,
        metric: event.metric,
        value: event.value,
        depth: event.depth,
        duration: event.duration,
        timeOnPage: event.timeOnPage,
        maxScrollDepth: event.maxScrollDepth,
        trafficSource,
        ...event.eventData,
      },

      // Device context
      deviceType: event.deviceType || deviceType,
      browser: event.browser || browser,
      os: event.os || os,

      // Timestamps
      serverTimestamp: new Date().toISOString(),
    }

    // Only add optional fields if they have values
    if (event.postId) enrichedEvent.postId = event.postId
    if (event.pageId) enrichedEvent.pageId = event.pageId
    if (event.agentId) enrichedEvent.agentId = event.agentId
    if (event.tenantId) enrichedEvent.tenantId = event.tenantId

    if (ip) enrichedEvent.ipAddress = anonymizeIP(ip)
    if (req.headers.get('cf-ipcountry')) enrichedEvent.country = req.headers.get('cf-ipcountry')
    if (event.timezone) enrichedEvent.timezone = event.timezone

    if (event.screenSize) enrichedEvent.screenSize = event.screenSize
    if (userAgent) enrichedEvent.userAgent = userAgent

    if (event.referrer) enrichedEvent.referrer = event.referrer
    if (event.utmSource) enrichedEvent.utmSource = event.utmSource
    if (event.utmMedium) enrichedEvent.utmMedium = event.utmMedium
    if (event.utmCampaign) enrichedEvent.utmCampaign = event.utmCampaign

    if (event.timestamp) enrichedEvent.clientTimestamp = event.timestamp

    // Save to database
    await saveEvent(enrichedEvent)

    // Return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

/**
 * Save event to database
 */
async function saveEvent(eventData: Record<string, unknown>): Promise<void> {
  try {
    const payload = await getPayload({ config: configPromise })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({
      collection: 'analytics-events',
      data: eventData as any,
    })
  } catch (error) {
    console.error('Failed to save analytics event:', error)
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
