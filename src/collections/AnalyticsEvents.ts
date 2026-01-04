import type { CollectionConfig } from 'payload'

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  admin: {
    useAsTitle: 'event',
    group: 'Analytics',
    defaultColumns: ['event', 'sessionId', 'postId', 'serverTimestamp'],
    description: 'Raw analytics events collected from the website',
  },
  access: {
    create: () => true, // Allow anonymous event tracking
    read: ({ req: { user } }) => Boolean(user), // Only authenticated users can read
    update: () => false, // Events are immutable
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'event',
      type: 'select',
      required: true,
      options: [
        { label: 'Page View', value: 'page_view' },
        { label: 'Scroll Depth', value: 'scroll_depth' },
        { label: 'Time on Page', value: 'time_on_page' },
        { label: 'Link Click', value: 'link_click' },
        { label: 'Form Submission', value: 'form_submission' },
        { label: 'Video Play', value: 'video_play' },
        { label: 'CTA Click', value: 'cta_click' },
        { label: 'Core Web Vitals', value: 'core_web_vitals' },
        { label: 'Page Exit', value: 'page_exit' },
        { label: 'Download', value: 'download' },
        { label: 'Share', value: 'share' },
        { label: 'Lead Magnet Download', value: 'lead_magnet_download' },
        { label: 'Email Click', value: 'email_click' },
        { label: 'Phone Click', value: 'phone_click' },
        { label: 'Demo Scheduled', value: 'demo_scheduled' },
        { label: 'Comment Submitted', value: 'comment_submitted' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    // Content Context
    {
      type: 'row',
      fields: [
        {
          name: 'postId',
          type: 'relationship',
          relationTo: 'posts',
          hasMany: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'pageId',
          type: 'relationship',
          relationTo: 'pages',
          hasMany: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'agentId',
      type: 'relationship',
      relationTo: 'agents',
      hasMany: false,
    },
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: false,
    },
    // Event Data (flexible JSON)
    {
      name: 'eventData',
      type: 'json',
      admin: {
        description: 'Additional event-specific data',
      },
    },
    // User Context
    {
      type: 'collapsible',
      label: 'User Context',
      fields: [
        {
          name: 'ipAddress',
          type: 'text',
          admin: {
            description: 'Hashed/anonymized IP address',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'country',
              type: 'text',
              admin: { width: '25%' },
            },
            {
              name: 'region',
              type: 'text',
              admin: { width: '25%' },
            },
            {
              name: 'city',
              type: 'text',
              admin: { width: '25%' },
            },
            {
              name: 'timezone',
              type: 'text',
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
    // Device Context
    {
      type: 'collapsible',
      label: 'Device Context',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'deviceType',
              type: 'select',
              options: [
                { label: 'Desktop', value: 'desktop' },
                { label: 'Mobile', value: 'mobile' },
                { label: 'Tablet', value: 'tablet' },
              ],
              admin: { width: '25%' },
            },
            {
              name: 'browser',
              type: 'text',
              admin: { width: '25%' },
            },
            {
              name: 'os',
              type: 'text',
              admin: { width: '25%' },
            },
            {
              name: 'screenSize',
              type: 'text',
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'userAgent',
          type: 'textarea',
        },
      ],
    },
    // Traffic Context
    {
      type: 'collapsible',
      label: 'Traffic Context',
      fields: [
        {
          name: 'referrer',
          type: 'text',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'utmSource',
              type: 'text',
              admin: { width: '33%' },
            },
            {
              name: 'utmMedium',
              type: 'text',
              admin: { width: '33%' },
            },
            {
              name: 'utmCampaign',
              type: 'text',
              admin: { width: '34%' },
            },
          ],
        },
      ],
    },
    // Timestamps
    {
      name: 'clientTimestamp',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'serverTimestamp',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
