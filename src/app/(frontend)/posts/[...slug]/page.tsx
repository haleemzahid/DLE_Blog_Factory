import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { AnalyticsTracker } from '@/components/Analytics'
import { ClientOnlyRichText } from './ClientOnlyRichText'

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

  return (
    <article className="pt-16 pb-16">
      {/* Analytics Tracker for post-specific tracking */}
      <AnalyticsTracker postId={String(post.id)} postSlug={post.slug || ''} agentId={agentId} />

      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          {post.content ? (
            <ClientOnlyRichText content={post.content} />
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

  return generateMeta({ doc: post })
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
