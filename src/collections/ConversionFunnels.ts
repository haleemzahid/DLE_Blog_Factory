import type { CollectionConfig } from 'payload'

export const ConversionFunnels: CollectionConfig = {
  slug: 'conversion-funnels',
  admin: {
    useAsTitle: 'sessionId',
    group: 'Analytics',
    defaultColumns: ['sessionId', 'step1Visitor', 'step3Lead', 'step6Signed', 'createdAt'],
    description: 'Tracks user journey through the conversion funnel',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      index: true,
    },
    // Funnel Steps with Timestamps
    {
      type: 'collapsible',
      label: 'Funnel Steps',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'step1Visitor',
          type: 'date',
          label: 'Step 1: Visited Site',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'step2Engaged',
          type: 'date',
          label: 'Step 2: Engaged (Scrolled 50%+)',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'step3Lead',
          type: 'date',
          label: 'Step 3: Downloaded Lead Magnet',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'step4Qualified',
          type: 'date',
          label: 'Step 4: Filled Contact Form',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'step5Demo',
          type: 'date',
          label: 'Step 5: Scheduled Demo',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'step6Signed',
          type: 'date',
          label: 'Step 6: Became Paying Agent',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    // Attribution
    {
      type: 'collapsible',
      label: 'Attribution',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'firstPost',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: false,
              admin: { width: '50%' },
            },
            {
              name: 'lastPost',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: false,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'totalPostsViewed',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'totalSessions',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'timeToConvert',
              type: 'number',
              admin: {
                width: '34%',
                description: 'Seconds from first visit to conversion',
              },
            },
          ],
        },
      ],
    },
    // User Journey Touchpoints
    {
      name: 'touchpoints',
      type: 'json',
      admin: {
        description: 'Array of posts visited with timestamps',
      },
    },
    // Tenant/Agent Context
    {
      type: 'row',
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          hasMany: false,
          admin: { width: '50%' },
        },
        {
          name: 'agent',
          type: 'relationship',
          relationTo: 'agents',
          hasMany: false,
          admin: { width: '50%' },
        },
      ],
    },
  ],
  timestamps: true,
}
