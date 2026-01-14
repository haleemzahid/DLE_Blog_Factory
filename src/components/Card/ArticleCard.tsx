'use client'

import React from 'react'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Media as MediaType } from '@/payload-types'

// =============================================================================
// GLOBAL CARD STYLES - Change these values to update all cards across the project
// =============================================================================
export const cardStyles = {
  // Card container styles
  wrapper: 'block group h-full',
  container: 'bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow h-full flex flex-col',

  // Image styles
  imageWrapper: 'relative aspect-[16/10]',
  image: 'object-cover',

  // Content wrapper
  content: 'p-6 flex-1 flex flex-col',

  // Title styles
  title: 'text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2',

  // Meta info (author, date)
  meta: 'text-sm text-gray-500 dark:text-gray-400 mb-2',

  // Excerpt/description
  excerpt: 'text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3 flex-1',

  // Read more link
  readMore: 'text-sm font-medium inline-flex items-center gap-1 mt-auto',
  readMoreIcon: 'w-3 h-3 group-hover:translate-x-1 transition-transform',
}

// =============================================================================
// ARTICLE CARD DATA INTERFACE
// =============================================================================
export interface ArticleCardData {
  id: number
  title: string
  slug: string
  heroImage: MediaType | null
  description: string | null
  authorName: string
  publishedAt: string | null
  agentSlug?: string | null // Optional: agent slug for agent-specific URLs
  agentLogo?: MediaType | null // Optional: agent logo to display on card
}

// =============================================================================
// ARTICLE CARD PROPS
// =============================================================================
interface ArticleCardProps {
  article: ArticleCardData
  showAuthor?: boolean
  showDate?: boolean
  showExcerpt?: boolean
  showReadMore?: boolean
  accentColor?: string
}

// =============================================================================
// ARTICLE CARD COMPONENT
// =============================================================================
export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  showAuthor = true,
  showDate = true,
  showExcerpt = true,
  showReadMore = true,
  accentColor = '#dc2626',
}) => {
  // Construct URL based on whether it's agent-specific or general
  const postUrl = article.agentSlug
    ? `/posts/${article.agentSlug}/${article.slug}`
    : `/posts/${article.slug}`

  // DEBUG: Log URL construction
  console.log('🎴 ArticleCard URL:', {
    title: article.title,
    slug: article.slug,
    agentSlug: article.agentSlug,
    finalUrl: postUrl,
  })

  return (
    <Link href={postUrl} className={cardStyles.wrapper}>
      <article className={cardStyles.container}>
        {/* Image with Logo Overlay */}
        {article.heroImage && (
          <div className={cardStyles.imageWrapper}>
            <Media resource={article.heroImage} fill className={cardStyles.image} />

            {/* Agent Logo Overlay - Top Left Corner */}
            {article.agentLogo && (
              <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-lg shadow-lg p-2 z-10">
                <Media resource={article.agentLogo} className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cardStyles.content}>
          {/* Title */}
          <h3 className={cardStyles.title}>
            {article.title}
          </h3>

          {/* Author and Date */}
          {(showAuthor || showDate) && (
            <div className={cardStyles.meta}>
              {showAuthor && <span style={{ color: accentColor }}>{article.authorName}</span>}
              {showAuthor && showDate && ' / '}
              {showDate && article.publishedAt && <span>{formatDateTime(article.publishedAt)}</span>}
              {' / '}
              <span>No Comments</span>
            </div>
          )}

          {/* Excerpt */}
          {showExcerpt && article.description && (
            <p className={cardStyles.excerpt}>{article.description}</p>
          )}

          {/* Read More */}
          {showReadMore && (
            <span className={cardStyles.readMore} style={{ color: accentColor }}>
              Read More »
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}
