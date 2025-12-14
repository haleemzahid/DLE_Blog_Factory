import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'agent', 'rating', 'featured'],
    group: 'Agents',
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Client Name',
    },
    {
      name: 'clientPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Client Photo',
    },
    {
      name: 'isLocalGuide',
      type: 'checkbox',
      defaultValue: false,
      label: 'Google Local Guide',
      admin: {
        description: 'Is this reviewer a Google Local Guide?',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Rating (1-5)',
    },
    {
      name: 'review',
      type: 'textarea',
      required: true,
      label: 'Review Text',
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      required: true,
      label: 'Agent',
      admin: {
        description: 'The agent this testimonial belongs to',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'google',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Yelp', value: 'yelp' },
        { label: 'Zillow', value: 'zillow' },
        { label: 'Realtor.com', value: 'realtor' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Direct', value: 'direct' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Source URL',
      admin: {
        description: 'Link to the original review',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Review Date',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: {
        position: 'sidebar',
        description: 'Show this testimonial prominently',
      },
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: true,
      label: 'Approved',
      admin: {
        position: 'sidebar',
        description: 'Only approved testimonials will be displayed',
      },
    },
  ],
}
