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
    defaultColumns: ['name', 'abbreviation', 'country'],
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
  ],
}
