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
    heroImage: true,
    logo: true,
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
    beforeChange: [
      populatePublishedAt,
      // Auto-generate fullDesignation
      async ({ data }) => {
        if (data.designationPrefix) {
          const cityName = data.designationCity || data.city
          if (cityName) {
            data.fullDesignation = `${data.designationPrefix} ${cityName}™`
          }
        }
        return data
      },
    ],
    afterChange: [
      revalidateAgent,
      // Auto-create tenant for agents if requested
      async ({ doc, req, operation }) => {
        if (operation === 'create' && doc.autoCreateTenant && !doc.tenant) {
          try {
            const tenant = await req.payload.create({
              collection: 'tenants',
              data: {
                name: doc.fullDesignation || doc.displayName || doc.name,
                slug: doc.slug,
                type: 'agent',
                status: 'pending',
                linkedAgent: doc.id,
                seoDefaults: {
                  siteName: doc.fullDesignation || doc.displayName || doc.name,
                  defaultDescription: `${doc.fullDesignation || doc.displayName} - Your Designated Local Expert real estate agent in ${doc.city}. Find your dream home with the top-rated agent in the area.`,
                },
              },
            })

            // Link tenant back to agent
            await req.payload.update({
              collection: 'agents',
              id: doc.id,
              data: { tenant: tenant.id, autoCreateTenant: false },
            })
          } catch (error) {
            console.error('Error auto-creating tenant:', error)
          }
        }
      },
    ],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
      admin: {
        description: "Agent's full legal name (e.g., Anthony Grynchal)",
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
                description:
                  'Select the designation types for this agent (e.g., Mr. SEO, Mr. Luxury)',
              },
            },
            {
              name: 'profilePhoto',
              type: 'upload',
              relationTo: 'media',
              required: false,
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
              name: 'website',
              type: 'text',
              label: 'Website URL',
              admin: {
                description: 'e.g., www.MrClaremont.com',
              },
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
    // Multi-Tenant Fields
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        position: 'sidebar',
        description: 'The tenant site for this agent',
      },
    },
    {
      name: 'designationPrefix',
      type: 'select',
      options: [
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Title prefix for designation (e.g., Mr., Ms., Mrs.)',
      },
    },
    {
      name: 'fullDesignation',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated: Mr./Ms./Mrs. [City]™',
      },
    },
    {
      name: 'autoCreateTenant',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Automatically create a tenant site for this agent on save',
        condition: (data) => !data?.tenant,
      },
    },
    // Directory System Fields
    {
      name: 'designationCity',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'City name for designation (e.g., "Dallas" for Mr. Dallas). If blank, uses city field.',
      },
    },
    {
      name: 'designationSpecialties',
      type: 'relationship',
      relationTo: 'designations',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Additional specialty designations (e.g., Mr. SEO, Ms. Luxury)',
      },
    },
    {
      name: 'territoryExclusive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Is this agent the exclusive Mr./Ms. for their city?',
      },
    },
    {
      name: 'showInDirectory',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show this agent in the public directory',
      },
    },
    {
      name: 'directoryOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Order within directory listings (lower = first)',
      },
    },
  ],
}
