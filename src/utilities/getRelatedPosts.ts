import { unstable_cache } from 'next/cache'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Post, Category, Tenant } from '@/payload-types'

interface GetRelatedPostsOptions {
  postId: string
  limit?: number
  tenantId?: string
}

interface RelatedPostsResult {
  posts: Post[]
  mode: 'auto' | 'manual' | 'hybrid'
}

/**
 * Get related posts based on the post's relatedPostsMode setting
 * - auto: Fetch posts by shared categories
 * - manual: Use manually selected related posts only
 * - hybrid: Use manual selections, fill remaining with auto-fetch
 */
export const getRelatedPosts = unstable_cache(
  async ({ postId, limit = 3, tenantId }: GetRelatedPostsOptions): Promise<RelatedPostsResult> => {
    const payload = await getPayload({ config })

    // Fetch the current post with its categories and related posts settings
    const post = await payload.findByID({
      collection: 'posts',
      id: postId,
      depth: 2,
    })

    if (!post) {
      return { posts: [], mode: 'auto' }
    }

    const mode = (post.relatedPostsMode as 'auto' | 'manual' | 'hybrid') || 'hybrid'
    const manualRelated = (post.relatedPosts as Post[]) || []

    // If manual mode, return only manually selected posts
    if (mode === 'manual') {
      return {
        posts: manualRelated.slice(0, limit),
        mode: 'manual',
      }
    }

    // Get category IDs for auto-fetch
    const categories = (post.categories as Category[]) || []
    const categoryIds = categories.map((cat) => (typeof cat === 'object' ? cat.id : cat))

    // If no categories, fall back to manual or empty
    if (categoryIds.length === 0) {
      return {
        posts: manualRelated.slice(0, limit),
        mode,
      }
    }

    // For hybrid mode, start with manual posts
    if (mode === 'hybrid' && manualRelated.length >= limit) {
      return {
        posts: manualRelated.slice(0, limit),
        mode: 'hybrid',
      }
    }

    // Calculate how many auto posts we need
    const manualCount = mode === 'hybrid' ? manualRelated.length : 0
    const autoLimit = limit - manualCount

    // Build query for auto-fetched posts
    let whereCondition: Where = {
      id: { not_equals: postId },
      _status: { equals: 'published' },
      categories: { in: categoryIds },
    }

    // Exclude manually selected posts in hybrid mode
    if (mode === 'hybrid' && manualRelated.length > 0) {
      const manualIds = manualRelated.map((p) => (typeof p === 'object' ? p.id : p))
      whereCondition = {
        ...whereCondition,
        id: { not_in: [postId, ...manualIds] },
      }
    }

    // If tenant specified, prefer posts from that tenant or syndicated to it
    if (tenantId) {
      whereCondition = {
        ...whereCondition,
        or: [
          { primaryTenant: { equals: tenantId } },
          { 'syndicatedAgents.tenant': { equals: tenantId } },
          { postType: { equals: 'network-wide' } },
        ],
      }
    }

    // Fetch auto-related posts
    const autoResult = await payload.find({
      collection: 'posts',
      where: whereCondition,
      limit: autoLimit,
      sort: '-publishedAt',
      depth: 1,
    })

    // Combine manual and auto posts for hybrid mode
    if (mode === 'hybrid') {
      return {
        posts: [...manualRelated, ...autoResult.docs].slice(0, limit),
        mode: 'hybrid',
      }
    }

    // Auto mode - just return auto-fetched posts
    return {
      posts: autoResult.docs,
      mode: 'auto',
    }
  },
  ['related-posts'],
  {
    revalidate: 300, // 5 minutes
    tags: ['posts'],
  },
)

/**
 * Get related posts for a specific tenant site
 * Prioritizes posts syndicated to that tenant
 */
export const getRelatedPostsForTenant = unstable_cache(
  async (
    postId: string,
    tenantId: string,
    limit: number = 3,
  ): Promise<{ posts: Post[]; hasOverrides: boolean }> => {
    const payload = await getPayload({ config })

    // First, check if there are tenant-specific display location settings
    const post = await payload.findByID({
      collection: 'posts',
      id: postId,
      depth: 2,
    })

    if (!post) {
      return { posts: [], hasOverrides: false }
    }

    // Check displayLocations for tenant-specific settings
    const displayLocations = (post.displayLocations || []) as Array<{
      tenant?: string | Tenant
      showOnAgentPages?: Array<unknown>
    }>

    const tenantSettings = displayLocations.find((loc) => {
      const locTenantId = typeof loc.tenant === 'object' ? loc.tenant?.id : loc.tenant
      return locTenantId === tenantId
    })

    // If tenant has specific related posts configured, use those
    // (This is a placeholder for future tenant-specific related posts)
    const hasOverrides = Boolean(tenantSettings)

    // Get related posts with tenant context
    const result = await getRelatedPosts({ postId, limit, tenantId })

    return {
      posts: result.posts,
      hasOverrides,
    }
  },
  ['related-posts-tenant'],
  {
    revalidate: 300,
    tags: ['posts', 'tenants'],
  },
)

/**
 * Get posts for a category with tenant filtering
 */
export const getPostsByCategory = unstable_cache(
  async (
    categorySlug: string,
    options: {
      limit?: number
      page?: number
      tenantId?: string
      excludePostId?: string
    } = {},
  ) => {
    const { limit = 10, page = 1, tenantId, excludePostId } = options
    const payload = await getPayload({ config })

    // First find the category
    const categoryResult = await payload.find({
      collection: 'categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
    })

    const category = categoryResult.docs[0]
    if (!category) {
      return { posts: [], category: null, hasMore: false }
    }

    // Build query
    let whereCondition: Where = {
      categories: { equals: category.id },
      _status: { equals: 'published' },
    }

    if (excludePostId) {
      whereCondition = {
        ...whereCondition,
        id: { not_equals: excludePostId },
      }
    }

    // Add tenant filter if specified
    if (tenantId) {
      whereCondition = {
        ...whereCondition,
        or: [
          { primaryTenant: { equals: tenantId } },
          { 'syndicatedAgents.tenant': { equals: tenantId } },
          { postType: { equals: 'network-wide' } },
        ],
      }
    }

    const postsResult = await payload.find({
      collection: 'posts',
      where: whereCondition,
      limit,
      page,
      sort: '-publishedAt',
      depth: 1,
    })

    return {
      posts: postsResult.docs,
      category,
      hasMore: postsResult.hasNextPage,
      totalDocs: postsResult.totalDocs,
    }
  },
  ['posts-by-category'],
  {
    revalidate: 300,
    tags: ['posts', 'categories'],
  },
)

/**
 * Get featured posts for a tenant's homepage or sidebar
 */
export const getFeaturedPostsForTenant = unstable_cache(
  async (tenantId: string, limit: number = 5) => {
    const payload = await getPayload({ config })

    // Find posts that should display on this tenant's homepage
    const result = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
        or: [
          { primaryTenant: { equals: tenantId } },
          { 'displayLocations.tenant': { equals: tenantId } },
          { postType: { equals: 'network-wide' } },
        ],
      },
      limit,
      sort: '-publishedAt',
      depth: 1,
    })

    return result.docs
  },
  ['featured-posts-tenant'],
  {
    revalidate: 300,
    tags: ['posts', 'tenants'],
  },
)
