import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ Block',
    plural: 'FAQ Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      label: 'Agent',
      admin: {
        description: 'Auto-populate FAQs from agent profile. Leave blank to use manual selection.',
      },
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'Manual FAQs',
      admin: {
        description: 'Manually add FAQs. Will be used if no agent is selected.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'accordion',
      options: [
        { label: 'Accordion', value: 'accordion' },
        { label: 'Two Column', value: 'twoColumn' },
        { label: 'Expandable List', value: 'list' },
      ],
    },
    {
      name: 'defaultOpen',
      type: 'checkbox',
      defaultValue: false,
      label: 'Default First Item Open',
    },
  ],
}
