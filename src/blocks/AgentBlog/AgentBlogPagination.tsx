'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Media as MediaType } from '@/payload-types'

// Serializable post data interface
export interface SerializedAgentPost {
  id: number
  title: string
  slug: string
  heroImage: MediaType | null
  description: string | null
  authorName: string | null
  publishedAt: string | null
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

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to section
    document.getElementById('agent-blog-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div
        className={`
          ${layout === 'grid' || layout === 'featured' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
          ${layout === 'list' ? 'space-y-6 max-w-3xl mx-auto' : ''}
        `}
      >
        {currentPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showDate={showDate}
            showAuthor={showAuthor}
            showExcerpt={showExcerpt}
          />
        ))}
      </div>

      {/* Pagination Controls - always show */}
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => goToPage(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors border ${
                currentPage === page
                  ? 'border-gray-900 text-gray-900 bg-white'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>

        {/* Page info */}
        <span className="text-sm text-gray-500 ml-4">
          Page {currentPage} of {totalPages || 1} ({posts.length} posts)
        </span>
      </div>
    </>
  )
}

interface PostCardProps {
  post: SerializedAgentPost
  showDate: boolean
  showAuthor: boolean
  showExcerpt: boolean
}

function PostCard({ post, showDate, showAuthor, showExcerpt }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.heroImage && (
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

        {showExcerpt && post.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {showAuthor && post.authorName && <span>{post.authorName}</span>}
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
