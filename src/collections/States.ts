import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const States: CollectionConfig = {
  slug: 'states',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'abbreviation', 'country', 'showInNavigation'],
    group: 'Directory',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'State/Region Name',
      admin: {
        description: 'e.g., California, Texas, Florida',
      },
    },
    {
      name: 'abbreviation',
      type: 'text',
      required: true,
      label: 'Abbreviation',
      admin: {
        description: 'e.g., CA, TX, FL',
      },
    },
    {
      name: 'country',
      type: 'select',
      required: true,
      defaultValue: 'usa',
      options: [
        { label: 'United States', value: 'usa' },
        { label: 'Canada', value: 'canada' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Australia', value: 'australia' },
        { label: 'New Zealand', value: 'new-zealand' },
        { label: 'United Arab Emirates', value: 'uae' },
      ],
    },
    {
      name: 'isUnincorporated',
      type: 'checkbox',
      defaultValue: false,
      label: 'Unincorporated Area',
      admin: {
        description: 'Check if this is an unincorporated area directory',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Description for the state network page',
      },
    },
    slugField({
      position: undefined,
    }),
    {
      name: 'headerImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Header Image',
    },
    {
      name: 'featuredVideo',
      type: 'text',
      label: 'Featured Video URL',
      admin: {
        description: 'YouTube or Vimeo embed URL (e.g., https://www.youtube.com/embed/...)',
        placeholder: 'https://www.youtube.com/embed/...',
      },
    },
    // Cities within this state for directory listing
    {
      name: 'cities',
      type: 'array',
      label: 'Cities',
      admin: {
        description: 'All available cities in this state for Mr./Ms. designations',
      },
      fields: [
        {
          name: 'cityName',
          type: 'text',
          required: true,
          label: 'City Name',
        },
        {
          name: 'citySlug',
          type: 'text',
          required: true,
          label: 'City Slug',
          admin: {
            description: 'URL-friendly version (e.g., los-angeles)',
          },
        },
        {
          name: 'population',
          type: 'number',
          label: 'Population',
          admin: {
            description: 'For sorting by market size',
          },
        },
        {
          name: 'mrAgent',
          type: 'relationship',
          relationTo: 'agents',
          label: 'Mr. [City] Agent',
          admin: {
            description: 'Mr. designation holder for this city',
          },
        },
        {
          name: 'msAgent',
          type: 'relationship',
          relationTo: 'agents',
          label: 'Ms./Mrs. [City] Agent',
          admin: {
            description: 'Ms./Mrs. designation holder for this city',
          },
        },
        {
          name: 'isAvailable',
          type: 'checkbox',
          defaultValue: true,
          label: 'Available',
          admin: {
            description: 'Is this city available for new agents?',
          },
        },
      ],
    },
    // Virtual field for agent count (read-only)
    {
      name: 'agentCount',
      type: 'number',
      label: 'Agent Count',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Number of agents in this state (auto-calculated)',
      },
    },
    // Navigation settings
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show in Navigation',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'navigationOrder',
      type: 'number',
      label: 'Navigation Order',
      admin: {
        position: 'sidebar',
        description: 'Order in navigation menus (lower = first)',
      },
    },
    // SEO for state network pages
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO Title',
          admin: {
            placeholder: 'e.g., California Real Estate Network | DLE',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO Description',
          maxLength: 160,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image',
        },
      ],
    },
  ],
}
