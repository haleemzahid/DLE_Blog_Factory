import type { Block } from 'payload'

export const AgentGallery: Block = {
  slug: 'agentGallery',
  interfaceName: 'AgentGalleryBlock',
  labels: {
    singular: 'Agent Gallery',
    plural: 'Agent Galleries',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Gallery',
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      label: 'Agent',
      admin: {
        description:
          'Auto-populate gallery from agent profile. Leave blank to use manual selection.',
      },
    },
    {
      name: 'images',
      type: 'array',
      dbName: 'agent_gal_imgs',
      label: 'Manual Image Selection',
      admin: {
        description: 'Manually select images. Will be used if no agent is selected.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'enableLightbox',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Lightbox',
    },
  ],
}
