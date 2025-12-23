import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  interfaceName: 'ServicesGridBlock',
  labels: {
    singular: 'Services Grid',
    plural: 'Services Grids',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our Services',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Section Subtitle',
      admin: {
        description: 'Optional subtitle text below the main title',
      },
    },
    {
      name: 'enableButton',
      type: 'checkbox',
      label: 'Show Header Button',
      defaultValue: false,
    },
    link({
      overrides: {
        name: 'headerLink',
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
      defaultValue: 'red',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Dark (Black)', value: 'dark' },
        { label: 'Outline', value: 'outline' },
      ],
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.enableButton),
      },
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., Home Value & Appraisal Services',
          },
        },
        {
          name: 'description',
          type: 'richText',
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'link',
          type: 'group',
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Internal Link', value: 'internal' },
                { label: 'External Link', value: 'external' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'external',
              },
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'internal',
              },
            },
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Learn More',
            },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'twoColumn',
      options: [
        { label: 'Two Column', value: 'twoColumn' },
        { label: 'Three Column', value: 'threeColumn' },
        { label: 'Four Column', value: 'fourColumn' },
        { label: 'Alternating', value: 'alternating' },
      ],
    },
    {
      name: 'showIcons',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Icons',
    },
    {
      name: 'cardBorderRadius',
      type: 'number',
      label: 'Card Corner Radius (px)',
      defaultValue: 8,
      admin: {
        description: 'Border radius for the service cards in pixels (e.g., 0 for square, 8 for rounded)',
      },
    },
  ],
}
