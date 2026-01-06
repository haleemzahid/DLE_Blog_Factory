import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            PayloadAiPluginLexicalEditorFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'headingColor',
      type: 'text',
      label: 'Heading Color',
      defaultValue: '#ffffff',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
        description: 'Color for headings (H1, H2) - use color picker',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'subtitleColor',
      type: 'text',
      label: 'Subtitle Color',
      defaultValue: '#e8b44a',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
        description: 'Color for subtitle/small text above heading',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'paragraphColor',
      type: 'text',
      label: 'Paragraph Color',
      defaultValue: '#ffffff',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
        description: 'Color for paragraphs/body text',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'media',
      type: 'upload',
      label: 'Background Image',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
        description: 'Background image for the hero section',
      },
      relationTo: 'media',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Logo',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
        description: 'Logo displayed below the hero text (e.g., DLE Network logo)',
      },
    },
  ],
  label: false,
}
