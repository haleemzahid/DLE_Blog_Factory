import type { Block } from 'payload'

export const ArticlesSection: Block = {
  slug: 'articlesSection',
  interfaceName: 'ArticlesSectionBlock',
  labels: {
    singular: 'Articles Section',
    plural: 'Articles Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Articles',
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'latest',
      options: [
        { label: 'Latest Posts', value: 'latest' },
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
      defaultValue: 4,
      min: 1,
      max: 20,
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Number of Columns',
      defaultValue: '2',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'showAuthor',
      type: 'checkbox',
      label: 'Show Author Name',
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
      name: 'showReadMore',
      type: 'checkbox',
      label: 'Show "Read More" Link',
      defaultValue: true,
    },
    {
      name: 'enablePagination',
      type: 'checkbox',
      label: 'Enable Pagination',
      defaultValue: false,
    },
    {
      name: 'postsPerPage',
      type: 'number',
      label: 'Posts Per Page',
      defaultValue: 4,
      min: 1,
      max: 20,
      admin: {
        condition: (_, siblingData) => siblingData?.enablePagination === true,
      },
    },
    {
      name: 'titleColor',
      type: 'text',
      label: 'Title Color',
      defaultValue: '#1a1a1a',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'readMoreColor',
      type: 'text',
      label: 'Read More Link Color',
      defaultValue: '#dc2626',
      admin: {
        components: {
          Field: '@/components/ColorPickerField#ColorPickerField',
        },
      },
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
