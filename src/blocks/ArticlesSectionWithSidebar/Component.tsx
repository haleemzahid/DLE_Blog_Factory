import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Post, Category, User, Media as MediaType, Agent } from '@/payload-types'
import { ArticlesWithSidebarPagination, SerializedArticle } from './ArticlesWithSidebarPagination'

interface ArticlesSectionWithSidebarBlockProps {
  title?: string | null
  displayMode?: 'latest' | 'category' | 'manual' | null
  categories?: (Category | string)[] | null
  selectedPosts?: (Post | string)[] | null
  limit?: number | null
  columns?: '1' | '2' | null
  showAuthor?: boolean | null
  showDate?: boolean | null
  showExcerpt?: boolean | null
  showReadMore?: boolean | null
  enablePagination?: boolean | null
  postsPerPage?: number | null
  showSidebar?: boolean | null
  sidebarAgent?: Agent | string | null
  showContactInfo?: boolean | null
  showSocialLinks?: boolean | null
  showFeaturedOn?: boolean | null
  featuredOnLogos?: { logo: MediaType | string; name?: string | null; link?: string | null }[] | null
  titleColor?: string | null
  titleBgColor?: string | null
  accentColor?: string | null
  backgroundColor?: string | null
  blockType: 'articlesSidebar'
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

// Serialize agent data for client component
interface SerializedAgent {
  name: string
  displayName?: string | null
  phone?: string | null
  email?: string | null
  address?: {
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
  } | null
  workingHours?: { day?: string | null; hours?: string | null }[] | null
  socialLinks?: {
    facebook?: string | null
    instagram?: string | null
    linkedin?: string | null
    youtube?: string | null
    twitter?: string | null
    pinterest?: string | null
    tiktok?: string | null
    googleMaps?: string | null
  } | null
}

const serializeAgent = (agent: Agent): SerializedAgent => ({
  name: agent.name,
  displayName: agent.displayName,
  phone: agent.phone,
  email: agent.email,
  address: agent.address,
  workingHours: agent.workingHours,
  socialLinks: agent.socialLinks,
})

interface SerializedLogo {
  url: string
  alt: string
  name?: string | null
  link?: string | null
}

export const ArticlesSectionWithSidebarBlock: React.FC<ArticlesSectionWithSidebarBlockProps> = async (props) => {
  const {
    title = 'Articles',
    displayMode = 'latest',
    categories,
    selectedPosts,
    limit = 6,
    columns = '2',
    showAuthor = true,
    showDate = true,
    showExcerpt = true,
    showReadMore = true,
    enablePagination = true,
    postsPerPage = 6,
    showSidebar = true,
    sidebarAgent,
    showContactInfo = true,
    showSocialLinks = true,
    showFeaturedOn = true,
    featuredOnLogos,
    titleColor = '#1a1a1a',
    titleBgColor = '#fde047',
    accentColor = '#dc2626',
    backgroundColor = '#ffffff',
  } = props

  const payload = await getPayload({ config: configPromise })

  let posts: Post[] = []
  const fetchLimit = enablePagination ? (limit || 100) : (limit || 6)

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

  // Get agent data if needed
  let agent: Agent | null = null
  if (showSidebar && sidebarAgent) {
    if (typeof sidebarAgent === 'object') {
      agent = sidebarAgent
    } else {
      const agentResult = await payload.findByID({
        collection: 'agents',
        id: sidebarAgent,
      })
      agent = agentResult
    }
  }

  // Serialize logos
  const serializedLogos: SerializedLogo[] = featuredOnLogos
    ? featuredOnLogos
        .filter((item) => item.logo && typeof item.logo === 'object')
        .map((item) => ({
          url: (item.logo as MediaType).url || '',
          alt: (item.logo as MediaType).alt || item.name || 'Logo',
          name: item.name,
          link: item.link,
        }))
    : []

  if (posts.length === 0) return null

  return (
    <section
      id="articles-section-sidebar"
      className="py-12"
      style={{ backgroundColor: backgroundColor || '#ffffff' }}
    >
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${showSidebar ? 'lg:flex-row gap-8' : ''}`}>
          {/* Main Content Area */}
          <div className={showSidebar ? 'lg:w-2/3' : 'w-full'}>
            {/* Title with background */}
            {title && (
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold inline-block px-3 py-1"
                  style={{
                    color: titleColor || '#1a1a1a',
                    backgroundColor: titleBgColor || '#fde047',
                  }}
                >
                  {title}
                </h2>
              </div>
            )}

            {/* Articles */}
            {enablePagination ? (
              <ArticlesWithSidebarPagination
                articles={posts.map(serializePost)}
                postsPerPage={postsPerPage || 6}
                columns={columns || '2'}
                showAuthor={showAuthor ?? true}
                showDate={showDate ?? true}
                showExcerpt={showExcerpt ?? true}
                showReadMore={showReadMore ?? true}
                accentColor={accentColor || '#dc2626'}
              />
            ) : (
              <div className={`grid ${columns === '1' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-8`}>
                {posts.map((post) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    showAuthor={showAuthor ?? true}
                    showDate={showDate ?? true}
                    showExcerpt={showExcerpt ?? true}
                    showReadMore={showReadMore ?? true}
                    accentColor={accentColor || '#dc2626'}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <aside className="lg:w-1/3">
              <div className="sticky top-4 space-y-6">
                {/* Contact Info */}
                {showContactInfo && agent && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
                    <div className="space-y-3 text-sm">
                      {agent.phone && (
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${agent.phone}`} className="text-gray-700 hover:text-gray-900">
                            {agent.phone}
                          </a>
                        </div>
                      )}
                      {agent.email && (
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${agent.email}`} className="text-gray-700 hover:text-gray-900 break-all">
                            {agent.email}
                          </a>
                        </div>
                      )}
                      {agent.address && (agent.address.street || agent.address.city) && (
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="text-gray-700">
                            {agent.address.street && <div>{agent.address.street}</div>}
                            {(agent.address.city || agent.address.state || agent.address.zip) && (
                              <div>
                                {agent.address.city}{agent.address.city && agent.address.state ? ', ' : ''}
                                {agent.address.state} {agent.address.zip}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Working Hours */}
                    {agent.workingHours && agent.workingHours.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Working Hours</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {agent.workingHours.map((wh, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="capitalize">{wh.day}</span>
                              <span>{wh.hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Social Links */}
                {showSocialLinks && agent?.socialLinks && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                    <div className="flex flex-wrap gap-3">
                      {agent.socialLinks.facebook && (
                        <SocialLink href={agent.socialLinks.facebook} icon="facebook" />
                      )}
                      {agent.socialLinks.instagram && (
                        <SocialLink href={agent.socialLinks.instagram} icon="instagram" />
                      )}
                      {agent.socialLinks.linkedin && (
                        <SocialLink href={agent.socialLinks.linkedin} icon="linkedin" />
                      )}
                      {agent.socialLinks.youtube && (
                        <SocialLink href={agent.socialLinks.youtube} icon="youtube" />
                      )}
                      {agent.socialLinks.twitter && (
                        <SocialLink href={agent.socialLinks.twitter} icon="twitter" />
                      )}
                      {agent.socialLinks.pinterest && (
                        <SocialLink href={agent.socialLinks.pinterest} icon="pinterest" />
                      )}
                      {agent.socialLinks.tiktok && (
                        <SocialLink href={agent.socialLinks.tiktok} icon="tiktok" />
                      )}
                    </div>
                  </div>
                )}

                {/* Featured On */}
                {showFeaturedOn && serializedLogos.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Featured On</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {serializedLogos.map((logo, idx) => (
                        <div key={idx} className="flex items-center justify-center p-2 bg-white rounded">
                          {logo.link ? (
                            <a href={logo.link} target="_blank" rel="noopener noreferrer">
                              <img src={logo.url} alt={logo.alt} className="max-h-12 w-auto object-contain" />
                            </a>
                          ) : (
                            <img src={logo.url} alt={logo.alt} className="max-h-12 w-auto object-contain" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}

// Social Link Component
function SocialLink({ href, icon }: { href: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    pinterest: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 transition-colors"
    >
      {icons[icon]}
    </a>
  )
}

// Article Card Component (for non-paginated view)
interface ArticleCardProps {
  post: Post
  showAuthor: boolean
  showDate: boolean
  showExcerpt: boolean
  showReadMore: boolean
  accentColor: string
}

function ArticleCard({
  post,
  showAuthor,
  showDate,
  showExcerpt,
  showReadMore,
  accentColor,
}: ArticleCardProps) {
  const description = getPostDescription(post)
  const authorName = getAuthorName(post)

  return (
    <article className="flex flex-col">
      <Link href={`/posts/${post.slug}`} className="block">
        {post.heroImage && typeof post.heroImage === 'object' && (
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
            <Media resource={post.heroImage} fill className="object-cover" />
          </div>
        )}
      </Link>

      <Link href={`/posts/${post.slug}`}>
        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
      </Link>

      {(showAuthor || showDate) && (
        <div className="text-sm text-gray-500 mb-2">
          {showAuthor && <span style={{ color: accentColor }}>{authorName}</span>}
          {showAuthor && showDate && ' / '}
          {showDate && post.publishedAt && <span>{formatDateTime(post.publishedAt)}</span>}
          {' / '}
          <span>No Comments</span>
        </div>
      )}

      {showExcerpt && description && (
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{description}</p>
      )}

      {showReadMore && (
        <Link
          href={`/posts/${post.slug}`}
          className="text-sm font-medium inline-flex items-center gap-1 mt-auto"
          style={{ color: accentColor }}
        >
          Read More »
        </Link>
      )}
    </article>
  )
}
