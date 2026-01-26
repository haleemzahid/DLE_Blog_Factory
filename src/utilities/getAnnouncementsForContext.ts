import type { Payload, Where } from 'payload'
import type { Announcement, Agent, CityDatum } from '@/payload-types'

/**
 * Context for filtering announcements
 */
export interface AnnouncementContext {
  agentId?: number | null
  cityId?: number | null
  stateId?: number | null
  tenantId?: number | null
}

/**
 * Fetches active announcements that match the given context
 * Implements the hierarchy: global → state → city → agent
 */
export async function getAnnouncementsForContext(
  payload: Payload,
  context: AnnouncementContext,
): Promise<Announcement[]> {
  const now = new Date()

  // Build the query for active announcements
  const baseQuery: Where = {
    and: [
      { isActive: { equals: true } },
      {
        or: [
          { startDate: { exists: false } },
          { startDate: { less_than_equal: now.toISOString() } },
        ],
      },
      {
        or: [
          { endDate: { exists: false } },
          { endDate: { greater_than_equal: now.toISOString() } },
        ],
      },
    ],
  }

  try {
    const result = await payload.find({
      collection: 'announcements',
      where: baseQuery,
      sort: '-priority',
      limit: 100,
    })

    // Filter announcements based on scope and context
    const filtered = result.docs.filter((announcement: Announcement) => {
      // Check if agent is excluded
      if (context.agentId && announcement.excludeAgents?.length) {
        const excludedIds = announcement.excludeAgents.map((a: number | Agent) =>
          typeof a === 'number' ? a : a.id,
        )
        if (excludedIds.includes(context.agentId)) {
          return false
        }
      }

      // Filter by scope
      switch (announcement.scope) {
        case 'global':
          return true

        case 'state':
          if (!context.stateId || !announcement.targetStates?.length) return false
          const stateIds = announcement.targetStates.map((s: any) =>
            typeof s === 'number' ? s : s.id,
          )
          return stateIds.includes(context.stateId)

        case 'city':
          if (!context.cityId || !announcement.targetCities?.length) return false
          const cityIds = announcement.targetCities.map((c: any) =>
            typeof c === 'number' ? c : c.id,
          )
          return cityIds.includes(context.cityId)

        case 'agent':
          if (!context.agentId || !announcement.targetAgents?.length) return false
          const agentIds = announcement.targetAgents.map((a: any) =>
            typeof a === 'number' ? a : a.id,
          )
          return agentIds.includes(context.agentId)

        default:
          return false
      }
    })

    // Sort by priority (higher first)
    return filtered.sort(
      (a: Announcement, b: Announcement) => (b.priority || 50) - (a.priority || 50),
    )
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return []
  }
}

/**
 * Get announcements filtered by type
 */
export async function getAnnouncementsByType(
  payload: Payload,
  context: AnnouncementContext,
  type: 'banner' | 'alert' | 'news' | 'promo' | 'hot-deal' | 'market-update' | 'event',
): Promise<Announcement[]> {
  const all = await getAnnouncementsForContext(payload, context)
  return all.filter((a) => a.type === type)
}

/**
 * Get global announcements (no context filtering, shows to everyone)
 */
export async function getGlobalAnnouncements(payload: Payload): Promise<Announcement[]> {
  return getAnnouncementsForContext(payload, {})
}

/**
 * Get announcements for a specific agent context
 */
export async function getAnnouncementsForAgent(
  payload: Payload,
  agent: Agent,
  cityData?: CityDatum | null,
): Promise<Announcement[]> {
  const stateId = typeof agent.state === 'number' ? agent.state : agent.state?.id

  const cityId = cityData ? (typeof cityData === 'number' ? cityData : cityData.id) : null

  return getAnnouncementsForContext(payload, {
    agentId: agent.id,
    cityId: cityId ?? undefined,
    stateId: stateId ?? undefined,
  })
}

/**
 * Format announcements for token replacement
 * Returns HTML-ready content
 */
export function formatAnnouncementsForToken(
  announcements: Announcement[],
  limit: number = 3,
): string {
  if (!announcements.length) return ''

  const limited = announcements.slice(0, limit)

  return limited
    .map((ann) => {
      const iconClass = ann.icon && ann.icon !== 'none' ? ` icon-${ann.icon}` : ''
      const styleClass = ann.style || 'primary'
      const typeClass = ann.type || 'news'

      let html = `<div class="announcement announcement-${typeClass} announcement-${styleClass}${iconClass}">`
      html += `<h4 class="announcement-title">${ann.title}</h4>`

      if (ann.excerpt) {
        html += `<p class="announcement-excerpt">${ann.excerpt}</p>`
      }

      if (ann.cta?.text && ann.cta?.link) {
        const target = ann.cta.newTab ? ' target="_blank" rel="noopener"' : ''
        html += `<a href="${ann.cta.link}" class="announcement-cta"${target}>${ann.cta.text}</a>`
      }

      html += '</div>'
      return html
    })
    .join('\n')
}

/**
 * Format hot deals from agent for token replacement
 */
export function formatHotDealsForToken(agent: Agent, limit: number = 5): string {
  const hotDeals = (agent as any).hotDeals as
    | Array<{
        title: string
        description?: string
        dealType?: string
        price?: string
        link?: string
        isActive?: boolean
        expiresAt?: string
        priority?: number
      }>
    | undefined

  if (!hotDeals?.length) return ''

  const now = new Date()
  const activeDeals = hotDeals
    .filter((deal) => {
      if (!deal.isActive) return false
      if (deal.expiresAt && new Date(deal.expiresAt) < now) return false
      return true
    })
    .sort((a, b) => (b.priority || 50) - (a.priority || 50))
    .slice(0, limit)

  if (!activeDeals.length) return ''

  return activeDeals
    .map((deal) => {
      const typeClass = deal.dealType || 'listing'
      let html = `<div class="hot-deal hot-deal-${typeClass}">`
      html += `<h4 class="hot-deal-title">${deal.title}</h4>`

      if (deal.price) {
        html += `<span class="hot-deal-price">${deal.price}</span>`
      }

      if (deal.description) {
        html += `<p class="hot-deal-description">${deal.description}</p>`
      }

      if (deal.link) {
        html += `<a href="${deal.link}" class="hot-deal-link">View Details</a>`
      }

      html += '</div>'
      return html
    })
    .join('\n')
}

export default getAnnouncementsForContext
