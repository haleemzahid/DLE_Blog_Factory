import React from 'react'
import type { AgentBlogBlock as AgentBlogBlockType, Post } from '@/payload-types'
import { Media } from '@/components/Media'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { formatDateTime } from '@/utilities/formatDateTime'

type Props = AgentBlogBlockType & {
  id?: string
}

const PostCard: React.FC<{
  post: Post
  showDate?: boolean
  showAuthor?: boolean
  showExcerpt?: boolean
}> = ({ post, showDate = true, showAuthor = true, showExcerpt = true }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.heroImage && typeof post.heroImage === 'object' && (
        <Link href={`/posts/${post.slug}`} className="block relative aspect-video">
          <Media
            resource={post.heroImage}
            fill
            className="object-cover"
          />
        </Link>
      )}
      
      <div className="p-5">
        <Link href={`/posts/${post.slug}`}>
          <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        {showExcerpt && post.meta?.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.meta.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {showAuthor && post.populatedAuthors && post.populatedAuthors.length > 0 && (
            <span>{post.populatedAuthors[0]?.name}</span>
          )}
          {showDate && post.publishedAt && (
            <span>{formatDateTime(post.publishedAt)}</span>
          )}
        </div>
        
        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex items-center text-red-600 font-semibold text-sm mt-3 hover:text-red-700"
        >
          Read more
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

export const AgentBlogBlock: React.FC<Props> = async ({
  title,
  agent,
  categories,
  limit = 6,
  layout = 'grid',
  showLoadMore = true,
  showDate = true,
  showAuthor = true,
  showExcerpt = true,
}) => {
  const payload = await getPayload({ config: configPromise })
  
  // Build query - find posts for this agent (either direct or syndicated)
  const where: Record<string, any> = {
    _status: { equals: 'published' },
  }
  
  if (agent) {
    const agentId = typeof agent === 'object' ? agent.id : agent
    // Find posts that are either:
    // 1. Directly assigned to this agent (postType: 'agent')
    // 2. Syndicated to this agent (postType: 'syndicated' and agent is in syndicatedAgents)
    where.or = [
      { agent: { equals: agentId } },
      { syndicatedAgents: { contains: agentId } },
    ]
  }
  
  if (categories && categories.length > 0) {
    const categoryIds = categories.map((cat) => 
      typeof cat === 'object' ? cat.id : cat
    )
    where.categories = { in: categoryIds }
  }
  
  const result = await payload.find({
    collection: 'posts',
    where,
    limit: limit || 6,
    sort: '-publishedAt',
  })
  
  const posts = result.docs

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}
        
        {layout === 'featured' && posts.length > 0 && (
          <div className="mb-8">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                {posts[0].heroImage && typeof posts[0].heroImage === 'object' && (
                  <div className="md:w-1/2 relative aspect-video md:aspect-auto">
                    <Media
                      resource={posts[0].heroImage}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <Link href={`/posts/${posts[0].slug}`}>
                    <h3 className="font-bold text-2xl text-gray-900 hover:text-blue-600 transition-colors mb-4">
                      {posts[0].title}
                    </h3>
                  </Link>
                  {showExcerpt && posts[0].meta?.description && (
                    <p className="text-gray-600 mb-4">
                      {posts[0].meta.description}
                    </p>
                  )}
                  <Link
                    href={`/posts/${posts[0].slug}`}
                    className="inline-flex items-center text-red-600 font-semibold"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}
        
        <div className={`
          ${layout === 'grid' || layout === 'featured' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
          ${layout === 'list' ? 'space-y-6 max-w-3xl mx-auto' : ''}
        `}>
          {(layout === 'featured' ? posts.slice(1) : posts).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showDate={showDate ?? true}
              showAuthor={showAuthor ?? true}
              showExcerpt={showExcerpt ?? true}
            />
          ))}
        </div>
        
        {showLoadMore && result.hasNextPage && (
          <div className="text-center mt-12">
            <Link
              href={agent && typeof agent === 'object' ? `/agents/${agent.slug}/blog` : '/posts'}
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Load More
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
