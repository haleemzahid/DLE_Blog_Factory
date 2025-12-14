import type { CollectionConfig } from 'payload'

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
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

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
        return `${req.protocol}//${req.host}/posts/${data?.slug || ''}`
      },
    },
    preview: (data, { req }) => {
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
    slugField(),
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
