import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Post, Agent, CityDatum, Tenant } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { AnalyticsTracker } from '@/components/Analytics'
import { BlogContentRenderer } from '@/components/BlogContentRenderer'
import { BlogPostJsonLd } from '@/components/AgentJsonLd'
import { replaceTokens } from '@/utilities/replaceTokens'
import { renderPostForAgent } from '@/utilities/renderPostForAgent'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
      authors: true,
    },
  })

  const params = posts.docs.flatMap((post) => {
    const author = post.authors?.[0]
    let agentSlug: string | null = null

    if (author && typeof author === 'object') {
      const authorObj = author as any
      if (authorObj.value && typeof authorObj.value === 'object') {
        agentSlug = authorObj.value.slug || null
      } else if (authorObj.slug) {
        agentSlug = authorObj.slug
      }
    }

    // Return both URL patterns for each post
    const paths = []

    // General URL: /posts/[slug]
    paths.push({ slug: [post.slug] })

    // Agent-specific URL: /posts/[agentSlug]/[slug]
    if (agentSlug) {
      paths.push({ slug: [agentSlug, post.slug] })
    }

    return paths
  })

  return params
}

type Args = {
  params: Promise<{
    slug: string[]
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: slugArray = [] } = await paramsPromise

  // Determine if this is agent-specific URL or general URL
  // Agent-specific: /posts/[agentSlug]/[slug] -> slugArray has 2 elements
  // General: /posts/[slug] -> slugArray has 1 element
  const isAgentSpecific = slugArray.length === 2
  const postSlug = isAgentSpecific ? slugArray[1] : slugArray[0]
  const agentSlug = isAgentSpecific ? slugArray[0] : null

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(postSlug)
  const url = isAgentSpecific
    ? `/posts/${decodeURIComponent(agentSlug!)}/${decodedSlug}`
    : `/posts/${decodedSlug}`

  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  // Get agent ID from post authors
  const getAgentId = (): string | undefined => {
    const author = post.authors?.[0]
    if (!author || typeof author !== 'object') return undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authorObj = author as any
    if (authorObj.value) {
      return typeof authorObj.value === 'string' ? authorObj.value : String(authorObj.value?.id)
    }
    return authorObj.id ? String(authorObj.id) : undefined
  }
  const agentId = getAgentId()

  // Fetch agent and cityData for token replacement
  let agent: Agent | null = null
  let cityData: CityDatum | null = null
  if (agentId) {
    const result = await queryAgentWithCityData(agentId)
    agent = result.agent
    cityData = result.cityData
  }

  // Check if this post uses template-based rendering
  const useTemplate = (post as any).useTemplate === true

  // If using template rendering, generate dynamic content
  let templateContent: string | null = null
  let templateMeta: { title: string; description: string; canonicalUrl: string; noIndex: boolean } | null = null

  if (useTemplate) {
    // Also fetch cityData from post's targetCityData if not already available
    let effectiveCityData = cityData
    const targetCityDataId = (post as any).targetCityData
    if (!effectiveCityData && targetCityDataId) {
      const cityResult = await queryCityDataById(
        typeof targetCityDataId === 'object' ? targetCityDataId.id : targetCityDataId
      )
      effectiveCityData = cityResult
    }

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
    const renderResult = renderPostForAgent({
      post,
      agent,
      cityData: effectiveCityData,
      tenant: null, // Could be passed in for multi-tenant rendering
      baseUrl,
    })

    templateContent = renderResult.content
    templateMeta = renderResult.meta
  }

  // Get hero image URL for JSON-LD
  const heroImageUrl = (() => {
    const heroImage = post.heroImage
    if (heroImage && typeof heroImage === 'object' && 'url' in heroImage) {
      return heroImage.url as string
    }
    return undefined
  })()

  // Get meta description for JSON-LD
  const metaDescription = templateMeta?.description || post.meta?.description || ''

  // Extract keywords from structured keyword groups for JSON-LD
  const extractedKeywords = (() => {
    const keywords = (post.meta as any)?.keywords
    if (!keywords) return undefined
    const all: string[] = []
    if (keywords.primary) {
      all.push(...keywords.primary.map((k: { keyword?: string }) => k.keyword).filter(Boolean))
    }
    if (keywords.secondary) {
      all.push(...keywords.secondary.map((k: { keyword?: string }) => k.keyword).filter(Boolean))
    }
    return all.length > 0 ? all : undefined
  })()

  return (
    <article className="pt-16 pb-16">
      {/* JSON-LD Structured Data for Blog Post */}
      {agent && (
        <BlogPostJsonLd
          title={templateMeta?.title || post.title}
          description={metaDescription}
          content={templateContent || ''}
          author={agent}
          datePublished={post.publishedAt || post.createdAt}
          dateModified={post.updatedAt}
          imageUrl={heroImageUrl}
          slug={post.slug || ''}
          keywords={extractedKeywords}
        />
      )}

      {/* Analytics Tracker for post-specific tracking */}
      <AnalyticsTracker postId={String(post.id)} postSlug={post.slug || ''} agentId={agentId} />

      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          {useTemplate && templateContent ? (
            // Render template-generated content
            <div
              className="max-w-[48rem] mx-auto prose prose-slate dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: templateContent }}
            />
          ) : post.content ? (
            <BlogContentRenderer
              content={post.content}
              enableGutter={false}
              enableProse={true}
              className="max-w-[48rem] mx-auto"
              agent={agent}
              cityData={cityData}
              enableTokenReplacement={true}
            />
          ) : (
            <div className="max-w-[48rem] mx-auto">
              <p>No content available</p>
            </div>
          )}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug: slugArray = [] } = await paramsPromise

  // Determine post slug based on URL pattern
  const postSlug = slugArray.length === 2 ? slugArray[1] : slugArray[0]
  const decodedSlug = decodeURIComponent(postSlug)

  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) {
    return generateMeta({ doc: post })
  }

  // Get agent ID to fetch agent and cityData for token replacement in metadata
  const getAgentId = (): string | undefined => {
    const author = post.authors?.[0]
    if (!author || typeof author !== 'object') return undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authorObj = author as any
    if (authorObj.value) {
      return typeof authorObj.value === 'string' ? authorObj.value : String(authorObj.value?.id)
    }
    return authorObj.id ? String(authorObj.id) : undefined
  }
  const agentId = getAgentId()

  // Fetch agent and cityData for token replacement in metadata
  let agent: Agent | null = null
  let cityData: CityDatum | null = null
  if (agentId) {
    const result = await queryAgentWithCityData(agentId)
    agent = result.agent
    cityData = result.cityData
  }

  // Generate base metadata
  const baseMeta = await generateMeta({ doc: post })

  // Apply token replacement to title and description if agent/cityData is available
  if (agent || cityData) {
    const tokenContext = { agent, cityData }

    if (baseMeta.title && typeof baseMeta.title === 'string') {
      baseMeta.title = replaceTokens(baseMeta.title, tokenContext)
    }

    if (baseMeta.description) {
      baseMeta.description = replaceTokens(baseMeta.description, tokenContext)
    }

    // Also update openGraph if present
    if (baseMeta.openGraph) {
      if (baseMeta.openGraph.title && typeof baseMeta.openGraph.title === 'string') {
        baseMeta.openGraph.title = replaceTokens(baseMeta.openGraph.title, tokenContext)
      }
      if (baseMeta.openGraph.description) {
        baseMeta.openGraph.description = replaceTokens(baseMeta.openGraph.description, tokenContext)
      }
    }

    // Update twitter if present
    if (baseMeta.twitter) {
      if (baseMeta.twitter.title && typeof baseMeta.twitter.title === 'string') {
        baseMeta.twitter.title = replaceTokens(baseMeta.twitter.title, tokenContext)
      }
      if (baseMeta.twitter.description) {
        baseMeta.twitter.description = replaceTokens(baseMeta.twitter.description, tokenContext)
      }
    }
  }

  return baseMeta
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

