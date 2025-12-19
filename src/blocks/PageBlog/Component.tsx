import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Post, Category, Page } from '@/payload-types'

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
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
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
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              layout={layout || 'grid'}
              showReadMore={showReadMore || false}
              showDate={showDate || false}
              showExcerpt={showExcerpt || false}
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

interface PostCardProps {
  post: Post
  layout: 'grid' | 'list' | 'compact'
  showReadMore: boolean
  showDate: boolean
  showExcerpt: boolean
}

function PostCard({ post, layout, showReadMore, showDate, showExcerpt }: PostCardProps) {
  if (layout === 'compact') {
    return (
      <Link href={`/posts/${post.slug}`} className="group block">
        <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
          <div className="flex gap-4 p-4">
            {post.heroImage && typeof post.heroImage === 'object' && (
              <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                <Media resource={post.heroImage} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              {showDate && post.publishedAt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formatDateTime(post.publishedAt)}
                </p>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  if (layout === 'list') {
    return (
      <Link href={`/posts/${post.slug}`} className="group block">
        <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow flex flex-col md:flex-row">
          {post.heroImage && typeof post.heroImage === 'object' && (
            <div className="relative w-full md:w-72 aspect-video md:aspect-auto flex-shrink-0">
              <Media resource={post.heroImage} fill className="object-cover" />
            </div>
          )}
          <div className="p-6 flex flex-col justify-center">
            {showDate && post.publishedAt && (
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                {formatDateTime(post.publishedAt)}
              </p>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2">
              {post.title}
            </h3>
            {showExcerpt && post.meta?.description && (
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {post.meta.description}
              </p>
            )}
            {showReadMore && (
              <span className="text-red-600 font-medium mt-4 inline-flex items-center gap-1">
                Read More
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            )}
          </div>
        </article>
      </Link>
    )
  }

  // Grid layout (default)
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow h-full flex flex-col">
        {post.heroImage && typeof post.heroImage === 'object' && (
          <div className="relative aspect-video">
            <Media resource={post.heroImage} fill className="object-cover" />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          {showDate && post.publishedAt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {formatDateTime(post.publishedAt)}
            </p>
          )}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          {showExcerpt && post.meta?.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-1">
              {post.meta.description}
            </p>
          )}
          {showReadMore && (
            <span className="text-red-600 font-medium mt-4 inline-flex items-center gap-1 text-sm">
              Read More
              <svg
                className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}
