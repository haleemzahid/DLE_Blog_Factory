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
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow Text',
      defaultValue: 'We Love Them',
      admin: {
        description: 'Small text above the title (e.g., "We Love Them")',
      },
    },
    {
      name: 'eyebrowColor',
      type: 'text',
      label: 'Eyebrow Color',
      defaultValue: '#dc2626',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'What Our Clients Have To Say',
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      dbName: 'feat_test_items',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Client Photo',
        },
        {
          name: 'quote',
          type: 'textarea',
          label: 'Testimonial Quote',
          required: true,
          admin: {
            description: 'The testimonial text',
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
          name: 'clientTitle',
          type: 'text',
          label: 'Client Title/Location',
          admin: {
            description: 'e.g., "Ms. Glendora" or "Real Estate Agent, Los Angeles"',
          },
        },
      ],
    },
    {
      name: 'nameColor',
      type: 'text',
      label: 'Client Name Color',
      defaultValue: '#dc2626',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
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
      defaultValue: '#ffffff',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
  ],
}
