import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    heroImage: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'postType', 'showOnHomepage', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) => {
        // If post is assigned to an agent, use agent-specific URL
        if (data?.postType === 'agent' && data?.agent) {
          const agentSlug = typeof data.agent === 'object' ? (data.agent as { slug: string }).slug : null
          if (agentSlug) {
            return `${req.protocol}//${req.host}/posts/${agentSlug}/${data?.slug || ''}`
          }
        }
        // Default to general URL
        return `${req.protocol}//${req.host}/posts/${data?.slug || ''}`
      },
    },
    preview: (data, { req }) => {
      // If post is assigned to an agent, use agent-specific URL
      if (data?.postType === 'agent' && data?.agent) {
        const agentSlug = typeof data.agent === 'object' ? (data.agent as { slug: string }).slug : null
        if (agentSlug) {
          return `${req.protocol}//${req.host}/posts/${agentSlug}/${data?.slug || ''}`
        }
      }
      // Default to general URL
      return `${req.protocol}//${req.host}/posts/${data?.slug || ''}`
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
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Image',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    PayloadAiPluginLexicalEditorFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
          label: 'Meta',
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
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // Blog Type Configuration
    {
      name: 'postType',
      type: 'select',
      defaultValue: 'main',
      required: true,
      options: [
        { label: 'Main Website Blog', value: 'main' },
        { label: 'Agent Blog', value: 'agent' },
        { label: 'Syndicated (Multi-Agent)', value: 'syndicated' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Select where this post should appear',
      },
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show on Homepage',
      admin: {
        position: 'sidebar',
        description: 'Display this post on the main website homepage',
        condition: (data) => data.postType === 'agent' || data.postType === 'syndicated',
      },
    },
    {
      name: 'agent',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        description: "Associate this post with a specific agent's super page blog",
        condition: (data) => data.postType === 'agent',
      },
      relationTo: 'agents',
      label: 'Agent',
    },
    {
      name: 'syndicatedAgents',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        description: 'Select multiple agents to syndicate/copy this post to their pages',
        condition: (data) => data.postType === 'syndicated',
      },
      hasMany: true,
      relationTo: 'agents',
      label: 'Syndicated to Agents',
    },
    {
      name: 'showOnAllAgents',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Check this to show this post on ALL agent pages (network-wide)',
        condition: (data) => data.postType === 'syndicated',
      },
      label: 'Show on All Agents',
      defaultValue: false,
    },
    // Multi-Tenant SEO Override Fields
    {
      name: 'primaryTenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        position: 'sidebar',
        description: 'Primary tenant for canonical URL (prevents duplicate content)',
        condition: (data) => data?.postType === 'syndicated',
      },
    },
    {
      name: 'tenantSeoOverrides',
      type: 'array',
      label: 'Tenant SEO Overrides',
      admin: {
        description: 'Custom SEO for each tenant (prevents duplicate content penalties)',
        condition: (data) => data?.postType === 'syndicated',
      },
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          required: true,
        },
        {
          name: 'titleOverride',
          type: 'text',
          label: 'Custom Title',
          admin: {
            description: 'Custom title for this tenant (e.g., "5 Tips by Mr. Dallas™")',
          },
        },
        {
          name: 'descriptionOverride',
          type: 'textarea',
          label: 'Custom Description',
          admin: {
            description: 'Custom meta description for this tenant',
          },
        },
        {
          name: 'introOverride',
          type: 'richText',
          label: 'Custom Introduction',
          admin: {
            description: 'Custom opening paragraph for this tenant (makes content unique)',
          },
        },
        {
          name: 'customSlug',
          type: 'text',
          label: 'Custom URL Slug',
          admin: {
            description: 'Different URL on this tenant (optional)',
          },
        },
      ],
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Post',
      admin: {
        position: 'sidebar',
        description: 'Highlight this post as featured',
      },
    },
    {
      name: 'relatedPages',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        description: 'Display this post on specific pages (e.g., Google SEO Services page)',
      },
      hasMany: true,
      relationTo: 'pages',
      label: 'Show on Pages',
    },
    // Related Posts Configuration
    {
      name: 'relatedPostsMode',
      type: 'select',
      defaultValue: 'hybrid',
      options: [
        { label: 'Auto (by category)', value: 'auto' },
        { label: 'Manual only', value: 'manual' },
        { label: 'Manual + Auto fill', value: 'hybrid' },
      ],
      admin: {
        position: 'sidebar',
        description: 'How to determine related posts',
      },
    },
    // Display Location Controls
    {
      name: 'displayLocations',
      type: 'array',
      label: 'Display Location Controls',
      admin: {
        description: 'Control where this post appears on each tenant site',
        condition: (data) => data?.postType === 'syndicated',
      },
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          required: true,
        },
        {
          name: 'locations',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Homepage (Featured)', value: 'homepage' },
            { label: 'Blog Listing', value: 'blog-listing' },
            { label: 'Sidebar Widget', value: 'sidebar' },
          ],
          admin: {
            description: 'Select display locations for this tenant',
          },
        },
        {
          name: 'showOnAgentPages',
          type: 'relationship',
          relationTo: 'agents',
          hasMany: true,
          admin: {
            description: 'Show in related posts on these agent pages',
          },
        },
        {
          name: 'showOnPages',
          type: 'relationship',
          relationTo: 'pages',
          hasMany: true,
          admin: {
            description: 'Show on these specific pages',
          },
        },
      ],
    },
    // AI Content Template Fields
    {
      name: 'isTemplate',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Template Post',
      admin: {
        position: 'sidebar',
        description: 'This post will be used as a template for AI-generated city-specific content',
      },
    },
    {
      name: 'cityDataTokens',
      type: 'group',
      label: 'City Data Tokens',
      admin: {
        condition: (data) => data.isTemplate === true,
        description: 'Select which city data fields to inject into AI-generated content',
      },
      fields: [
        {
          name: 'useCityName',
          type: 'checkbox',
          label: 'Insert City Name',
          defaultValue: true,
        },
        {
          name: 'useMedianPrice',
          type: 'checkbox',
          label: 'Insert Median Home Price',
          defaultValue: false,
        },
        {
          name: 'usePriceChange',
          type: 'checkbox',
          label: 'Insert Price Change %',
          defaultValue: false,
        },
        {
          name: 'useSchools',
          type: 'checkbox',
          label: 'Insert Top Schools',
          defaultValue: false,
        },
        {
          name: 'useNeighborhoods',
          type: 'checkbox',
          label: 'Insert Popular Neighborhoods',
          defaultValue: false,
        },
        {
          name: 'useUniqueFacts',
          type: 'checkbox',
          label: 'Insert Unique City Facts',
          defaultValue: false,
        },
        {
          name: 'useMarketStats',
          type: 'checkbox',
          label: 'Insert Market Statistics',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'templateCategory',
      type: 'select',
      label: 'Template Category',
      admin: {
        condition: (data) => data.isTemplate === true,
        position: 'sidebar',
      },
      options: [
        { label: 'Market Report', value: 'market-report' },
        { label: 'Neighborhood Guide', value: 'neighborhood-guide' },
        { label: 'Home Valuation', value: 'home-valuation' },
        { label: 'Buyer Guide', value: 'buyer-guide' },
        { label: 'Seller Guide', value: 'seller-guide' },
        { label: 'Investment Guide', value: 'investment-guide' },
      ],
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    slugField({
      admin: {
        position: 'sidebar',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
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
