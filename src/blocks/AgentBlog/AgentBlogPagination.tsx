'use client'

import React, { useState } from 'react'
import type { Media as MediaType } from '@/payload-types'
import { ArticleCard, type ArticleCardData } from '@/components/Card/ArticleCard'
import { ArticlePagination } from '@/components/Pagination/ArticlePagination'

// Serializable post data interface
export interface SerializedAgentPost {
  id: number
  title: string
  slug: string
  heroImage: MediaType | null
  description: string | null
  authorName: string | null
  publishedAt: string | null
  agentSlug?: string | null // Optional: agent slug for agent-specific URLs
  agentLogo?: MediaType | null // Optional: agent logo to display on card
}

interface AgentBlogPaginationProps {
  posts: SerializedAgentPost[]
  postsPerPage: number
  layout: 'grid' | 'list' | 'featured'
  showDate: boolean
  showAuthor: boolean
  showExcerpt: boolean
}

export const AgentBlogPagination: React.FC<AgentBlogPaginationProps> = ({
  posts,
  postsPerPage,
  layout,
  showDate,
  showAuthor,
  showExcerpt,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(posts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div
        className={`
          ${layout === 'grid' || layout === 'featured' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
          ${layout === 'list' ? 'space-y-6 max-w-3xl mx-auto' : ''}
        `}
      >
        {currentPosts.map((post, index) => (
          <ArticleCard
            key={`${post.id}-${index}`}
            article={{
              id: post.id,
              title: post.title,
              slug: post.slug,
              heroImage: post.heroImage,
              description: post.description,
              authorName: post.authorName || 'DLE Network',
              publishedAt: post.publishedAt,
              agentSlug: post.agentSlug, // CRITICAL: Include agent slug for URL construction
              agentLogo: post.agentLogo, // Include agent logo for display on card
            } as ArticleCardData}
            showDate={showDate}
            showAuthor={showAuthor}
            showExcerpt={showExcerpt}
            showReadMore={true}
            accentColor="#2563eb"
          />
        ))}
      </div>

      {/* Pagination */}
      <ArticlePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={posts.length}
        onPageChange={handlePageChange}
        itemLabel="posts"
      />
    </>
  )
}
