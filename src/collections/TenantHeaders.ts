import type { CollectionConfig } from 'payload'
import { link } from '@/fields/link'

export const TenantHeaders: CollectionConfig = {
  slug: 'tenant-headers',
  admin: {
    group: 'Multi-Tenant',
    useAsTitle: 'tenant',
    description: 'Custom navigation header for tenant sites and specific agents',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        description: 'The tenant this header belongs to',
      },
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      admin: {
        description: 'Optional: Assign to a specific agent. If set, this header will only show for this agent.',
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Override tenant logo for header (falls back to tenant branding logo)',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      maxRows: 8,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Navigation link text',
          },
        },
        {
          name: 'linkType',
          type: 'radio',
          defaultValue: 'internal',
          options: [
            { label: 'Internal Page', value: 'internal' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'internalLink',
          type: 'relationship',
          relationTo: ['pages', 'posts'],
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'internal',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'custom',
            placeholder: 'https://example.com or /custom-path',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
          label: 'Open in new tab',
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          label: 'Highlight this item',
          admin: {
            description: 'Make this nav item stand out (e.g., for important pages)',
          },
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Call-to-Action Button',
      fields: [
        {
          name: 'show',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show CTA Button',
        },
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Contact Agent',
          admin: {
            condition: (_, siblingData) => siblingData?.show,
          },
        },
        {
          name: 'linkType',
          type: 'radio',
          defaultValue: 'custom',
          options: [
            { label: 'Internal Page', value: 'internal' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: {
            layout: 'horizontal',
            condition: (_, siblingData) => siblingData?.show,
          },
        },
        {
          name: 'internalLink',
          type: 'relationship',
          relationTo: ['pages'],
          admin: {
            condition: (_, siblingData) => siblingData?.show && siblingData?.linkType === 'internal',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.show && siblingData?.linkType === 'custom',
            placeholder: '/contact or https://calendly.com/...',
          },
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Filled)', value: 'primary' },
            { label: 'Secondary (Outline)', value: 'secondary' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.show,
          },
        },
      ],
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Search Icon',
    },
    {
      name: 'sticky',
      type: 'checkbox',
      defaultValue: true,
      label: 'Sticky Header',
      admin: {
        description: 'Keep header fixed at top when scrolling',
      },
    },
    {
      name: 'transparent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Transparent on Hero',
      admin: {
        description: 'Make header transparent over hero sections',
      },
    },
  ],
  timestamps: true,
}
