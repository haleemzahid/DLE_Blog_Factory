import type { Block } from 'payload'

export const HomeValueForm: Block = {
  slug: 'homeValueForm',
  interfaceName: 'HomeValueFormBlock',
  labels: {
    singular: 'Home Value Form',
    plural: 'Home Value Forms',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: "What's My Home Worth?",
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Get instant access to all the homes that sold in your neighborhood from the most Exclusive Real Estate Network.',
    },
    {
      name: 'inputPlaceholder',
      type: 'text',
      defaultValue: 'Enter Your Home Address',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'CONTINUE',
    },
    {
      name: 'widgetUrl',
      type: 'text',
      label: 'External Widget URL',
      admin: {
        description: 'CloudCMA or similar home value widget URL. Leave blank to use internal form.',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Left Aligned', value: 'left' },
        { label: 'With Sidebar', value: 'sidebar' },
      ],
    },
  ],
}
