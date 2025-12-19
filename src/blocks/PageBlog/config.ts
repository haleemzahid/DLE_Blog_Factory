import type { Block } from 'payload'

export const PageBlog: Block = {
  slug: 'pageBlog',
  interfaceName: 'PageBlogBlock',
  labels: {
    singular: 'Page Blog',
    plural: 'Page Blogs',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Latest Articles',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Section Subtitle',
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (Posts Related to This Page)', value: 'auto' },
        { label: 'By Category', value: 'category' },
        { label: 'Manual Selection', value: 'manual' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'category',
        description: 'Filter posts by these categories',
      },
    },
    {
      name: 'selectedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.displayMode === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of Posts',
      defaultValue: 6,
      min: 1,
      max: 20,
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout Style',
      defaultValue: 'grid',
      options: [
        { label: 'Grid (3 columns)', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Compact', value: 'compact' },
      ],
    },
    {
      name: 'showReadMore',
      type: 'checkbox',
      label: 'Show "Read More" link on each card',
      defaultValue: true,
    },
    {
      name: 'showDate',
      type: 'checkbox',
      label: 'Show Publication Date',
      defaultValue: true,
    },
    {
      name: 'showExcerpt',
      type: 'checkbox',
      label: 'Show Excerpt',
      defaultValue: true,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'View All Button Label',
      defaultValue: 'Learn More',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'View All Button Link',
      admin: {
        description: 'Leave empty to hide the button',
      },
    },
  ],
}
