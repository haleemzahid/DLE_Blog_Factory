import type { Block } from 'payload'

export const HomepageBlog: Block = {
  slug: 'homepageBlog',
  interfaceName: 'HomepageBlogBlock',
  labels: {
    singular: 'Homepage Blog',
    plural: 'Homepage Blogs',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'DLE Network Blog',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Section Subtitle',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of Posts to Show',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
    {
      name: 'showMainBlog',
      type: 'checkbox',
      label: 'Show Main Website Blogs',
      defaultValue: true,
      admin: {
        description: 'Include posts with type "Main Website Blog"',
      },
    },
    {
      name: 'showSyndicatedOnHomepage',
      type: 'checkbox',
      label: 'Show Syndicated Posts Marked for Homepage',
      defaultValue: true,
      admin: {
        description: 'Include syndicated posts with "Show on Homepage" checked',
      },
    },
    {
      name: 'showFeaturedOnly',
      type: 'checkbox',
      label: 'Show Featured Posts Only',
      defaultValue: false,
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout Style',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Featured + Grid', value: 'featured' },
      ],
    },
  ],
}
