/**
 * DLE Analytics Tracker
 * Client-side analytics tracking library for the DLE Blog Factory
 * Tracks page views, scroll depth, clicks, form submissions, and Core Web Vitals
 */

export interface AnalyticsConfig {
  postId?: string
  postSlug?: string
  pageId?: string
  pageSlug?: string
  agentId?: string
  tenantId?: string
  debug?: boolean
}

export interface TrackEventData {
  event: string
  sessionId: string
  postId?: string
  pageId?: string
  agentId?: string
  tenantId?: string
  [key: string]: unknown
}

class DLEAnalyticsTracker {
  private postId?: string
  private postSlug?: string
  private pageId?: string
  private pageSlug?: string
  private agentId?: string
  private tenantId?: string
  private sessionId: string
  private startTime: number
  private maxScroll: number = 0
  private debug: boolean = false
  private initialized: boolean = false
  private consentGiven: boolean = false

  constructor(config: AnalyticsConfig = {}) {
    this.postId = config.postId
    this.postSlug = config.postSlug
    this.pageId = config.pageId
    this.pageSlug = config.pageSlug
    this.agentId = config.agentId
    this.tenantId = config.tenantId
    this.debug = config.debug || false
    this.sessionId = this.getOrCreateSessionId()
    this.startTime = Date.now()
  }

  /**
   * Initialize the tracker - call this when the page loads
   */
  init(): void {
    if (this.initialized) return
    if (typeof window === 'undefined') return

    // Check for consent
    this.consentGiven = this.checkConsent()

    if (!this.consentGiven) {
      this.log('Analytics disabled - no consent given')
      return
    }

    // Check Do Not Track
    if (navigator.doNotTrack === '1') {
      this.log('Analytics disabled - Do Not Track is enabled')
      return
    }

    this.initialized = true

    // Track page view immediately
    this.trackPageView()

    // Track scroll depth
    this.trackScrollDepth()

    // Track time on page
    this.trackTimeOnPage()

    // Track link clicks
    this.trackLinkClicks()

    // Track form submissions
    this.trackFormSubmissions()

    // Track video plays
    this.trackVideoPlays()

    // Track CTA clicks
    this.trackCTAClicks()

    // Track Core Web Vitals
    this.trackCoreWebVitals()

    // Track page exit
    this.trackPageExit()

    this.log('DLE Analytics initialized')
  }

  /**
   * Check if user has given consent for analytics
   */
  private checkConsent(): boolean {
    if (typeof window === 'undefined') return false
    const consent = localStorage.getItem('dle_analytics_consent')
    return consent === 'all' || consent === 'analytics'
  }

  /**
   * Set analytics consent
   */
  setConsent(level: 'all' | 'analytics' | 'essential' | 'none'): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('dle_analytics_consent', level)
    this.consentGiven = level === 'all' || level === 'analytics'