/**
 * Fetch agent and their cityData for token replacement
 */
const queryAgentWithCityData = cache(
  async (agentId: string): Promise<{ agent: Agent | null; cityData: CityDatum | null }> => {
    const payload = await getPayload({ config: configPromise })

    try {
      // Fetch the full agent record
      const agent = await payload.findByID({
        collection: 'agents',
        id: agentId,
        depth: 2,
      })

      if (!agent) {
        return { agent: null, cityData: null }
      }

      // Fetch cityData based on agent's city
      let cityData: CityDatum | null = null
      if (agent.city) {
        const cityResult = await payload.find({
          collection: 'cityData',
          where: {
            cityName: {
              equals: agent.city,
            },
          },
          limit: 1,
          depth: 1,
        })
        cityData = cityResult.docs?.[0] || null
      }

      return { agent, cityData }
    } catch (error) {
      console.error('Error fetching agent with cityData:', error)
      return { agent: null, cityData: null }
    }
  },
)

/**
 * Fetch cityData by ID for template rendering
 */
const queryCityDataById = cache(async (cityDataId: string | number): Promise<CityDatum | null> => {
  const payload = await getPayload({ config: configPromise })

  try {
    const cityData = await payload.findByID({
      collection: 'cityData',
      id: String(cityDataId),
      depth: 1,
    })

    return cityData || null
  } catch (error) {
    console.error('Error fetching cityData:', error)
    return null
  }
})
