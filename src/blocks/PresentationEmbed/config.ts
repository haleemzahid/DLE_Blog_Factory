import type { Block } from 'payload'

export const PresentationEmbed: Block = {
  slug: 'presentationEmbed',
  interfaceName: 'PresentationEmbedBlock',
  labels: {
    singular: 'Presentation Embed',
    plural: 'Presentation Embed Blocks',
  },
  fields: [
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#1E699B',
      admin: {
        description: 'Background color for the section',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        description: 'Optional heading above the presentation',
      },
    },
    {
      name: 'headingColor',
      type: 'text',
      label: 'Heading Color',
      defaultValue: '#ffffff',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'presentationUrl',
      type: 'text',
      label: 'Presentation Embed URL',
      required: true,
      admin: {
        description:
          'PowerPoint Online embed URL (from Office 365), Google Slides embed URL, or other presentation platform embed URL. For PowerPoint: Share > Embed, then copy the src URL from the iframe code.',
      },
    },
    {
      name: 'presentationTitle',
      type: 'text',
      label: 'Presentation Title',
      admin: {
        description: 'Accessible title for the presentation (for screen readers)',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      defaultValue: '16:9',
      options: [
        {
          label: '16:9 (Widescreen)',
          value: '16:9',
        },
        {
          label: '4:3 (Standard)',
          value: '4:3',
        },
        {
          label: '16:10',
          value: '16:10',
        },
      ],
    },
    {
      name: 'downloadLink',
      type: 'text',
      label: 'Download Link (Optional)',
      admin: {
        description:
          'Direct link to download the presentation file (e.g., .pptx file hosted on your server or cloud storage)',
      },
    },
    {
      name: 'downloadButtonText',
      type: 'text',
      label: 'Download Button Text',
      defaultValue: 'Download BA PowerPoint Introduction to DLE',
      admin: {
        condition: (_, siblingData) => !!siblingData?.downloadLink,
      },
    },
    {
      name: 'downloadButtonColor',
      type: 'text',
      label: 'Download Button Background Color',
      defaultValue: '#dc2626',
      admin: {
        condition: (_, siblingData) => !!siblingData?.downloadLink,
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'downloadButtonTextColor',
      type: 'text',
      label: 'Download Button Text Color',
      defaultValue: '#ffffff',
      admin: {
        condition: (_, siblingData) => !!siblingData?.downloadLink,
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
  ],
}
