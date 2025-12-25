import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Post } from '@/payload-types'
import { HomepageBlogPagination } from './HomepageBlogPagination'

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

  // Determine limit based on pagination settings
  const effectiveLimit = enablePagination ? postsPerPage || 6 : limit || 6

  const posts = await payload.find({
    collection: 'posts',
    limit: effectiveLimit,
    sort: '-publishedAt',
    where,
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
    heroImage:
      post.heroImage && typeof post.heroImage === 'object'
        ? {
            id: post.heroImage.id,
            url: post.heroImage.url,
            alt: post.heroImage.alt,
            width: post.heroImage.width,
            height: post.heroImage.height,
          }
        : null,
    meta: post.meta
      ? {
          description: post.meta.description,
        }
      : null,
    isFeatured: (post as Post & { isFeatured?: boolean }).isFeatured,
  }))

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Featured Layout */}
        {layout === 'featured' && featuredPost && (
          <div className="mb-12">
            <Link href={`/posts/${featuredPost.slug}`} className="block group">
              <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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
                  <div className="p-8 flex flex-col justify-center">
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                      {featuredPost.publishedAt && formatDateTime(featuredPost.publishedAt)}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {featuredPost.title}
                    </h3>
                    {featuredPost.meta?.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {featuredPost.meta.description}
                      </p>
                    )}
                    <span className="text-blue-600 dark:text-blue-400 font-medium inline-flex items-center gap-2">
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
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Grid/List Layout with Pagination */}
        {enablePagination ? (
          <HomepageBlogPagination
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
              {gridPosts.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
                  <article
                    className={
                      layout === 'list'
                        ? 'bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow flex flex-col md:flex-row'
                        : 'bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow h-full flex flex-col'
                    }
                  >
                    {/* Image */}
                    <div
                      className={
                        layout === 'list'
                          ? 'relative w-full md:w-64 aspect-[16/10] md:aspect-auto md:h-48 flex-shrink-0'
                          : 'relative aspect-[16/10]'
                      }
                    >
                      {post.heroImage && typeof post.heroImage === 'object' && (
                        <Media resource={post.heroImage} fill className="object-cover" />
                      )}
                      {(post as Post & { isFeatured?: boolean }).isFeatured && layout !== 'list' && (
                        <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                        {post.publishedAt && formatDateTime(post.publishedAt)}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.meta?.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 flex-1">
                          {post.meta.description}
                        </p>
                      )}
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm inline-flex items-center gap-2 mt-4">
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
                    </div>
                  </article>
                </Link>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
