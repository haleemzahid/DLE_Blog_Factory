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

interface ArticlesWithSidebarPaginationProps {
  articles: SerializedArticle[]
  postsPerPage: number
  columns: '1' | '2'
  showAuthor: boolean
  showDate: boolean
  showExcerpt: boolean
  showReadMore: boolean
  accentColor: string
}

export const ArticlesWithSidebarPagination: React.FC<ArticlesWithSidebarPaginationProps> = ({
  articles,
  postsPerPage,
  columns,
  showAuthor,
  showDate,
  showExcerpt,
  showReadMore,
  accentColor,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(articles.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentArticles = articles.slice(startIndex, endIndex)

  const getGridCols = () => {
    switch (columns) {
      case '1':
        return 'grid-cols-1'
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      default:
        return 'grid-cols-1 md:grid-cols-2'
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    document.getElementById('articles-section-sidebar')?.scrollIntoView({ behavior: 'smooth' })
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
            accentColor={accentColor}
          />
        ))}
      </div>

      {/* Pagination */}
      <ArticlePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={articles.length}
        onPageChange={handlePageChange}
        itemLabel="posts"
      />
    </>
  )
}
