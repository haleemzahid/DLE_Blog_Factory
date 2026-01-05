import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Designations: CollectionConfig = {
  slug: 'designations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'prefix'],
    group: 'Directory',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Designation Title',
      admin: {
        description: 'e.g., Mr. SEO™, Mrs. Luxury™, Mr. Listings™',
      },
    },
    {
      name: 'prefix',
      type: 'select',
      required: true,
      options: [
        { label: 'Mr.', value: 'mr' },
        { label: 'Mrs.', value: 'mrs' },
        { label: 'Ms.', value: 'ms' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'City-Based', value: 'city' },
        { label: 'SEO & Marketing', value: 'seo' },
        { label: 'Luxury', value: 'luxury' },
        { label: 'Listings', value: 'listings' },
        { label: 'New Build', value: 'new-build' },
        { label: 'Title & Escrow', value: 'title' },
        { label: 'Mobile Home', value: 'mobile-home' },
        { label: 'Appraisal', value: 'appraisal' },
        { label: 'Fix & Flip', value: 'fix-flip' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Open House', value: 'open-house' },
        { label: 'Offers', value: 'offers' },
        { label: 'Nationwide', value: 'nationwide' },
        { label: 'Efficiency', value: 'efficiency' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'Brief description for cards and listings',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icon',
    },
    {
      name: 'parentDesignation',
      type: 'relationship',
      relationTo: 'designations',
      label: 'Parent Designation',
      admin: {
        description: 'For nested dropdown menus (e.g., Mr. Listings → Mr. Marketing)',
      },
    },
    {
      name: 'headerImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Header Image',
    },
    {
      name: 'homeValueFormTitle',
      type: 'text',
      defaultValue: "What's My Home Worth?",
      label: 'Home Value Form Title',
    },
    {
      name: 'homeValueFormDescription',
      type: 'textarea',
      defaultValue:
        'Get instant access to all the homes that sold in your neighborhood from the most Exclusive Real Estate Network.',
      label: 'Home Value Form Description',
    },
    slugField({
      position: undefined,
    }),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured in Navigation',
      admin: {
        position: 'sidebar',
        description: 'Show in the main navigation dropdown',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Sort Order',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'badgeColor',
      type: 'text',
      defaultValue: '#dc2626',
      label: 'Badge Color',
      admin: {
        position: 'sidebar',
        description: 'Hex color for badge display (e.g., #dc2626)',
        placeholder: '#dc2626',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        position: 'sidebar',
        description: 'Show this designation in menus and listings',
      },
    },
    // SEO for designation pages
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO Title',
          admin: {
            placeholder: 'e.g., Find Your Local SEO Real Estate Expert',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO Description',
          maxLength: 160,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image',
        },
      ],
    },
  ],
}
