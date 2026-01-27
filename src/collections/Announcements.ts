import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'scope', 'isActive', 'startDate', 'endDate', 'priority'],
    group: 'Content Management',
    description: 'Announcements, alerts, and promotions that can be injected into posts via tokens',
  },
  fields: [
    // Basic Info
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      admin: {
        description: 'Announcement headline',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Unique identifier for this announcement',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      admin: {
        description: 'Main announcement content (supports tokens like {{CITY_NAME}})',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      admin: {
        description: 'Short summary for cards/previews',
        rows: 3,
      },
    },

    // Type & Style
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Type',
          defaultValue: 'news',
          options: [
            { label: 'Banner', value: 'banner' },
            { label: 'Alert', value: 'alert' },
            { label: 'News', value: 'news' },
            { label: 'Promotion', value: 'promo' },
            { label: 'Hot Deal', value: 'hot-deal' },
            { label: 'Market Update', value: 'market-update' },
            { label: 'Event', value: 'event' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'style',
          type: 'select',
          label: 'Style',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Urgent', value: 'urgent' },
            { label: 'Success', value: 'success' },
            { label: 'Warning', value: 'warning' },
            { label: 'Info', value: 'info' },
            { label: 'Subtle', value: 'subtle' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },

    // Visual
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      admin: {
        description: 'Optional image for the announcement',
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icon',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Success', value: 'success' },
        { label: 'Fire / Hot', value: 'fire' },
        { label: 'Star', value: 'star' },
        { label: 'Bell', value: 'bell' },
        { label: 'Megaphone', value: 'megaphone' },
        { label: 'Calendar', value: 'calendar' },
        { label: 'Dollar', value: 'dollar' },
        { label: 'Home', value: 'home' },
        { label: 'Chart Up', value: 'chart-up' },
        { label: 'Chart Down', value: 'chart-down' },
      ],
      defaultValue: 'none',
    },

    // Scope & Targeting
    {
      name: 'scope',
      type: 'select',
      required: true,
      label: 'Scope',
      defaultValue: 'global',
      options: [
        { label: 'Global (All Posts)', value: 'global' },
        { label: 'State', value: 'state' },
        { label: 'City', value: 'city' },
        { label: 'Agent', value: 'agent' },
      ],
      admin: {
        description: 'Global = shows on ALL posts. State/City/Agent = shows only on matching posts.',
      },
    },
    {
      name: 'targetStates',
      type: 'relationship',
      relationTo: 'states',
      hasMany: true,
      label: 'Target States',
      admin: {
        condition: (data) => data?.scope === 'state',
        description: 'Select which states should see this announcement',
      },
    },
    {
      name: 'targetCities',
      type: 'relationship',
      relationTo: 'cityData',
      hasMany: true,
      label: 'Target Cities',
      admin: {
        condition: (data) => data?.scope === 'city',
        description: 'Select which cities should see this announcement',
      },
    },
    {
      name: 'targetAgents',
      type: 'relationship',
      relationTo: 'agents',
      hasMany: true,
      label: 'Target Agents',
      admin: {
        condition: (data) => data?.scope === 'agent',
        description: 'Select which agents should see this announcement',
      },
    },
    {
      name: 'excludeAgents',
      type: 'relationship',
      relationTo: 'agents',
      hasMany: true,
      label: 'Exclude Agents',
      admin: {
        description: 'Agents who should NOT see this announcement (overrides targeting)',
      },
    },

    // Scheduling
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Start Date',
          admin: {
            width: '50%',
            description: 'When this announcement becomes active',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'End Date',
          admin: {
            width: '50%',
            description: 'When this announcement expires',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Inactive announcements will not be displayed',
      },
    },

    // Priority
    {
      name: 'priority',
      type: 'number',
      label: 'Priority',
      defaultValue: 50,
      min: 1,
      max: 100,
      admin: {
        description: 'Higher priority announcements are shown first (1-100)',
      },
    },

    // CTA
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
          admin: {
            placeholder: 'Learn More',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          admin: {
            placeholder: '/guides/spring-buying or https://...',
          },
        },
        {
          name: 'linkType',
          type: 'radio',
          label: 'Link Type',
          defaultValue: 'internal',
          options: [
            { label: 'Internal', value: 'internal' },
            { label: 'External', value: 'external' },
          ],
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in New Tab',
          defaultValue: false,
        },
      ],
    },

    // Analytics (read-only)
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'impressions',
          type: 'number',
          defaultValue: 0,
          label: 'Impressions',
        },
        {
          name: 'clicks',
          type: 'number',
          defaultValue: 0,
          label: 'Clicks',
        },
      ],
    },
  ],
}
