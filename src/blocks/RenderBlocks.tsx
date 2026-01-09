import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { HomeValueFormBlock } from '@/blocks/HomeValueForm/Component'
import { TestimonialsBlockComponent } from '@/blocks/TestimonialsBlock/Component'
import { ServicesGridBlock } from '@/blocks/ServicesGrid/Component'
import { AgentGalleryBlock } from '@/blocks/AgentGallery/Component'
import { FAQBlockComponent } from '@/blocks/FAQBlock/Component'
import { AgentBlogBlock } from '@/blocks/AgentBlog/Component'
import { AgentContactBlock } from '@/blocks/AgentContact/Component'
import { DirectoryListingBlock } from '@/blocks/DirectoryListing/Component'
import { HomepageBlogBlock } from '@/blocks/HomepageBlog/Component'
import { VideoEmbedBlock } from '@/blocks/VideoEmbed/Component'
import { TeamSectionBlock } from '@/blocks/TeamSection/Component'
import { PartnersLogosBlock } from '@/blocks/PartnersLogos/Component'
import { FeaturedAgentsBlock } from '@/blocks/FeaturedAgents/Component'
import { PageBlogBlock } from '@/blocks/PageBlog/Component'
import { AboutSectionBlock } from '@/blocks/AboutSection/Component'
import { SolutionsSectionBlock } from '@/blocks/SolutionsSection/Component'
import { ServicesSectionBlock } from '@/blocks/ServicesSection/Component'
import { FeaturedTestimonialBlock } from '@/blocks/FeaturedTestimonial/Component'
import { ArticlesSectionBlock } from '@/blocks/ArticlesSection/Component'
import { ArticlesSectionWithSidebarBlock } from '@/blocks/ArticlesSectionWithSidebar/Component'
import { MissionVisionBlock } from '@/blocks/MissionVision/Component'
import { DesignationDirectoryBlock } from '@/blocks/DesignationDirectory/Component'
import { CaliforniaBlock } from '@/blocks/California/Component'
import { VideoLayoutBlock } from '@/blocks/VideoLayout/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  homeValueForm: HomeValueFormBlock,
  testimonialsBlock: TestimonialsBlockComponent,
  servicesGrid: ServicesGridBlock,
  agentGallery: AgentGalleryBlock,
  faqBlock: FAQBlockComponent,
  agentBlog: AgentBlogBlock,
  agentContact: AgentContactBlock,
  directoryListing: DirectoryListingBlock,
  homepageBlog: HomepageBlogBlock,
  videoEmbed: VideoEmbedBlock,
  teamSection: TeamSectionBlock,
  partnersLogos: PartnersLogosBlock,
  featuredAgents: FeaturedAgentsBlock,
  pageBlog: PageBlogBlock,
  aboutSection: AboutSectionBlock,
  solutionsSection: SolutionsSectionBlock,
  servicesSection: ServicesSectionBlock,
  featuredTestimonial: FeaturedTestimonialBlock,
  articlesSection: ArticlesSectionBlock,
  articlesSidebar: ArticlesSectionWithSidebarBlock,
  missionVision: MissionVisionBlock,
  designationDirectory: DesignationDirectoryBlock,
  california: CaliforniaBlock,
  videoLayout: VideoLayoutBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                // @ts-expect-error there may be some mismatch between the expected types here
                <Block {...block} disableInnerContainer key={`${block.id || blockType}-${index}`} />
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
