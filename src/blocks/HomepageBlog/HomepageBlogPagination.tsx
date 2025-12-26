'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'

interface SerializedPost {
  id: number
  title: string
  slug: string
  publishedAt?: string | null
  heroImage?: {
    id: number
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
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

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <>
      {/* Grid/List Layout */}
      <div
        className={layout === 'list' ? 'space-y-6' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'}
      >
        {currentPosts.map((post) => (
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
                {post.heroImage && (
                  <Media resource={post.heroImage as any} fill className="object-cover" />
                )}
                {post.isFeatured && layout !== 'list' && (
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
        ))}
      </div>

      {/* Pagination Controls - always show */}
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(currentPage - 1)}
                className={
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) =>
              page === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => goToPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(currentPage + 1)}
                className={
                  currentPage === totalPages || totalPages === 0
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Page info */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Page {currentPage} of {totalPages || 1} ({initialPosts.length} posts)
        </p>
      </div>
    </>
  )
}
