import type { Block } from 'payload'

export const PartnersLogos: Block = {
  slug: 'partnersLogos',
  interfaceName: 'PartnersLogosBlock',
  labels: {
    singular: 'Partners/Logos',
    plural: 'Partners/Logos',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
      defaultValue: 'Our Partners',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Achieve Business Growth Together',
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Partner Logos',
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Partner Name',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Partner Website URL',
        },
      ],
    },
    {
      name: 'style',
      type: 'select',
      label: 'Display Style',
      defaultValue: 'carousel',
      options: [
        { label: 'Carousel (Scrolling)', value: 'carousel' },
        { label: 'Grid', value: 'grid' },
        { label: 'Inline Row', value: 'inline' },
      ],
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      label: 'Grayscale logos (color on hover)',
      defaultValue: true,
    },
  ],
}
