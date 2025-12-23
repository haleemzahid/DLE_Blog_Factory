import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Post, Category, User, Media as MediaType } from '@/payload-types'
import { ArticlesPagination, SerializedArticle } from './ArticlesPagination'

interface ArticlesSectionBlockProps {
  title?: string | null
  displayMode?: 'latest' | 'category' | 'manual' | null
  categories?: (Category | string)[] | null
  selectedPosts?: (Post | string)[] | null
  limit?: number | null
  columns?: '2' | '3' | '4' | null
  showAuthor?: boolean | null
  showDate?: boolean | null
  showExcerpt?: boolean | null
  showReadMore?: boolean | null
  enablePagination?: boolean | null
  postsPerPage?: number | null
  titleColor?: string | null
  readMoreColor?: string | null
  backgroundColor?: string | null
  blockType: 'articlesSection'
  blockName?: string | null
}

// Extract plain text from Lexical rich text content
const extractTextFromContent = (content: any, maxLength: number = 160): string => {
  if (!content || !content.root || !content.root.children) return ''

  const extractText = (nodes: any[]): string => {
    let text = ''
    for (const node of nodes) {
      if (node.type === 'text' && node.text) {
        text += node.text + ' '
      }
      if (node.children && Array.isArray(node.children)) {
        text += extractText(node.children)
      }
    }
    return text
  }

  const fullText = extractText(content.root.children).trim()
  if (fullText.length <= maxLength) return fullText
  return fullText.substring(0, maxLength).trim() + '...'
}

// Get description from meta or extract from content
const getPostDescription = (post: Post): string | null => {
  if (post.meta?.description) return post.meta.description
  if (post.content) return extractTextFromContent(post.content)
  return null
}

// Get author name from post
const getAuthorName = (post: Post): string => {
  if (post.authors && Array.isArray(post.authors) && post.authors.length > 0) {
    const author = post.authors[0]
    if (typeof author === 'object' && author !== null) {
      return (author as User).name || 'DLE Network'
    }
  }
  return 'DLE Network'
}

// Serialize post data for client component
const serializePost = (post: Post): SerializedArticle => ({
  id: post.id,
  title: post.title,
  slug: post.slug || '',
  heroImage: typeof post.heroImage === 'object' ? (post.heroImage as MediaType) : null,
  description: getPostDescription(post),
  authorName: getAuthorName(post),
  publishedAt: post.publishedAt || null,
})

export const ArticlesSectionBlock: React.FC<ArticlesSectionBlockProps> = async (props) => {
  const {
    title = 'Articles',
    displayMode = 'latest',
    categories,
    selectedPosts,
    limit = 4,
    columns = '2',
    showAuthor = true,
    showDate = true,
    showExcerpt = true,
    showReadMore = true,
    enablePagination = false,
    postsPerPage = 4,
    titleColor = '#1a1a1a',
    readMoreColor = '#dc2626',
    backgroundColor = '#ffffff',
  } = props

  const payload = await getPayload({ config: configPromise })

  let posts: Post[] = []
  const fetchLimit = enablePagination ? (limit || 100) : (limit || 4)

  if (displayMode === 'manual' && selectedPosts && selectedPosts.length > 0) {
    posts = selectedPosts
      .map((post) => (typeof post === 'object' ? post : null))
      .filter((p): p is Post => p !== null)
  } else if (displayMode === 'category' && categories && categories.length > 0) {
    const categoryIds = categories.map((cat) => (typeof cat === 'object' ? cat.id : cat))
    const result = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
        categories: { in: categoryIds },
      },
      limit: fetchLimit,
      sort: '-publishedAt',
      depth: 2,
    })
    posts = result.docs
  } else {
    const result = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
      },
      limit: fetchLimit,
      sort: '-publishedAt',
      depth: 2,
    })
    posts = result.docs
  }

  if (posts.length === 0) return null

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

  return (
    <section
      id="articles-section"
      className="py-12"
      style={{ backgroundColor: backgroundColor || '#ffffff' }}
    >
      <div className="container mx-auto px-4">
        {/* Title with yellow highlight */}
        {title && (
          <div className="mb-8">
            <h2
              className="text-2xl font-bold inline-block px-2 py-1"
              style={{
                color: titleColor || '#1a1a1a',
                backgroundColor: '#fde047',
              }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Paginated or Static View */}
        {enablePagination ? (
          <ArticlesPagination
            articles={posts.map(serializePost)}
            postsPerPage={postsPerPage || 4}
            columns={columns || '2'}
            showAuthor={showAuthor ?? true}
            showDate={showDate ?? true}
            showExcerpt={showExcerpt ?? true}
            showReadMore={showReadMore ?? true}
            readMoreColor={readMoreColor || '#dc2626'}
          />
        ) : (
          <div className={`grid ${getGridCols()} gap-8`}>
            {posts.map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                showAuthor={showAuthor ?? true}
                showDate={showDate ?? true}
                showExcerpt={showExcerpt ?? true}
                showReadMore={showReadMore ?? true}
                readMoreColor={readMoreColor || '#dc2626'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface ArticleCardProps {
  post: Post
  showAuthor: boolean
  showDate: boolean
  showExcerpt: boolean
  showReadMore: boolean
  readMoreColor: string
}

function ArticleCard({
  post,
  showAuthor,
  showDate,
  showExcerpt,
  showReadMore,
  readMoreColor,
}: ArticleCardProps) {
  const description = getPostDescription(post)
  const authorName = getAuthorName(post)

  return (
    <article className="flex flex-col">
      {/* Image */}
      <Link href={`/posts/${post.slug}`} className="block">
        {post.heroImage && typeof post.heroImage === 'object' && (
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
            <Media resource={post.heroImage} fill className="object-cover" />
          </div>
        )}
      </Link>

      {/* Title */}
      <Link href={`/posts/${post.slug}`}>
        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
      </Link>

      {/* Author and Date */}
      {(showAuthor || showDate) && (
        <div className="text-sm text-gray-500 mb-2">
          {showAuthor && (
            <span style={{ color: readMoreColor }}>{authorName}</span>
          )}
          {showAuthor && showDate && ' / '}
          {showDate && post.publishedAt && (
            <span>{formatDateTime(post.publishedAt)}</span>
          )}
          {' / '}
          <span>No Comments</span>
        </div>
      )}

      {/* Excerpt */}
      {showExcerpt && description && (
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{description}</p>
      )}

      {/* Read More */}
      {showReadMore && (
        <Link
          href={`/posts/${post.slug}`}
          className="text-sm font-medium inline-flex items-center gap-1 mt-auto"
          style={{ color: readMoreColor }}
        >
          Read More »
        </Link>
      )}
    </article>
  )
}
