import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Agent } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { AgentHero } from './AgentHero'
import { AgentProfile } from './AgentProfile'
import { PlaceholderAgentPage } from './PlaceholderAgentPage'
import { HomeValueFormBlock } from '@/blocks/HomeValueForm/Component'
import { TestimonialsBlockComponent } from '@/blocks/TestimonialsBlock/Component'
import { ServicesGridBlock } from '@/blocks/ServicesGrid/Component'
import { AgentGalleryBlock } from '@/blocks/AgentGallery/Component'
import { FAQBlockComponent } from '@/blocks/FAQBlock/Component'
import { AgentBlogBlock } from '@/blocks/AgentBlog/Component'
import { AgentContactBlock } from '@/blocks/AgentContact/Component'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const agents = await payload.find({
    collection: 'agents',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = agents.docs
    .filter((doc) => doc.slug)
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function AgentPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/agents/' + slug
  const agent = await queryAgentBySlug({ slug })

  // If no agent found, check if it's a valid designation format (mr-city or ms-city)
  if (!agent) {
    const designationMatch = slug.match(/^(mr|ms|mrs)-(.+)$/)

    if (designationMatch) {
      const [, prefix, citySlug] = designationMatch

      // Convert slug to display format
      const cityName = citySlug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      const prefixDisplay = prefix.charAt(0).toUpperCase() + prefix.slice(1) + '.'
      const designationName = `${prefixDisplay} ${cityName} ™`

      // Default to California for now (could be enhanced to detect state from slug or database)
      return (
        <PlaceholderAgentPage
          designationName={designationName}
          city={cityName}
          state="California"
        />
      )
    }

    // If not a valid designation format, show 404
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="pb-16">
      <PayloadRedirects disableNotFound url={url} />

      {/* Hero Section */}
      <AgentHero agent={agent} />

      {/* Home Value Form */}
      <HomeValueFormBlock
        title="What's My Home Worth?"
        description={`Get instant access to all the homes that sold in your neighborhood from ${agent.displayName}'s Exclusive Real Estate Network.`}
        inputPlaceholder="Enter Your Home Address"
        buttonText="CONTINUE"
        widgetUrl={agent.homeValueWidgetUrl || undefined}
        style="centered"
        blockType="homeValueForm"
      />

      {/* Agent Profile/Bio */}
      <AgentProfile agent={agent} />

      {/* Testimonials */}
      <TestimonialsBlockComponent
        title={`What People Say About ${agent.displayName}`}
        subtitle="Client Testimonials"
        agent={agent}
        limit={6}
        layout="grid"
        showRatings={true}
        showPhotos={true}
        showSource={true}
        blockType="testimonialsBlock"
      />

      {/* Services */}
      {agent.services && agent.services.length > 0 && (
        <ServicesGridBlock
          title={`${agent.displayName} Services`}
          services={agent.services.map((service) => ({
            ...service,
            link: { type: 'none' as const, label: 'Learn More' },
          }))}
          layout="twoColumn"
          showIcons={true}
          blockType="servicesGrid"
        />
      )}

      {/* Gallery */}
      {agent.gallery && agent.gallery.length > 0 && (
        <AgentGalleryBlock
          title={`${agent.displayName} Gallery`}
          resolvedImages={agent.gallery.map((item) => ({
            image: item.image as any,
            caption: item.caption,
          }))}
          layout="grid"
          columns="3"
          enableLightbox={true}
          blockType="agentGallery"
        />
      )}

      {/* Blog */}
      <AgentBlogBlock
        title={`${agent.displayName} Blog`}
        agent={agent}
        limit={9}
        layout="grid"
        enablePagination={true}
        showDate={true}
        showAuthor={true}
        showExcerpt={true}
        blockType="agentBlog"
      />

      {/* FAQs */}
      {agent.faqs && agent.faqs.length > 0 && (
        <FAQBlockComponent
          title={`${agent.displayName} FAQs`}
          resolvedFaqs={agent.faqs}
          layout="accordion"
          defaultOpen={false}
          blockType="faqBlock"
        />
      )}

      {/* Contact Section */}
      <AgentContactBlock
        title="Contact"
        resolvedAgent={agent}
        showBio={true}
        showPhoto={true}
        showSocialLinks={true}
        showWorkingHours={true}
        showContactForm={true}
        layout="twoColumn"
        backgroundColor="white"
        blockType="agentContact"
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const agent = await queryAgentBySlug({ slug })

  return generateMeta({ doc: agent })
}

const queryAgentBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'agents',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
