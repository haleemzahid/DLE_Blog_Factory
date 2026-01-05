import type { CollectionConfig } from 'payload'

export const PostAnalytics: CollectionConfig = {
  slug: 'post-analytics',
  admin: {
    useAsTitle: 'id',
    group: 'Analytics',
    defaultColumns: ['post', 'date', 'pageviews', 'uniqueVisitors', 'leadsGenerated'],
    description: 'Aggregated analytics data per post per day',
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
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
    // Traffic Metrics
    {
      type: 'collapsible',
      label: 'Traffic Metrics',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pageviews',
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
              name: 'newVisitors',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'returningVisitors',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    // Engagement Metrics
    {
      type: 'collapsible',
      label: 'Engagement Metrics',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'avgTimeOnPage',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Average time in seconds',
              },
            },
            {
              name: 'avgScrollDepth',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Average scroll depth percentage',
              },
            },
            {
              name: 'bounceRate',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Bounce rate percentage',
              },
            },
            {
              name: 'exitRate',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Exit rate percentage',
              },
            },
          ],
        },
        {
          name: 'pagesPerSession',
          type: 'number',
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
              admin: { width: '16%' },
            },
            {
              name: 'directTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '16%' },
            },
            {
              name: 'referralTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '17%' },
            },
            {
              name: 'socialTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '17%' },
            },
            {
              name: 'emailTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '17%' },
            },
            {
              name: 'paidTraffic',
              type: 'number',
              defaultValue: 0,
              admin: { width: '17%' },
            },
          ],
        },
      ],
    },
    // SEO Metrics
    {
      type: 'collapsible',
      label: 'SEO Metrics',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'impressions',
              type: 'number',
              defaultValue: 0,
              admin: {
                width: '25%',
                description: 'Search Console impressions',
              },
            },
            {
              name: 'clicks',
              type: 'number',
              defaultValue: 0,
              admin: {
                width: '25%',
                description: 'Search Console clicks',
              },
            },
            {
              name: 'ctr',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Click-through rate',
              },
            },
            {
              name: 'avgPosition',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Average search position',
              },
            },
          ],
        },
      ],
    },
    // Conversion Metrics
    {
      type: 'collapsible',
      label: 'Conversion Metrics',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'formSubmissions',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'downloads',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'videoPlays',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'linkClicks',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'ctaClicks',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
    // Revenue Attribution
    {
      type: 'collapsible',
      label: 'Revenue Attribution',
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
              name: 'qualifiedLeads',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'agentsSigned',
              type: 'number',
              defaultValue: 0,
              admin: { width: '25%' },
            },
            {
              name: 'revenueAttributed',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Revenue in USD',
              },
            },
          ],
        },
      ],
    },
    // Social Engagement
    {
      type: 'collapsible',
      label: 'Social Engagement',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'shares',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'likes',
              type: 'number',
              defaultValue: 0,
              admin: { width: '33%' },
            },
            {
              name: 'comments',
              type: 'number',
              defaultValue: 0,
              admin: { width: '34%' },
            },
          ],
        },
      ],
    },
    // Technical Metrics (Core Web Vitals)
    {
      type: 'collapsible',
      label: 'Technical Metrics',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'avgPageLoadTime',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Average load time in ms',
              },
            },
            {
              name: 'avgLcp',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Largest Contentful Paint',
              },
            },
            {
              name: 'avgFid',
              type: 'number',
              admin: {
                width: '25%',
                description: 'First Input Delay',
              },
            },
            {
              name: 'avgCls',
              type: 'number',
              admin: {
                width: '25%',
                description: 'Cumulative Layout Shift',
              },
            },
          ],
        },
        {
          name: 'errors',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
  timestamps: true,
}
