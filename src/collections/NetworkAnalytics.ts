import type { CollectionConfig } from 'payload'

export const NetworkAnalytics: CollectionConfig = {
  slug: 'network-analytics',
  admin: {
    useAsTitle: 'id',
    group: 'Analytics',
    defaultColumns: ['date', 'totalPageviews', 'totalUniqueVisitors', 'totalLeads', 'totalRevenue'],
    description: 'Network-wide aggregated analytics data per day',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user && 'role' in user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      unique: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    // Network-Wide Traffic
    {
      type: 'collapsible',
      label: 'Network-Wide Traffic',
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
              admin: { width: '33%' },
            },
            {
              name: 'totalUniqueVisitors',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'totalSessions',
              type: 'number',
              defaultValue: 0,
              admin: { width: '34%' },
            },
          ],
        },
      ],
    },
    // Content Performance
    {
      type: 'collapsible',
      label: 'Content Performance',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'totalPosts',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'postsPublishedToday',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'avgPageviewsPerPost',
              type: 'number',
              admin: { width: '34%' },
            },
          ],
        },
      ],
    },
    // Agent Network
    {
      type: 'collapsible',
      label: 'Agent Network',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'totalAgents',
              type: 'number',
              defaultValue: 0,
              admin: { width: '50%' },
            },
            {
              name: 'activeAgents',
              type: 'number',
              defaultValue: 0,
              admin: {
                width: '50%',
                description: 'Agents who published in last 30 days',
              },
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
              name: 'totalLeads',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'totalAgentsSigned',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'totalRevenue',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Total revenue in USD',
              },
            },
            {
              name: 'conversionRate',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Overall conversion rate %',
              },
            },
          ],
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
              name: 'totalKeywordsRanking',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'keywordsTop10',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'keywordsTop3',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'featuredSnippets',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'totalBacklinks',
              type: 'number',
              defaultValue: 0,
              admin: { width: '50%' },
            },
            {
              name: 'domainAuthority',
              type: 'number',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    // Social Performance
    {
      type: 'collapsible',
      label: 'Social Performance',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'youtubeSubscribers',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'youtubeViews',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'linkedinFollowers',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'twitterFollowers',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
