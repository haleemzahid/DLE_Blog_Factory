import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { HomeValueForm } from '../../blocks/HomeValueForm/config'
import { TestimonialsBlock } from '../../blocks/TestimonialsBlock/config'
import { ServicesGrid } from '../../blocks/ServicesGrid/config'
import { AgentGallery } from '../../blocks/AgentGallery/config'
import { FAQBlock } from '../../blocks/FAQBlock/config'
import { AgentBlog } from '../../blocks/AgentBlog/config'
import { AgentContact } from '../../blocks/AgentContact/config'
import { DirectoryListing } from '../../blocks/DirectoryListing/config'
import { HomepageBlog } from '../../blocks/HomepageBlog/config'
import { VideoEmbed } from '../../blocks/VideoEmbed/config'
import { TeamSection } from '../../blocks/TeamSection/config'
import { PartnersLogos } from '../../blocks/PartnersLogos/config'
import { FeaturedAgents } from '../../blocks/FeaturedAgents/config'
import { PageBlog } from '../../blocks/PageBlog/config'
import { AboutSection } from '../../blocks/AboutSection/config'
import { SolutionsSection } from '../../blocks/SolutionsSection/config'
import { ServicesSection } from '../../blocks/ServicesSection/config'
import { FeaturedTestimonial } from '../../blocks/FeaturedTestimonial/config'
import { ArticlesSection } from '../../blocks/ArticlesSection/config'
import { ArticlesSectionWithSidebar } from '../../blocks/ArticlesSectionWithSidebar/config'
import { MissionVision } from '../../blocks/MissionVision/config'
import { DesignationDirectory } from '../../blocks/DesignationDirectory/config'
import { California } from '../../blocks/California/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) => {
        const path = data?.slug === 'home' ? '' : data?.slug
        return `${req.protocol}//${req.host}/${path || ''}`
      },
    },
    preview: (data, { req }) => {
      const path = data?.slug === 'home' ? '' : data?.slug
      return `${req.protocol}//${req.host}/${path || ''}`
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        components: {
          Field: '@/components/VoiceComposeField#VoiceComposeField',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                HomeValueForm,
                TestimonialsBlock,
                ServicesGrid,
                AgentGallery,
                FAQBlock,
                AgentBlog,
                AgentContact,
                DirectoryListing,
                HomepageBlog,
                VideoEmbed,
                TeamSection,
                PartnersLogos,
                FeaturedAgents,
                PageBlog,
                AboutSection,
                SolutionsSection,
                ServicesSection,
                FeaturedTestimonial,
                ArticlesSection,
                ArticlesSectionWithSidebar,
                MissionVision,
                DesignationDirectory,
                California,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({
              overrides: {
                admin: {
                  components: {
                    Field: '@/components/VoiceComposeField#VoiceComposeField',
                  },
                },
              },
            }),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
