import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Multi-Tenant',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'updatedAt'],
    description: 'Manage tenant sites (main site and agent sites)',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Basic Information
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for this tenant (e.g., "DLE Main Site" or "Mr. Dallas")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "main" or "mr-dallas")',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Main Site', value: 'main' },
        { label: 'Agent Site', value: 'agent' },
      ],
      defaultValue: 'agent',
      admin: {
        description: 'Main site is the primary DLE site, Agent sites are individual realtor sites',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending Setup', value: 'pending' },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
    },

    // Domain Configuration
    {
      name: 'domains',
      type: 'array',
      label: 'Domains',
      admin: {
        description: 'All domains that should route to this tenant',
      },
      fields: [
        {
          name: 'domain',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., mrdallas.com or dallas.designatedlocalexpert.com',
          },
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Primary domain used for canonical URLs',
          },
        },
        {
          name: 'isVerified',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Domain ownership verified',
            readOnly: true,
          },
        },
      ],
    },

    // Agent Linking (for agent type only)
    {
      name: 'linkedAgent',
      type: 'relationship',
      relationTo: 'agents',
      admin: {
        condition: (data) => data?.type === 'agent',
        description: 'The agent this tenant belongs to',
      },
    },

    // Branding Configuration
    {
      name: 'branding',
      type: 'group',
      admin: {
        description: 'Custom branding for this tenant',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'primaryColor',
          type: 'text',
          admin: {
            placeholder: '#1e40af',
            description: 'Primary brand color (hex)',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          admin: {
            placeholder: '#3b82f6',
            description: 'Secondary brand color (hex)',
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          admin: {
            placeholder: '#fbbf24',
            description: 'Accent color (hex)',
          },
        },
      ],
    },

    // SEO Defaults
    {
      name: 'seoDefaults',
      type: 'group',
      label: 'SEO Defaults',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          admin: {
            description: 'Site name for SEO (appears in title tags)',
          },
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          admin: {
            description: 'Default meta description for pages without custom description',
          },
        },
        {
          name: 'defaultImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Default OG image for social sharing',
          },
        },
      ],
    },

    // Analytics
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          admin: {
            placeholder: 'G-XXXXXXXXXX',
            description: 'Google Analytics 4 Measurement ID (optional)',
          },
        },
        {
          name: 'googleTagManagerId',
          type: 'text',
          admin: {
            placeholder: 'GTM-XXXXXXX',
            description: 'Google Tag Manager ID (optional)',
          },
        },
        {
          name: 'facebookPixelId',
          type: 'text',
          admin: {
            placeholder: 'XXXXXXXXXXXXXXX',
            description: 'Facebook Pixel ID (optional)',
          },
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure slug is URL-safe
        if (data.slug) {
          data.slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
        }
        return data
      },
    ],
  },

  timestamps: true,
}
