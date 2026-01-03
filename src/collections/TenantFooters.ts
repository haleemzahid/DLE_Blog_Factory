import type { CollectionConfig } from 'payload'

export const TenantFooters: CollectionConfig = {
  slug: 'tenant-footers',
  admin: {
    group: 'Multi-Tenant',
    useAsTitle: 'tenant',
    description: 'Custom footer for each tenant site',
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
      unique: true,
      admin: {
        description: 'The tenant this footer belongs to',
      },
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Footer Columns',
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Column heading (e.g., "Quick Links", "Services")',
          },
        },
        {
          name: 'links',
          type: 'array',
          maxRows: 8,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
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
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          admin: {
            placeholder: 'https://facebook.com/...',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            placeholder: 'https://instagram.com/...',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            placeholder: 'https://linkedin.com/in/...',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          admin: {
            placeholder: 'https://youtube.com/@...',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X',
          admin: {
            placeholder: 'https://x.com/...',
          },
        },
        {
          name: 'tiktok',
          type: 'text',
          admin: {
            placeholder: 'https://tiktok.com/@...',
          },
        },
        {
          name: 'pinterest',
          type: 'text',
          admin: {
            placeholder: 'https://pinterest.com/...',
          },
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'phone',
          type: 'text',
          admin: {
            placeholder: '(555) 123-4567',
          },
        },
        {
          name: 'email',
          type: 'text',
          admin: {
            placeholder: 'agent@example.com',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          admin: {
            placeholder: '123 Main Street\nCity, State 12345',
          },
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      admin: {
        description: 'Privacy policy, terms of service, etc.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
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
          relationTo: ['pages'],
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'internal',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'custom',
          },
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Copyright Text',
      admin: {
        placeholder: '© 2025 [Agent Name]. All rights reserved.',
        description: 'Use {year} for dynamic year',
      },
    },
    {
      name: 'showDleBadge',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show DLE Badge',
      admin: {
        description: 'Display "Powered by Designated Local Expert" badge',
      },
    },
    {
      name: 'additionalText',
      type: 'richText',
      label: 'Additional Footer Text',
      admin: {
        description: 'Disclaimers, license info, or other required text',
      },
    },
  ],
  timestamps: true,
}
