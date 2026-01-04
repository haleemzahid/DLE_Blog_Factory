import type { CollectionConfig } from 'payload'

export const ABTests: CollectionConfig = {
  slug: 'ab-tests',
  admin: {
    useAsTitle: 'name',
    group: 'Analytics',
    defaultColumns: ['name', 'status', 'startDate', 'endDate', 'winningVariant'],
    description: 'Manage A/B tests for optimization',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Running', value: 'running' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // Variants
    {
      name: 'controlVariant',
      type: 'group',
      label: 'Control Variant (A)',
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: 'Control',
        },
        {
          name: 'config',
          type: 'json',
          admin: {
            description: 'Configuration for the control variant',
          },
        },
      ],
    },
    {
      name: 'testVariants',
      type: 'array',
      label: 'Test Variants',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'config',
          type: 'json',
          admin: {
            description: 'Configuration for this test variant',
          },
        },
        {
          name: 'weight',
          type: 'number',
          defaultValue: 50,
          admin: {
            description: 'Traffic percentage for this variant (0-100)',
          },
        },
      ],
    },
    // Results
    {
      type: 'collapsible',
      label: 'Results',
      fields: [
        {
          name: 'winningVariant',
          type: 'text',
          admin: {
            description: 'Name of the winning variant',
          },
        },
        {
          name: 'confidenceLevel',
          type: 'number',
          admin: {
            description: 'Statistical confidence level (%)',
          },
        },
        {
          name: 'sampleSize',
          type: 'number',
          admin: {
            description: 'Total number of participants',
          },
        },
        {
          name: 'results',
          type: 'json',
          admin: {
            description: 'Detailed results per variant',
          },
        },
      ],
    },
    // Targeting
    {
      type: 'collapsible',
      label: 'Targeting',
      fields: [
        {
          name: 'targetPages',
          type: 'relationship',
          relationTo: ['posts', 'pages'],
          hasMany: true,
          admin: {
            description: 'Specific pages to run this test on',
          },
        },
        {
          name: 'targetAudience',
          type: 'select',
          defaultValue: 'all',
          options: [
            { label: 'All Visitors', value: 'all' },
            { label: 'New Visitors Only', value: 'new' },
            { label: 'Returning Visitors Only', value: 'returning' },
            { label: 'Mobile Only', value: 'mobile' },
            { label: 'Desktop Only', value: 'desktop' },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
