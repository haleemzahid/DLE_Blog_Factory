import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import type { Post, Category } from '@/payload-types'
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

interface PageBlogBlockProps {
  title?: string | null
  subtitle?: string | null
  displayMode?: 'auto' | 'category' | 'manual' | null
  categories?: (Category | string)[] | null
  selectedPosts?: (Post | string)[] | null
  limit?: number | null
  layout?: 'grid' | 'list' | 'compact' | null
  showReadMore?: boolean | null
  showDate?: boolean | null
  showExcerpt?: boolean | null
  ctaLabel?: string | null
  ctaLink?: string | null
  blockType: 'pageBlog'
  blockName?: string | null
  // The current page context - passed from the page renderer
  currentPageId?: string | number
}

export const PageBlogBlock: React.FC<PageBlogBlockProps> = async (props) => {
  const {
    title,
    subtitle,
    displayMode = 'auto',
    categories,
    selectedPosts,
    limit = 6,
    layout = 'grid',
    showReadMore = true,
    showDate = true,
    showExcerpt = true,
    ctaLabel,
    ctaLink,
    currentPageId,
  } = props

  const payload = await getPayload({ config: configPromise })

  let posts: Post[] = []

  if (displayMode === 'manual' && selectedPosts && selectedPosts.length > 0) {
    // Manual selection
    posts = selectedPosts
      .map((post) => (typeof post === 'object' ? post : null))
      .filter((p): p is Post => p !== null)
  } else if (displayMode === 'category' && categories && categories.length > 0) {
    // By category
    const categoryIds = categories.map((cat) => (typeof cat === 'object' ? cat.id : cat))
    const result = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
        categories: { in: categoryIds },
      },
      limit: limit || 6,
      sort: '-publishedAt',
    })
    posts = result.docs
  } else if (displayMode === 'auto' && currentPageId) {
    // Auto - fetch posts related to this page
    const result = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
        relatedPages: { contains: currentPageId },
      },
      limit: limit || 6,
      sort: '-publishedAt',
    })
    posts = result.docs
  } else {
    // Fallback - just get latest posts
    const result = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
      },
      limit: limit || 6,
      sort: '-publishedAt',
    })
    posts = result.docs
  }

  if (posts.length === 0) return null

  return (
    <section className="py-6 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Posts Grid/List */}
        <div
          className={
            layout === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
              : layout === 'list'
                ? 'space-y-6 max-w-4xl mx-auto'
                : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'
          }
        >
          {posts.map((post, index) => (
            <ArticleCard
              key={`${post.id}-${index}`}
              article={{
                id: post.id,
                title: post.title,
                slug: post.slug,
                heroImage: typeof post.heroImage === 'object' ? post.heroImage : null,
                description: getPostDescription(post),
                authorName: 'DLE Network',
                publishedAt: post.publishedAt || null,
              } as ArticleCardData}
              showReadMore={showReadMore || false}
              showDate={showDate || false}
              showExcerpt={showExcerpt || false}
              showAuthor={false}
              accentColor="#dc2626"
            />
          ))}
        </div>

        {/* CTA */}
        {ctaLabel && ctaLink && (
          <div className="text-center mt-10">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              {ctaLabel}
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
