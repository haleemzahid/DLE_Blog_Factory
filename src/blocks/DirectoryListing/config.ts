import type { Block } from 'payload'

export const DirectoryListing: Block = {
  slug: 'directoryListing',
  interfaceName: 'DirectoryListingBlock',
  labels: {
    singular: 'Directory Listing',
    plural: 'Directory Listings',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Designation Directory',
    },
    {
      name: 'listingType',
      type: 'select',
      required: true,
      defaultValue: 'agents',
      options: [
        { label: 'Agents by State', value: 'agents' },
        { label: 'States', value: 'states' },
        { label: 'Designations', value: 'designations' },
      ],
    },
    {
      name: 'filterByState',
      type: 'relationship',
      relationTo: 'states',
      label: 'Filter by State',
      admin: {
        condition: (_, siblingData) => siblingData?.listingType === 'agents',
        description: 'Show only agents from this state',
      },
    },
    {
      name: 'filterByDesignation',
      type: 'relationship',
      relationTo: 'designations',
      label: 'Filter by Designation',
      admin: {
        condition: (_, siblingData) => siblingData?.listingType === 'agents',
        description: 'Show only agents with this designation',
      },
    },
    {
      name: 'filterByCountry',
      type: 'select',
      label: 'Filter by Country',
      admin: {
        condition: (_, siblingData) => siblingData?.listingType === 'states',
      },
      options: [
        { label: 'All Countries', value: 'all' },
        { label: 'United States', value: 'usa' },
        { label: 'Canada', value: 'canada' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Australia', value: 'australia' },
        { label: 'New Zealand', value: 'new-zealand' },
        { label: 'United Arab Emirates', value: 'uae' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'multiColumn',
      options: [
        { label: 'Multi-Column List', value: 'multiColumn' },
        { label: 'Grid Cards', value: 'grid' },
        { label: 'Alphabetical Groups', value: 'alphabetical' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
        { label: '5 Columns', value: '5' },
      ],
    },
    {
      name: 'showApplyButton',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Apply for Membership Button',
    },
    {
      name: 'showInquireButton',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Inquire About Availability Button',
    },
    {
      name: 'applyButtonUrl',
      type: 'text',
      defaultValue: '/apply',
      label: 'Apply Button URL',
      admin: {
        condition: (_, siblingData) => siblingData?.showApplyButton,
      },
    },
    {
      name: 'inquireButtonUrl',
      type: 'text',
      defaultValue: '/member-relations',
      label: 'Inquire Button URL',
      admin: {
        condition: (_, siblingData) => siblingData?.showInquireButton,
      },
    },
  ],
}
