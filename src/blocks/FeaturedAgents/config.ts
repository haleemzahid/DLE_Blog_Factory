import type { Block } from 'payload'

export const FeaturedAgents: Block = {
  slug: 'featuredAgents',
  interfaceName: 'FeaturedAgentsBlock',
  labels: {
    singular: 'Featured Agents',
    plural: 'Featured Agents',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
      defaultValue: 'Our Members',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Meet Our Featured Members',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (Featured Agents)', value: 'auto' },
        { label: 'Manual Selection', value: 'manual' },
        { label: 'By Designation', value: 'designation' },
        { label: 'Custom Members (Upload Images)', value: 'custom' },
      ],
    },
    {
      name: 'selectedAgents',
      type: 'relationship',
      relationTo: 'agents',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'manual',
      },
    },
    {
      name: 'designation',
      type: 'relationship',
      relationTo: 'designations',
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'designation',
        description: 'Show agents with this designation',
      },
    },
    {
      name: 'customMembers',
      type: 'array',
      label: 'Custom Members',
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'custom',
        description: 'Add custom members with photos and names',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          admin: {
            description: 'e.g., Mr. Chatsworth, Ms. Fort Wayne',
          },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Photo',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL (optional)',
          admin: {
            description: 'Link when clicking on the member',
          },
        },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of Agents to Show',
      defaultValue: 6,
      min: 1,
      max: 20,
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout Style',
      defaultValue: 'carousel',
      options: [
        { label: 'Carousel', value: 'carousel' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    {
      name: 'showDesignation',
      type: 'checkbox',
      label: 'Show Designation Badge',
      defaultValue: true,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
      defaultValue: 'View All Members',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Button Link',
      defaultValue: '/agents',
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#f9fafb',
      admin: {
        description: 'Section background color (e.g., #f9fafb for light gray)',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
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
  ],
}
