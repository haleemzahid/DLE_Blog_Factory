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
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10]">
          {post.heroImage && (
            <Media resource={post.heroImage} fill className="object-cover" />
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
          {post.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 flex-1">
              {post.description}
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
  )
}
