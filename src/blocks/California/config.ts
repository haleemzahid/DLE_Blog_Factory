import type { Block } from 'payload'

export const California: Block = {
  slug: 'california',
  interfaceName: 'CaliforniaBlock',
  labels: {
    singular: 'California',
    plural: 'California Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'California',
      required: true,
    },
    {
      name: 'mrDesignations',
      type: 'array',
      label: 'Mr. California Cities',
      admin: {
        description: 'List of Mr. California city designations',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Designation Title',
          required: true,
          admin: {
            placeholder: 'e.g., Mr. Los Angeles ™',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          admin: {
            placeholder: 'e.g., /designations/mr-los-angeles',
          },
        },
      ],
    },
    {
      name: 'msDesignations',
      type: 'array',
      label: 'Ms. California Cities',
      admin: {
        description: 'List of Ms. California city designations',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Designation Title',
          required: true,
          admin: {
            placeholder: 'e.g., Ms. Los Angeles ™',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          admin: {
            placeholder: 'e.g., /designations/ms-los-angeles',
          },
        },
      ],
    },
  ],
}
