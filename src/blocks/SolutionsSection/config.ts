import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  BoldFeature,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const SolutionsSection: Block = {
  slug: 'solutionsSection',
  interfaceName: 'SolutionsSectionBlock',
  labels: {
    singular: 'Solutions Section',
    plural: 'Solutions Sections',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Left Side Image',
      required: true,
      admin: {
        description: 'Image displayed on the left (e.g., Agent Training infographic)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      required: true,
      defaultValue: "Overcoming Realtor Challenges With DLE's AI + LLM Solutions",
    },
    {
      name: 'solutions',
      type: 'array',
      label: 'Solutions List',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Solution Heading',
          required: true,
          admin: {
            description: 'e.g., "#1 – Be Remembered"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
      ],
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
      name: 'buttonStyle',
      type: 'select',
      label: 'Button Style',
      defaultValue: 'dark',
      options: [
        { label: 'Dark (Black)', value: 'dark' },
        { label: 'Red', value: 'red' },
        { label: 'Outline', value: 'outline' },
      ],
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.enableButton),
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Image Position',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}
