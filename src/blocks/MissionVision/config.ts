import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
} from '@payloadcms/richtext-lexical'
import { PayloadAiPluginLexicalEditorFeature } from '@ai-stack/payloadcms'

export const MissionVision: Block = {
  slug: 'missionVision',
  interfaceName: 'MissionVisionBlock',
  labels: {
    singular: 'Mission & Vision',
    plural: 'Mission & Vision Blocks',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      label: 'Layout Style',
      defaultValue: 'sideBySide',
      options: [
        { label: 'Side by Side', value: 'sideBySide' },
        { label: 'Stacked', value: 'stacked' },
        { label: 'Cards', value: 'cards' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#ffffff',
      admin: {
        description: 'Background color for the section',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'mission',
          type: 'group',
          label: 'Mission Statement',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              defaultValue: 'target',
              options: [
                { label: 'Target', value: 'target' },
                { label: 'Rocket', value: 'rocket' },
                { label: 'Star', value: 'star' },
                { label: 'Flag', value: 'flag' },
                { label: 'Compass', value: 'compass' },
                { label: 'Lightning', value: 'lightning' },
              ],
            },
            {
              name: 'iconColor',
              type: 'text',
              label: 'Icon Color',
              defaultValue: '#dc2626',
              admin: {
                components: {
                  Field: '@/components/ColorPickerField#ColorPickerField',
                },
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'Mission Statement',
              required: true,
            },
            {
              name: 'titleColor',
              type: 'text',
              label: 'Title Color',
              defaultValue: '#111827',
              admin: {
                components: {
                  Field: '@/components/ColorPickerField#ColorPickerField',
                },
              },
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
              required: true,
            },
          ],
        },
        {
          name: 'vision',
          type: 'group',
          label: 'Vision Statement',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              defaultValue: 'eye',
              options: [
                { label: 'Eye', value: 'eye' },
                { label: 'Lightbulb', value: 'lightbulb' },
                { label: 'Globe', value: 'globe' },
                { label: 'Mountain', value: 'mountain' },
                { label: 'Sparkle', value: 'sparkle' },
                { label: 'Sun', value: 'sun' },
              ],
            },
            {
              name: 'iconColor',
              type: 'text',
              label: 'Icon Color',
              defaultValue: '#dc2626',
              admin: {
                components: {
                  Field: '@/components/ColorPickerField#ColorPickerField',
                },
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'Vision Statement',
              required: true,
            },
            {
              name: 'titleColor',
              type: 'text',
              label: 'Title Color',
              defaultValue: '#111827',
              admin: {
                components: {
                  Field: '@/components/ColorPickerField#ColorPickerField',
                },
              },
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
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
