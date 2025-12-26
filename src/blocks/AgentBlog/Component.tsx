import React from 'react'
import type { AgentBlogBlock as AgentBlogBlockType, Post } from '@/payload-types'
import { Media } from '@/components/Media'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { formatDateTime } from '@/utilities/formatDateTime'
import { AgentBlogPagination, SerializedAgentPost } from './AgentBlogPagination'

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
}

const PostCard: React.FC<{
  post: Post
  showDate?: boolean
  showAuthor?: boolean
  showExcerpt?: boolean
}> = ({ post, showDate = true, showAuthor = true, showExcerpt = true }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.heroImage && typeof post.heroImage === 'object' && (
        <Link href={`/posts/${post.slug}`} className="block relative aspect-video">
          <Media resource={post.heroImage} fill className="object-cover" />
        </Link>
      )}

      <div className="p-5">
        <Link href={`/posts/${post.slug}`}>
          <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {showExcerpt && getPostDescription(post) && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{getPostDescription(post)}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {showAuthor && post.populatedAuthors && post.populatedAuthors.length > 0 && (
            <span>{post.populatedAuthors[0]?.name}</span>
          )}
          {showDate && post.publishedAt && <span>{formatDateTime(post.publishedAt)}</span>}
        </div>

        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex items-center text-red-600 font-semibold text-sm mt-3 hover:text-red-700"
        >
          Read more
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
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
    where.or = [{ agent: { equals: agentId } }, { syndicatedAgents: { contains: agentId } }]
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

  // Serialize posts for client component
  const serializedPosts: SerializedAgentPost[] = posts.map((post) => ({
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
  }))

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
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                {featuredPost.heroImage && typeof featuredPost.heroImage === 'object' && (
                  <div className="md:w-1/2 relative aspect-video md:aspect-auto">
                    <Media resource={featuredPost.heroImage} fill className="object-cover" />
                  </div>
                )}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <Link href={`/posts/${featuredPost.slug}`}>
                    <h3 className="font-bold text-2xl text-gray-900 hover:text-blue-600 transition-colors mb-4">
                      {featuredPost.title}
                    </h3>
                  </Link>
                  {showExcerpt && getPostDescription(featuredPost) && (
                    <p className="text-gray-600 mb-4">{getPostDescription(featuredPost)}</p>
                  )}
                  <Link
                    href={`/posts/${featuredPost.slug}`}
                    className="inline-flex items-center text-red-600 font-semibold"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
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
              <PostCard
                key={`${post.id}-${index}`}
                post={post}
                showDate={showDate ?? true}
                showAuthor={showAuthor ?? true}
                showExcerpt={showExcerpt ?? true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
