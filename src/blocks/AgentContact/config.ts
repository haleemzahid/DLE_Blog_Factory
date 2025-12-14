import type { Block } from 'payload'

export const AgentContact: Block = {
  slug: 'agentContact',
  interfaceName: 'AgentContactBlock',
  labels: {
    singular: 'Agent Contact',
    plural: 'Agent Contacts',
  },
  fields: [
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      label: 'Agent',
      admin: {
        description: 'Auto-populate contact info from agent profile.',
      },
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Contact',
    },
    {
      name: 'showBio',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Agent Bio',
    },
    {
      name: 'showPhoto',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Agent Photo',
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Social Media Links',
    },
    {
      name: 'showWorkingHours',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Working Hours',
    },
    {
      name: 'showContactForm',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Contact Form',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'twoColumn',
      options: [
        { label: 'Two Column', value: 'twoColumn' },
        { label: 'Sidebar Layout', value: 'sidebar' },
        { label: 'Full Width', value: 'fullWidth' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'gray' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}
