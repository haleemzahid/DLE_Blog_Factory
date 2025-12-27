'use client'

import React, { useState } from 'react'
import type { Media as MediaType } from '@/payload-types'
import { ArticleCard, type ArticleCardData } from '@/components/Card/ArticleCard'
import { ArticlePagination } from '@/components/Pagination/ArticlePagination'

interface SerializedPost {
  id: number
  title: string
  slug: string
  publishedAt?: string | null
  heroImage?: MediaType | null
  description?: string | null
  isFeatured?: boolean
}

interface HomepageBlogPaginationProps {
  blockId: string
  initialPosts: SerializedPost[]
  totalPosts: number
  postsPerPage: number
  layout: 'grid' | 'list' | 'featured'
  whereClause: Record<string, any>
}

export const HomepageBlogPagination: React.FC<HomepageBlogPaginationProps> = ({
  blockId,
  initialPosts,
  totalPosts,
  postsPerPage,
  layout,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Reset page when blockId changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [blockId])

  // Client-side pagination - slice the posts array
  const totalPages = Math.ceil(initialPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = initialPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
  }

  return (
    <>
      {/* Grid/List Layout */}
      <div
        className={layout === 'list' ? 'space-y-6' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'}
      >
        {currentPosts.map((post, index) => (
          <ArticleCard
            key={`${post.id}-${index}`}
            article={{
              id: post.id,
              title: post.title,
              slug: post.slug,
              heroImage: post.heroImage as MediaType | null,
              description: post.description || null,
              authorName: 'DLE Network',
              publishedAt: post.publishedAt || null,
            } as ArticleCardData}
            showDate={true}
            showAuthor={false}
            showExcerpt={true}
            showReadMore={true}
            accentColor="#2563eb"
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <ArticlePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={initialPosts.length}
          onPageChange={handlePageChange}
          itemLabel="posts"
        />
      </div>
    </>
  )
}
