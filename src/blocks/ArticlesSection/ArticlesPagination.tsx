'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Media as MediaType } from '@/payload-types'

// Serializable article data interface
export interface SerializedArticle {
  id: number
  title: string
  slug: string
  heroImage: MediaType | null
  description: string | null
  authorName: string
  publishedAt: string | null
}

interface ArticlesPaginationProps {
  articles: SerializedArticle[]
  postsPerPage: number
  columns: '2' | '3' | '4'
  showAuthor: boolean
  showDate: boolean
  showExcerpt: boolean
  showReadMore: boolean
  readMoreColor: string
}

export const ArticlesPagination: React.FC<ArticlesPaginationProps> = ({
  articles,
  postsPerPage,
  columns,
  showAuthor,
  showDate,
  showExcerpt,
  showReadMore,
  readMoreColor,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(articles.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentArticles = articles.slice(startIndex, endIndex)

  const getGridCols = () => {
    switch (columns) {
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      case '3':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2'
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className={`grid ${getGridCols()} gap-8`}>
        {currentArticles.map((article, index) => (
          <ArticleCard
            key={`${article.id}-${index}`}
            article={article}
            showAuthor={showAuthor}
            showDate={showDate}
            showExcerpt={showExcerpt}
            showReadMore={showReadMore}
            readMoreColor={readMoreColor}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
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
        </div>
      )}
    </>
  )
}

interface ArticleCardProps {
  article: SerializedArticle
  showAuthor: boolean
  showDate: boolean
  showExcerpt: boolean
  showReadMore: boolean
  readMoreColor: string
}

function ArticleCard({
  article,
  showAuthor,
  showDate,
  showExcerpt,
  showReadMore,
  readMoreColor,
}: ArticleCardProps) {
  return (
    <article className="flex flex-col">
      {/* Image */}
      <Link href={`/posts/${article.slug}`} className="block">
        {article.heroImage && (
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
            <Media resource={article.heroImage} fill className="object-cover" />
          </div>
        )}
      </Link>

      {/* Title */}
      <Link href={`/posts/${article.slug}`}>
        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
          {article.title}
        </h3>
      </Link>

      {/* Author and Date */}
      {(showAuthor || showDate) && (
        <div className="text-sm text-gray-500 mb-2">
          {showAuthor && <span style={{ color: readMoreColor }}>{article.authorName}</span>}
          {showAuthor && showDate && ' / '}
          {showDate && article.publishedAt && <span>{formatDateTime(article.publishedAt)}</span>}
          {' / '}
          <span>No Comments</span>
        </div>
      )}

      {/* Excerpt */}
      {showExcerpt && article.description && (
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{article.description}</p>
      )}

      {/* Read More */}
      {showReadMore && (
        <Link
          href={`/posts/${article.slug}`}
          className="text-sm font-medium inline-flex items-center gap-1 mt-auto"
          style={{ color: readMoreColor }}
        >
          Read More »
        </Link>
      )}
    </article>
  )
}
