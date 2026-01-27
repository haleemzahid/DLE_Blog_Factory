import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
} from '@payloadcms/richtext-lexical'
import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'
import { link } from '@/fields/link'

export const BrandingHero: Block = {
  slug: 'brandingHero',
  interfaceName: 'BrandingHeroBlock',
  labels: {
    singular: 'Branding Hero',
    plural: 'Branding Hero Blocks',
  },
  fields: [
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#1E699B',
      admin: {
        description: 'Background color for the section',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Background Image',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional background image (e.g., wave pattern)',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      required: false,
      admin: {
        description: 'YouTube or Vimeo video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)',
      },
    },
    {
      name: 'videoTitle',
      type: 'text',
      label: 'Video Title',
      defaultValue: 'Video',
      admin: {
        description: 'Accessibility title for the video',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'The Most Powerful Personal Branding in the Real Estate Industry',
      required: true,
    },
    {
      name: 'headingColor',
      type: 'text',
      label: 'Heading Color',
      defaultValue: '#000000',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'headingSize',
      type: 'select',
      label: 'Heading Size',
      defaultValue: 'large',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xlarge' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            BoldFeature(),
            ItalicFeature(),
            PayloadAiPluginLexicalEditorFeature(),
          ]
        },
      }),
      admin: {
        description: 'Optional supporting text below the heading',
      },
    },
    {
      name: 'enableCta',
      type: 'checkbox',
      label: 'Show CTA Button',
      defaultValue: false,
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'CTA Button',
        admin: {
          condition: (_, siblingData) => siblingData?.enableCta,
        },
      },
    }),
    {
      name: 'ctaButtonColor',
      type: 'text',
      label: 'Button Background Color',
      defaultValue: '#B40000',
      admin: {
        condition: (_, siblingData) => siblingData?.enableCta,
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'ctaTextColor',
      type: 'text',
      label: 'Button Text Color',
      defaultValue: '#ffffff',
      admin: {
        condition: (_, siblingData) => siblingData?.enableCta,
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
  ],
}
