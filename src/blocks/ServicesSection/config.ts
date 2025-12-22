import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ServicesSection: Block = {
  slug: 'servicesSection',
  dbName: 'svcSec',
  interfaceName: 'ServicesSectionBlock',
  labels: {
    singular: 'Services Section',
    plural: 'Services Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
      defaultValue: 'Our Services',
      admin: {
        description: 'Small text above the main title (e.g., "Our Services")',
      },
    },
    {
      name: 'eyebrowColor',
      type: 'text',
      label: 'Eyebrow Color',
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
      label: 'Section Title',
      required: true,
      defaultValue: 'Our Real Estate SEO Services',
    },
    {
      name: 'enableButton',
      type: 'checkbox',
      label: 'Show Header Button',
      defaultValue: true,
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
      dbName: 'svc_items',
      label: 'Service Cards',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Service Icon',
          admin: {
            description: 'Icon image for the service card',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Service Title',
          required: true,
          admin: {
            description: 'e.g., "Google Business Profile Optimization"',
          },
        },
        {
          name: 'titleColor',
          type: 'text',
          label: 'Title Color',
          defaultValue: '#dc2626',
          admin: {
            components: {
              Field: '@/components/ColorPickerField#ColorPickerField',
            },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Service Description',
          required: true,
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Make Title a Link',
          defaultValue: false,
        },
        link({
          overrides: {
            name: 'serviceLink',
            admin: {
              condition: (_data, siblingData) => {
                return Boolean(siblingData?.enableLink)
              },
            },
          },
        }),
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Grid Columns',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      admin: {
        description: 'Number of columns in the service cards grid',
      },
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#ffffff',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
  ],
}
