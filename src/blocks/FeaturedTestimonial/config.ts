import type { Block } from 'payload'

export const FeaturedTestimonial: Block = {
  slug: 'featuredTestimonial',
  dbName: 'featTest',
  interfaceName: 'FeaturedTestimonialBlock',
  labels: {
    singular: 'Featured Testimonial',
    plural: 'Featured Testimonials',
  },
  fields: [
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Client Photo',
      required: true,
    },
    {
      name: 'quote',
      type: 'textarea',
      label: 'Testimonial Quote',
      required: true,
      admin: {
        description: 'The testimonial text (will be displayed with quotation marks)',
      },
    },
    {
      name: 'clientName',
      type: 'text',
      label: 'Client Name',
      required: true,
      admin: {
        description: 'e.g., "Brianna L"',
      },
    },
    {
      name: 'nameColor',
      type: 'text',
      label: 'Name Color',
      defaultValue: '#dc2626',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'clientTitle',
      type: 'text',
      label: 'Client Title/Location',
      admin: {
        description: 'e.g., "Ms. Glendora" or "Real Estate Agent, Los Angeles"',
      },
    },
    {
      name: 'photoPosition',
      type: 'select',
      label: 'Photo Position',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#f9fafb',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
  ],
}
