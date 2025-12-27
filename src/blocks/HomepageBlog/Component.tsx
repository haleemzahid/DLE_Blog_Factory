import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Post } from '@/payload-types'
import { HomepageBlogPagination } from './HomepageBlogPagination'
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

interface HomepageBlogBlockProps {
  title?: string | null
  subtitle?: string | null
  limit?: number | null
  showMainBlog?: boolean | null
  showSyndicatedOnHomepage?: boolean | null
  showFeaturedOnly?: boolean | null
  layout?: 'grid' | 'list' | 'featured' | null
  enablePagination?: boolean | null
  postsPerPage?: number | null
  blockType: 'homepageBlog'
  blockName?: string | null
}

export const HomepageBlogBlock: React.FC<HomepageBlogBlockProps> = async (props) => {
  const {
    title,
    subtitle,
    limit = 6,
    showMainBlog = true,
    showSyndicatedOnHomepage = true,
    showFeaturedOnly = false,
    layout = 'grid',
    enablePagination = true,
    postsPerPage = 6,
  } = props

  const payload = await getPayload({ config: configPromise })

  // Build the where clause
  const orConditions: any[] = []

  if (showMainBlog) {
    orConditions.push({ postType: { equals: 'main' } })
  }

  if (showSyndicatedOnHomepage) {
    orConditions.push({
      and: [{ postType: { equals: 'syndicated' } }, { showOnHomepage: { equals: true } }],
    })
  }

  const where: Record<string, any> = {
    _status: { equals: 'published' },
  }

  if (orConditions.length > 0) {
    where.or = orConditions
  }

  if (showFeaturedOnly) {
    where.isFeatured = { equals: true }
  }

  // Fetch more posts when pagination is enabled so client can paginate
  const effectiveLimit = enablePagination ? 100 : limit || 6

  const posts = await payload.find({
    collection: 'posts',
    limit: effectiveLimit,
    sort: '-publishedAt',
    where,
    depth: 2,
  })

  // Get total count for pagination
  const totalPosts = posts.totalDocs || 0

  if (!posts?.docs || posts.docs.length === 0) {
    return null
  }

  const featuredPost = layout === 'featured' ? posts.docs[0] : null
  const gridPosts = layout === 'featured' ? posts.docs.slice(1) : posts.docs

  // Serialize posts for client component
  const serializedPosts = gridPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug || '',
    publishedAt: post.publishedAt,
    heroImage: post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null,
    description: getPostDescription(post),
    isFeatured: (post as Post & { isFeatured?: boolean }).isFeatured,
  }))

  return (
    <section id="homepage-blog-section" className="py-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          {title && <span className="inline-block px-6 text-md text-red-500  mb-2">{title}</span>}
          {subtitle && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {subtitle}
            </h2>
          )}
        </div>

        {/* Featured Layout */}
        {layout === 'featured' && featuredPost && (
          <div className="mb-12">
            <Link href={`/posts/${featuredPost.slug}`} className="block group">
              <article className={cardStyles.container}>
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Featured Image */}
                  <div className="relative aspect-[16/10] md:aspect-auto">
                    {featuredPost.heroImage && typeof featuredPost.heroImage === 'object' && (
                      <Media resource={featuredPost.heroImage} fill className="object-cover" />
                    )}
                    {(featuredPost as Post & { isFeatured?: boolean }).isFeatured && (
                      <span className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={cardStyles.content}>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                      {featuredPost.publishedAt && formatDateTime(featuredPost.publishedAt)}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {featuredPost.title}
                    </h3>
                    {getPostDescription(featuredPost) && (
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

        {/* Grid/List Layout with Pagination */}
        {enablePagination ? (
          <HomepageBlogPagination
            blockId={props.blockName || `blog-${title || 'default'}`}
            initialPosts={serializedPosts}
            totalPosts={totalPosts - (featuredPost ? 1 : 0)}
            postsPerPage={postsPerPage || 6}
            layout={layout || 'grid'}
            whereClause={where}
          />
        ) : (
          <>
            <div
              className={
                layout === 'list' ? 'space-y-6' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
              }
            >
              {gridPosts.map((post, index) => (
                <ArticleCard
                  key={`${post.id}-${index}`}
                  article={
                    {
                      id: post.id,
                      title: post.title,
                      slug: post.slug || '',
                      heroImage: typeof post.heroImage === 'object' ? post.heroImage : null,
                      description: getPostDescription(post),
                      authorName: 'DLE Network',
                      publishedAt: post.publishedAt || null,
                    } as ArticleCardData
                  }
                  showDate={true}
                  showAuthor={false}
                  showExcerpt={true}
                  showReadMore={true}
                  accentColor="#2563eb"
                />
              ))}
            </div>
          </>
        )}

        {/* View All Link - only show when pagination is disabled */}
        {!enablePagination && (
          <div className="text-center mt-12">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              View All Posts
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
