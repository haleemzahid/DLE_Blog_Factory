import type { CollectionConfig } from 'payload'

export const AgentAnalytics: CollectionConfig = {
  slug: 'agent-analytics',
  admin: {
    useAsTitle: 'id',
    group: 'Analytics',
    defaultColumns: ['agent', 'date', 'totalPageviews', 'uniqueVisitors', 'leadsGenerated'],
    description: 'Aggregated analytics data per agent site per day',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      required: true,
      index: true,
      hasMany: false,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    // Site-Wide Traffic Metrics
    {
      type: 'collapsible',
      label: 'Site-Wide Metrics',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'totalPageviews',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'uniqueVisitors',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'sessions',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'avgSessionDuration',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Average session duration in seconds',
              },
            },
          ],
        },
        {
          name: 'bounceRate',
          type: 'number',
          admin: {
            description: 'Bounce rate percentage',
          },
        },
      ],
    },
    // Traffic Sources
    {
      type: 'collapsible',
      label: 'Traffic Sources',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'organicTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'directTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'referralTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'socialTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
    // Conversions
    {
      type: 'collapsible',
      label: 'Conversions',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'leadsGenerated',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'formSubmissions',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'phoneCalls',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'emailClicks',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
    // Top Performing Content
    {
      type: 'collapsible',
      label: 'Top Performing Content',
      fields: [
        {
          name: 'topPost',
          type: 'relationship',
          relationTo: 'posts',
          hasMany: false,
        },
        {
          name: 'topPostViews',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    // SEO Performance
    {
      type: 'collapsible',
      label: 'SEO Performance',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'totalImpressions',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'totalClicks',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'avgCtr',
              type: 'number',
              admin: { width: '25%' },
            },
            {
              name: 'avgPosition',
              type: 'number',
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'keywordsRanking',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of keywords ranking in top 100',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
