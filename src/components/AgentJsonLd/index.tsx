import React from 'react'
import type { Agent, CityDatum } from '@/payload-types'
import {
  generateAgentPageJsonLd,
  generateBlogPostingJsonLd,
  serializeJsonLd,
} from '@/utilities/generateAgentJsonLd'

interface AgentJsonLdProps {
  agent: Agent
  cityData?: CityDatum | null
}

/**
 * Component that renders JSON-LD structured data for an agent page
 * Include this component in the agent page to add schema.org markup
 */
export function AgentJsonLd({ agent, cityData }: AgentJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  // Check if JSON-LD is enabled for this agent
  const jsonLdConfig = (agent as any).seo?.jsonLd
  if (jsonLdConfig?.enabled === false) {
    return null
  }

  // Generate all schemas for the agent page
  const schemas = generateAgentPageJsonLd(agent, baseUrl, cityData)

  if (schemas.length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemas) }}
    />
  )
}

interface BlogPostJsonLdProps {
  title: string
  description: string
  content?: string
  author: Agent
  datePublished: string
  dateModified?: string
  imageUrl?: string
  slug: string
  keywords?: string[]
}

/**
 * Component that renders JSON-LD structured data for a blog post
 */
export function BlogPostJsonLd({
  title,
  description,
  content,
  author,
  datePublished,
  dateModified,
  imageUrl,
  slug,
  keywords,
}: BlogPostJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

  const schema = generateBlogPostingJsonLd({
    title,
    description,
    content,
    author,
    datePublished,
    dateModified,
    imageUrl,
    baseUrl,
    slug,
    keywords,
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  )
}

interface FAQJsonLdProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

/**
 * Component that renders FAQPage JSON-LD structured data
 */
export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  if (!faqs || faqs.length === 0) {
    return null
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

/**
 * Combine multiple JSON-LD scripts into a single array
 * This is useful when you want to include multiple schema types on a page
 */
interface CombinedJsonLdProps {
  schemas: object[]
}

export function CombinedJsonLd({ schemas }: CombinedJsonLdProps) {
  if (!schemas || schemas.length === 0) {
    return null
  }

  // If only one schema, output it directly
  // If multiple, wrap in an array
  const output = schemas.length === 1 ? schemas[0] : schemas

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(output, null, 2) }}
    />
  )
}

export default AgentJsonLd
