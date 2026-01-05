import type { CollectionConfig } from 'payload'

export const KeywordRankings: CollectionConfig = {
  slug: 'keyword-rankings',
  admin: {
    useAsTitle: 'keyword',
    group: 'Analytics',
    defaultColumns: ['keyword', 'post', 'position', 'impressions', 'clicks', 'date'],
    description: 'Tracks keyword rankings from Google Search Console',
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
      index: true,
      hasMany: false,
    },
    {
      name: 'keyword',
      type: 'text',
      required: true,
      index: true,
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
    {
      type: 'row',
      fields: [
        {
          name: 'position',
          type: 'number',
          required: true,
          admin: { width: '25%' },
        },
        {
          name: 'impressions',
          type: 'number',
          defaultValue: 0,
          admin: { width: '25%' },
        },
        {
          name: 'clicks',
          type: 'number',
          defaultValue: 0,
          admin: { width: '25%' },
        },
        {
          name: 'ctr',
          type: 'number',
          admin: {
            width: '25%',
            description: 'Click-through rate',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'searchEngine',
          type: 'select',
          defaultValue: 'google',
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Bing', value: 'bing' },
            { label: 'Yahoo', value: 'yahoo' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'US',
          admin: { width: '33%' },
        },
        {
          name: 'device',
          type: 'select',
          defaultValue: 'desktop',
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
          ],
          admin: { width: '34%' },
        },
      ],
    },
  ],
  timestamps: true,
}