    if (this.consentGiven && !this.initialized) {
      this.init()
    }
  }

  /**
   * Track page view event
   */
  private trackPageView(): void {
    this.sendEvent('page_view', {
      postId: this.postId,
      postSlug: this.postSlug,
      pageId: this.pageId,
      pageSlug: this.pageSlug,
      referrer: document.referrer,
      utmSource: this.getUTMParam('utm_source'),
      utmMedium: this.getUTMParam('utm_medium'),
      utmCampaign: this.getUTMParam('utm_campaign'),
      deviceType: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS(),
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: this.getTimezone(),
      language: navigator.language || 'en',
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Get user's timezone
   */
  private getTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      return 'Unknown'
    }
  }

  /**
   * Track scroll depth at milestones (25%, 50%, 75%, 90%, 100%)
   */
  private trackScrollDepth(): void {
    const milestones = [25, 50, 75, 90, 100]
    const tracked = new Set<number>()

    const handleScroll = (): void => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const scrollPercent = (window.scrollY / scrollHeight) * 100
      this.maxScroll = Math.max(this.maxScroll, scrollPercent)

      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone)
          this.sendEvent('scroll_depth', {
            postId: this.postId,
            pageId: this.pageId,
            depth: milestone,
            timestamp: new Date().toISOString(),
          })
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  /**
   * Track time on page - sends update every 30 seconds
   */
  private trackTimeOnPage(): void {
    const interval = setInterval(() => {
      const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000)
      this.sendEvent('time_on_page', {
        postId: this.postId,
        pageId: this.pageId,
        duration: timeOnPage,
        timestamp: new Date().toISOString(),
      })
    }, 30000) // Every 30 seconds

    // Clear interval when page unloads
    window.addEventListener('beforeunload', () => clearInterval(interval))
  }

  /**
   * Track link clicks
   */
  private trackLinkClicks(): void {
    document.addEventListener('click', (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (!link) return

      const isExternal = link.hostname !== window.location.hostname

      this.sendEvent('link_click', {
        postId: this.postId,
        pageId: this.pageId,
        linkUrl: link.href,
        linkText: link.textContent?.trim().substring(0, 100),
        linkType: isExternal ? 'external' : 'internal',
        timestamp: new Date().toISOString(),
      })
    })
  }

  /**
   * Track form submissions
   */
  private trackFormSubmissions(): void {
    document.addEventListener('submit', (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement
      if (!form) return

      this.sendEvent('form_submission', {
        postId: this.postId,
        pageId: this.pageId,
        formId: form.id || undefined,
        formType: form.dataset.formType || 'unknown',
        formAction: form.action,
        timestamp: new Date().toISOString(),
      })
    })
  }

  /**
   * Track video plays
   */
  private trackVideoPlays(): void {
    // Native video elements
    document.querySelectorAll('video').forEach((video) => {
      video.addEventListener('play', () => {
        this.sendEvent('video_play', {
          postId: this.postId,
          pageId: this.pageId,
          videoSrc: video.currentSrc || video.src,
          timestamp: new Date().toISOString(),
        })
      })
    })

    // YouTube/Vimeo iframes
    document.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"]').forEach((iframe) => {
      // Track when iframe becomes visible (interaction tracking for embeds)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.sendEvent('video_view', {
                postId: this.postId,
                pageId: this.pageId,
                videoSrc: (iframe as HTMLIFrameElement).src,
                timestamp: new Date().toISOString(),
              })
              observer.unobserve(iframe)
            }
          })
        },
        { threshold: 0.5 },
      )
      observer.observe(iframe)
    })
  }

  /**
   * Track CTA button clicks
   */
  private trackCTAClicks(): void {
    document.querySelectorAll('[data-cta], .cta-button, [data-analytics-cta]').forEach((cta) => {
      cta.addEventListener('click', () => {
        this.sendEvent('cta_click', {
          postId: this.postId,
          pageId: this.pageId,
          ctaText: (cta as HTMLElement).textContent?.trim().substring(0, 100),
          ctaType: (cta as HTMLElement).dataset.cta || (cta as HTMLElement).dataset.analyticsCta,
          timestamp: new Date().toISOString(),
        })
      })
    })
  }

  /**
   * Track Core Web Vitals using PerformanceObserver
   */
  private trackCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number
          loadTime?: number
        }
        if (lastEntry) {
          this.sendEvent('core_web_vitals', {
            postId: this.postId,
            pageId: this.pageId,
            metric: 'LCP',
            value: lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime,
            timestamp: new Date().toISOString(),
          })
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      this.log('LCP observer not supported')
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as (PerformanceEntry & { processingStart: number })[]
        entries.forEach((entry) => {
          this.sendEvent('core_web_vitals', {
            postId: this.postId,
            pageId: this.pageId,
            metric: 'FID',
            value: entry.processingStart - entry.startTime,
            timestamp: new Date().toISOString(),
          })
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      this.log('FID observer not supported')
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsScore = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          hadRecentInput: boolean
          value: number
        })[]) {
          if (!entry.hadRecentInput) {
            clsScore += entry.value
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Send CLS score on page exit
      window.addEventListener('beforeunload', () => {
        this.sendEvent(
          'core_web_vitals',
          {
            postId: this.postId,
            pageId: this.pageId,
            metric: 'CLS',
            value: clsScore,
            timestamp: new Date().toISOString(),
          },
          true,
        )
      })
    } catch (e) {
      this.log('CLS observer not supported')
    }
  }

  /**
   * Track page exit with final stats
   */
  private trackPageExit(): void {
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000)
      this.sendEvent(
        'page_exit',
        {
          postId: this.postId,
          pageId: this.pageId,
          timeOnPage,
          maxScrollDepth: Math.round(this.maxScroll),
          timestamp: new Date().toISOString(),
        },
        true,
      ) // Use sendBeacon for guaranteed delivery
    })
  }

  /**
   * Track custom events
   */
  track(eventName: string, data: Record<string, unknown> = {}): void {
    if (!this.consentGiven) return

    this.sendEvent(eventName, {
      postId: this.postId,
      pageId: this.pageId,
      ...data,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Send event to analytics API
   */
  private sendEvent(
    eventName: string,
    data: Record<string, unknown>,
    useBeacon: boolean = false,
  ): void {
    const payload: TrackEventData = {
      event: eventName,
      sessionId: this.sessionId,
      agentId: this.agentId,
      tenantId: this.tenantId,
      ...data,
    }

    this.log(`Sending event: ${eventName}`, payload)

    if (useBeacon && navigator.sendBeacon) {
      // Use sendBeacon for page exit (guaranteed delivery)
      navigator.sendBeacon('/api/analytics/track', JSON.stringify(payload))
    } else {
      // Regular fetch for other events
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((err) => this.log('Analytics error:', err))
    }
  }

  /**
   * Get or create session ID
   */
  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return this.generateUUID()

    let sessionId = sessionStorage.getItem('dle_session_id')
    if (!sessionId) {
      // Check for cross-domain session from URL
      const urlParams = new URLSearchParams(window.location.search)
      sessionId = urlParams.get('_dle_sid') || this.generateUUID()
      sessionStorage.setItem('dle_session_id', sessionId)
    }
    return sessionId
  }

  /**
   * Get UTM parameter from URL
   */
  private getUTMParam(param: string): string | null {
    if (typeof window === 'undefined') return null
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  }

  /**
   * Detect device type
   */
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof navigator === 'undefined') return 'desktop'
    const ua = navigator.userAgent.toLowerCase()
    if (/mobile/i.test(ua)) return 'mobile'
    if (/tablet|ipad/i.test(ua)) return 'tablet'
    return 'desktop'
  }

  /**
   * Detect browser
   */
  private getBrowser(): string {
    if (typeof navigator === 'undefined') return 'Unknown'
    const ua = navigator.userAgent
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('Edg')) return 'Edge'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Safari')) return 'Safari'
    if (ua.includes('Opera')) return 'Opera'
    return 'Other'
  }

  /**
   * Detect operating system
   */
  private getOS(): string {
    if (typeof navigator === 'undefined') return 'Unknown'
    const ua = navigator.userAgent
    if (ua.includes('Windows')) return 'Windows'
    if (ua.includes('Mac')) return 'macOS'
    if (ua.includes('Linux')) return 'Linux'
    if (ua.includes('Android')) return 'Android'
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
    return 'Other'
  }

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * Debug logger
   */
  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[DLE Analytics]', ...args)
    }
  }
}

// Singleton instance
let analyticsInstance: DLEAnalyticsTracker | null = null

/**
 * Initialize DLE Analytics
 */
export function initDLEAnalytics(config: AnalyticsConfig = {}): DLEAnalyticsTracker {
  if (!analyticsInstance) {
    analyticsInstance = new DLEAnalyticsTracker(config)
  }
  return analyticsInstance
}

/**
 * Get the analytics instance
 */
export function getDLEAnalytics(): DLEAnalyticsTracker | null {
  return analyticsInstance
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, data: Record<string, unknown> = {}): void {
  analyticsInstance?.track(eventName, data)
}

export default DLEAnalyticsTracker
