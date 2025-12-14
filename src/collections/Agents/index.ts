import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateAgent, revalidateDelete } from './hooks/revalidateAgent'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Agents: CollectionConfig<'agents'> = {
  slug: 'agents',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    designation: true,
    city: true,
    state: true,
    profilePhoto: true,
  },
  admin: {
    defaultColumns: ['name', 'designation', 'city', 'state', 'updatedAt'],
    useAsTitle: 'name',
    livePreview: {
      url: ({ data, req }) => {
        return `${req.protocol}//${req.host}/agents/${data?.slug || ''}`
      },
    },
    preview: (data, { req }) => {
      return `${req.protocol}//${req.host}/agents/${data?.slug || ''}`
    },
  },
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateAgent],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
      admin: {
        description: 'Agent\'s full legal name (e.g., Anthony Grynchal)',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
      label: 'Display Name / Designation Title',
      admin: {
        description: 'The designation title (e.g., Mr. Claremont™, Ms. Fresno™)',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'state',
                  type: 'relationship',
                  relationTo: 'states',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'designation',
              type: 'relationship',
              relationTo: 'designations',
              hasMany: true,
              label: 'Designation Types',
              admin: {
                description: 'Select the designation types for this agent (e.g., Mr. SEO, Mr. Luxury)',
              },
            },
            {
              name: 'profilePhoto',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Profile Photo',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Background Image',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Agent Logo',
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
              admin: {
                description: 'e.g., "TOP RATED REAL ESTATE AGENT IN CLAREMONT"',
              },
            },
            {
              name: 'bio',
              type: 'richText',
              label: 'Biography',
            },
            {
              name: 'shortBio',
              type: 'textarea',
              label: 'Short Bio',
              admin: {
                description: 'Brief description for listings and cards',
              },
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone Number',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email Address',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Street Address',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'city',
                      type: 'text',
                      admin: {
                        width: '40%',
                      },
                    },
                    {
                      name: 'state',
                      type: 'text',
                      admin: {
                        width: '30%',
                      },
                    },
                    {
                      name: 'zip',
                      type: 'text',
                      label: 'ZIP Code',
                      admin: {
                        width: '30%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'workingHours',
              type: 'array',
              label: 'Working Hours',
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  options: [
                    { label: 'Monday', value: 'monday' },
                    { label: 'Tuesday', value: 'tuesday' },
                    { label: 'Wednesday', value: 'wednesday' },
                    { label: 'Thursday', value: 'thursday' },
                    { label: 'Friday', value: 'friday' },
                    { label: 'Saturday', value: 'saturday' },
                    { label: 'Sunday', value: 'sunday' },
                  ],
                },
                {
                  name: 'hours',
                  type: 'text',
                  admin: {
                    description: 'e.g., 7 AM – 9:30 PM',
                  },
                },
              ],
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
                  name: 'twitter',
                  type: 'text',
                  label: 'Twitter/X URL',
                },
                {
                  name: 'pinterest',
                  type: 'text',
                  label: 'Pinterest URL',
                },
                {
                  name: 'tiktok',
                  type: 'text',
                  label: 'TikTok URL',
                },
                {
                  name: 'googleMaps',
                  type: 'text',
                  label: 'Google Maps URL',
                },
              ],
            },
          ],
        },
        {
          label: 'Credentials',
          fields: [
            {
              name: 'dreLicense',
              type: 'text',
              label: 'DRE License Number',
              admin: {
                description: 'e.g., DRE# 01873626',
              },
            },
            {
              name: 'brokerage',
              type: 'group',
              label: 'Brokerage',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Brokerage Name',
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Brokerage Logo',
                },
              ],
            },
            {
              name: 'certifications',
              type: 'array',
              label: 'Certifications & Designations',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., Certified Luxury Home Marketing Specialist',
                  },
                },
                {
                  name: 'abbreviation',
                  type: 'text',
                  admin: {
                    description: 'e.g., CLHMS',
                  },
                },
              ],
            },
            {
              name: 'experience',
              type: 'number',
              label: 'Years of Experience',
            },
            {
              name: 'memberSince',
              type: 'date',
              label: 'DLE Member Since',
            },
          ],
        },
        {
          label: 'Services',
          fields: [
            {
              name: 'services',
              type: 'array',
              label: 'Services Offered',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., Home Value & Appraisal Services',
                  },
                },
                {
                  name: 'description',
                  type: 'richText',
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'homeValueWidgetUrl',
              type: 'text',
              label: 'Home Value Widget URL',
              admin: {
                description: 'CloudCMA or similar home value widget URL',
              },
            },
          ],
        },
        {
          label: 'Gallery',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              label: 'Photo Gallery',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'FAQs',
          fields: [
            {
              name: 'faqs',
              type: 'array',
              label: 'Frequently Asked Questions',
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
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: '_status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Agent',
      admin: {
        position: 'sidebar',
        description: 'Show this agent in featured sections',
      },
    },
  ],
}
