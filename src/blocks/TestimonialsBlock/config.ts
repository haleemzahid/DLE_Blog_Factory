import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonialsBlock',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimonials Block',
    plural: 'Testimonials Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'What People Say',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Client Testimonials',
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      label: 'Filter by Agent',
      admin: {
        description: 'Leave blank to show all featured testimonials',
      },
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Manual Selection',
      admin: {
        description: 'Manually select testimonials. Leave blank to auto-populate from agent.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      label: 'Maximum Testimonials',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'List', value: 'list' },
      ],
    },
    {
      name: 'showRatings',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Star Ratings',
    },
    {
      name: 'showPhotos',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Client Photos',
    },
    {
      name: 'showSource',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Review Source',
    },
  ],
}
