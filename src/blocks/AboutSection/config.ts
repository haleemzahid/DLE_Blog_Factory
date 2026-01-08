import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'

import { link } from '@/fields/link'

export const AboutSection: Block = {
  slug: 'aboutSection',
  interfaceName: 'AboutSectionBlock',
  labels: {
    singular: 'About Section',
    plural: 'About Sections',
  },
  fields: [
    {
      name: 'headingColor',
      type: 'text',
      label: 'Heading Color',
      defaultValue: '#dc2626',
      admin: {
        description: 'Color for the section heading (default: red)',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'About Us',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            UnorderedListFeature(),
            BoldFeature(),
            ItalicFeature(),
            LinkFeature(),
            PayloadAiPluginLexicalEditorFeature(),
          ]
        },
      }),
      required: true,
    },
    {
      name: 'enableButton',
      type: 'checkbox',
      label: 'Show Button',
      defaultValue: true,
    },
    link({
      overrides: {
        admin: {
          condition: (_data, siblingData) => {
            return Boolean(siblingData?.enableButton)
          },
        },
      },
    }),
    {
      name: 'mediaType',
      type: 'select',
      label: 'Media Type',
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video (YouTube/Vimeo)', value: 'video' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Side Image',
      admin: {
        description: 'Image displayed on the side of the section',
        condition: (_, siblingData) => siblingData?.mediaType === 'image',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      admin: {
        description: 'YouTube or Vimeo video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)',
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'videoTitle',
      type: 'text',
      label: 'Video Title',
      defaultValue: 'Video',
      admin: {
        description: 'Accessibility title for the video',
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Image Position',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#f3f4f6',
      admin: {
        description: 'Background color for the section',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
  ],
}
