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
  id: string
  title: string
  slug: string
  publishedAt?: string | null
  heroImage?: {
    id: string
    url?: string
    alt?: string
    width?: number
    height?: number
  } | null
  meta?: {
    description?: string | null
  } | null
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
  whereClause,
}) => {
  // Use blockId as key to reset state when block changes
  const [posts, setPosts] = useState<SerializedPost[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Reset state when blockId or initialPosts change
  React.useEffect(() => {
    setPosts(initialPosts)
    setCurrentPage(1)
  }, [blockId, initialPosts])

  const totalPages = Math.ceil(totalPosts / postsPerPage)

  const goToPage = async (page: number) => {
    if (loading || page < 1 || page > totalPages || page === currentPage) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/posts?page=${page}&limit=${postsPerPage}&where=${encodeURIComponent(JSON.stringify(whereClause))}&sort=-publishedAt`,
      )

      if (response.ok) {
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          setPosts(data.docs)
          setCurrentPage(page)
          // Scroll to top of section
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
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
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Grid/List Layout */}
      <div
        className={layout === 'list' ? 'space-y-6' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'}
      >
        {posts.map((post) => (
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
          Page {currentPage} of {totalPages || 1} ({totalPosts} posts)
        </p>
      </div>
    </>
  )
}
