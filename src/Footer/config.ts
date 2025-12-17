import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      admin: {
        description: 'Links like ADA disclaimer, Sitemap, Privacy Policy, etc.',
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
      maxRows: 10,
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: 'Designated Local Expert Network',
      admin: {
        description: 'Company name for copyright notice',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube URL',
        },
        {
          name: 'pinterest',
          type: 'text',
          label: 'Pinterest URL',
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'textarea',
      label: 'Disclaimer Text',
      defaultValue:
        'Designated Local Expert is an Equal Opportunity Employer and supports the Fair Housing Act and equal opportunity housing. If you have a disability that is preventing you from experiencing this website, call',
      admin: {
        description: 'Disclaimer text displayed at the bottom of the footer',
      },
    },
    {
      name: 'disclaimerPhone',
      type: 'text',
      label: 'Disclaimer Phone Number',
      admin: {
        description: 'Phone number to display after the disclaimer text',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Additional Nav Items (Legacy)',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
