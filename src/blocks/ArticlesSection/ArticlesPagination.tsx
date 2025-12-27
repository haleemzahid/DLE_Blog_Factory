'use client'

import React, { useState } from 'react'
import type { Media as MediaType } from '@/payload-types'
import { ArticleCard, type ArticleCardData } from '@/components/Card/ArticleCard'
import { ArticlePagination } from '@/components/Pagination/ArticlePagination'

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className={`grid ${getGridCols()} gap-8`}>
        {currentArticles.map((article, index) => (
          <ArticleCard
            key={`${article.id}-${index}`}
            article={article as ArticleCardData}
            showAuthor={showAuthor}
            showDate={showDate}
            showExcerpt={showExcerpt}
            showReadMore={showReadMore}
            accentColor={readMoreColor}
          />
        ))}
      </div>

      {/* Pagination - only show if more than 1 page */}
      {totalPages > 1 && (
        <ArticlePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={articles.length}
          onPageChange={handlePageChange}
          itemLabel="posts"
          showPageInfo={false}
        />
      )}
    </>
  )
}
