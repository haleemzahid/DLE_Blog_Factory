import React from 'react'
import type { AgentBlogBlock as AgentBlogBlockType, Post } from '@/payload-types'
import { Media } from '@/components/Media'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { AgentBlogPagination, SerializedAgentPost } from './AgentBlogPagination'
import { ArticleCard, cardStyles, type ArticleCardData } from '@/components/Card/ArticleCard'

// Extract plain text from Lexical rich text content
const extractTextFromContent = (content: any, maxLength: number = 160): string => {
  if (!content || !content.root || !content.root.children) return ''

  const extractText = (nodes: any[]): string => {
    let text = ''
    for (const node of nodes) {
      if (node.type === 'text' && node.text) {
        text += node.text + ' '
      }
      if (node.children && Array.isArray(node.children)) {
        text += extractText(node.children)
      }
    }
    return text
  }

  const fullText = extractText(content.root.children).trim()
  if (fullText.length <= maxLength) return fullText
  return fullText.substring(0, maxLength).trim() + '...'
}

// Get description from meta or extract from content
const getPostDescription = (post: Post): string | null => {
  if (post.meta?.description) return post.meta.description
  if (post.content) return extractTextFromContent(post.content)
  return null
}

type Props = AgentBlogBlockType & {
  id?: string
  overrideAgentSlug?: string | null // Optional: override slug for placeholder pages
}

export const AgentBlogBlock: React.FC<Props> = async ({
  title,
  agent,
  categories,
  limit = 6,
  layout = 'grid',
  enablePagination = true,
  postsPerPage = 6,
  showDate = true,
  showAuthor = true,
  showExcerpt = true,
  overrideAgentSlug,
}) => {
  const payload = await getPayload({ config: configPromise })

  // Build query - find posts for this agent (either direct or syndicated)
  const where: Record<string, any> = {
    _status: { equals: 'published' },
  }

  if (agent) {
    const agentId = typeof agent === 'object' ? agent.id : agent
    // Find posts that are either:
    // 1. Directly assigned to this agent (postType: 'agent')
    // 2. Syndicated to this agent (postType: 'syndicated' and agent is in syndicatedAgents)
    // 3. Network-wide posts (showOnAllAgents: true)
    where.or = [
      { agent: { equals: agentId } },
      { syndicatedAgents: { contains: agentId } },
      { showOnAllAgents: { equals: true } },
    ]
  } else {
    // If no agent specified (placeholder page), only show network-wide posts
    where.showOnAllAgents = { equals: true }
  }

  if (categories && categories.length > 0) {
    const categoryIds = categories.map((cat) => (typeof cat === 'object' ? cat.id : cat))
    where.categories = { in: categoryIds }
  }

  // Fetch more posts when pagination is enabled so client can paginate
  const effectiveLimit = enablePagination ? 100 : limit || 6

  const result = await payload.find({
    collection: 'posts',
    where,
    limit: effectiveLimit,
    sort: '-publishedAt',
    depth: 2,
  })

  const posts = result.docs

  if (posts.length === 0) {
    return null
  }

  // Get current agent slug and logo for URL construction and display
  // Use overrideAgentSlug if provided (for placeholder pages), otherwise extract from agent
  const currentAgentSlug = overrideAgentSlug || (agent && typeof agent === 'object' ? agent.slug : null)
  const currentAgentLogo = agent && typeof agent === 'object' && agent.logo && typeof agent.logo === 'object'
    ? agent.logo
    : null

  // DEBUG: Log to see what we have
  console.log('🔍 AgentBlogBlock Debug:')
  console.log('  - Agent object:', agent)
  console.log('  - Current agent slug:', currentAgentSlug)
  console.log('  - Current agent logo:', currentAgentLogo)
  console.log('  - Number of posts:', posts.length)

  // Serialize posts for client component
  const serializedPosts: SerializedAgentPost[] = posts.map((post) => {
    // IMPORTANT: When viewing from an agent page, ALWAYS use that agent's slug in the URL
    // This ensures all blog posts on agent pages have agent-specific URLs
    const agentSlug = currentAgentSlug

    const serialized = {
      id: post.id,
      title: post.title,
      slug: post.slug || '',
      heroImage: post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null,
      description: getPostDescription(post),
      authorName:
        post.populatedAuthors && post.populatedAuthors.length > 0
          ? post.populatedAuthors[0]?.name || null
          : null,
      publishedAt: post.publishedAt || null,
      agentSlug, // Include agent slug for URL construction
      agentLogo: currentAgentLogo, // Include agent logo for display on card
    }

    console.log(`  - Post "${post.title}":`)
    console.log(`    slug: ${serialized.slug}`)
    console.log(`    agentSlug: ${serialized.agentSlug}`)

    return serialized
  })

  // For featured layout, separate the first post
  const featuredPost = layout === 'featured' && posts.length > 0 ? posts[0] : null
  const gridPosts = layout === 'featured' ? serializedPosts.slice(1) : serializedPosts

  return (
    <section id="agent-blog-section" className="py-6 bg-gray-100">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}

        {layout === 'featured' && featuredPost && (
          <div className="mb-8">
            <Link
              href={
                currentAgentSlug
                  ? `/posts/${currentAgentSlug}/${featuredPost.slug}`
                  : `/posts/${featuredPost.slug}`
              }
              className="block group"
            >
              <article className={cardStyles.container}>
                <div className="md:flex">
                  {featuredPost.heroImage && typeof featuredPost.heroImage === 'object' && (
                    <div className="md:w-1/2 relative aspect-video md:aspect-auto">
                      <Media resource={featuredPost.heroImage} fill className="object-cover" />
                    </div>
                  )}
                  <div className={`md:w-1/2 ${cardStyles.content}`}>
                    <h3 className={cardStyles.title}>
                      {featuredPost.title}
                    </h3>
                    {showExcerpt && getPostDescription(featuredPost) && (
                      <p className={cardStyles.excerpt}>{getPostDescription(featuredPost)}</p>
                    )}
                    <span className={cardStyles.readMore} style={{ color: '#2563eb' }}>
                      Read More »
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {enablePagination ? (
          <AgentBlogPagination
            posts={gridPosts}
            postsPerPage={postsPerPage || 6}
            layout={layout || 'grid'}
            showDate={showDate ?? true}
            showAuthor={showAuthor ?? true}
            showExcerpt={showExcerpt ?? true}
          />
        ) : (
          <div
            className={`
            ${layout === 'grid' || layout === 'featured' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
            ${layout === 'list' ? 'space-y-6 max-w-3xl mx-auto' : ''}
          `}
          >
            {(layout === 'featured' ? posts.slice(1) : posts).map((post, index) => (
              <ArticleCard
                key={`${post.id}-${index}`}
                article={{
                  id: post.id,
                  title: post.title,
                  slug: post.slug || '',
                  heroImage: typeof post.heroImage === 'object' ? post.heroImage : null,
                  description: getPostDescription(post),
                  authorName:
                    post.populatedAuthors && post.populatedAuthors.length > 0
                      ? post.populatedAuthors[0]?.name || 'DLE Network'
                      : 'DLE Network',
                  publishedAt: post.publishedAt || null,
                  agentSlug: currentAgentSlug, // Include agent slug for URL construction
                  agentLogo: currentAgentLogo, // Include agent logo for display on card
                } as ArticleCardData}
                showDate={showDate ?? true}
                showAuthor={showAuthor ?? true}
                showExcerpt={showExcerpt ?? true}
                showReadMore={true}
                accentColor="#2563eb"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
