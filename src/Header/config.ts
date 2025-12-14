import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'link',
          options: [
            { label: 'Single Link', value: 'link' },
            { label: 'Dropdown Menu', value: 'dropdown' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'The label shown in the navigation',
          },
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'link',
            },
          },
        }),
        {
          name: 'dropdownItems',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            link({
              appearances: false,
              disableLabel: true,
            }),
          ],
          maxRows: 20,
        },
        {
          name: 'includeDesignations',
          type: 'checkbox',
          label: 'Auto-include all designations',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
            description: 'Automatically add all active designations to this dropdown',
          },
        },
        {
          name: 'includeStates',
          type: 'checkbox',
          label: 'Auto-include all states',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
            description: 'Automatically add all states to this dropdown',
          },
        },
      ],
      maxRows: 10,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
