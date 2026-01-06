import type { Block } from 'payload'

export const DesignationDirectory: Block = {
  slug: 'designationDirectory',
  interfaceName: 'DesignationDirectoryBlock',
  labels: {
    singular: 'Designation Directory',
    plural: 'Designation Directory Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Directory Title',
      defaultValue: 'Designation Directory',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      defaultValue: 'Agent Designations™',
    },
    {
      name: 'headerBackgroundColor',
      type: 'text',
      label: 'Header Background Color',
      defaultValue: '#2B7CB3',
      admin: {
        description: 'Background color for the header section',
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'YouTube Video URL',
      admin: {
        description: 'YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)',
      },
    },
    {
      name: 'showVideo',
      type: 'checkbox',
      label: 'Show Video Section',
      defaultValue: true,
    },
    {
      name: 'state',
      type: 'relationship',
      label: 'State',
      relationTo: 'states',
      admin: {
        description: 'Select a state to show designations for (optional - if not selected, designations will be entered manually)',
      },
    },
    {
      name: 'mrDesignations',
      type: 'array',
      label: 'Mr. Designations',
      admin: {
        description: 'List of Mr. designations (used if no state is selected)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Designation Title',
          required: true,
          admin: {
            placeholder: 'e.g., Mr. California ™',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          admin: {
            placeholder: 'e.g., /designations/mr-california',
          },
        },
      ],
    },
    {
      name: 'msDesignations',
      type: 'array',
      label: 'Ms. Designations',
      admin: {
        description: 'List of Ms. designations (used if no state is selected)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Designation Title',
          required: true,
          admin: {
            placeholder: 'e.g., Ms. California ™',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          admin: {
            placeholder: 'e.g., /designations/ms-california',
          },
        },
      ],
    },
    {
      name: 'showMapBackground',
      type: 'checkbox',
      label: 'Show Map Background',
      defaultValue: true,
    },
    {
      name: 'mapBackgroundImage',
      type: 'upload',
      label: 'Map Background Image',
      relationTo: 'media',
      admin: {
        description: 'Optional custom map background image',
      },
    },
    {
      name: 'showCTA',
      type: 'checkbox',
      label: 'Show Call to Action Section',
      defaultValue: true,
    },
    {
      name: 'ctaTitle',
      type: 'text',
      label: 'CTA Title',
      defaultValue: 'Claim Your Designation',
    },
    {
      name: 'ctaDescription',
      type: 'textarea',
      label: 'CTA Description',
      defaultValue:
        'Become the exclusive Designated Local Expert for your city. Get trademark-protected branding and SEO dominance.',
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      label: 'Primary CTA Button Text',
      defaultValue: 'Apply for DLE Membership',
    },
    {
      name: 'ctaButtonLink',
      type: 'text',
      label: 'Primary CTA Button Link',
      defaultValue: '/apply',
    },
    {
      name: 'ctaSecondaryText',
      type: 'text',
      label: 'Secondary CTA Button Text',
      defaultValue: 'Inquire About Availability',
    },
    {
      name: 'ctaSecondaryLink',
      type: 'text',
      label: 'Secondary CTA Button Link',
      defaultValue: '/member-relations',
    },
  ],
}
