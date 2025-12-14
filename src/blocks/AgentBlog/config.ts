import type { Block } from 'payload'

export const AgentBlog: Block = {
  slug: 'agentBlog',
  interfaceName: 'AgentBlogBlock',
  labels: {
    singular: 'Agent Blog',
    plural: 'Agent Blogs',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Latest Articles',
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
      label: 'Agent',
      admin: {
        description: 'Show blog posts for this agent. Leave blank to show general posts.',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Filter by Categories',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      label: 'Number of Posts',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Featured + Grid', value: 'featured' },
      ],
    },
    {
      name: 'showLoadMore',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Load More Button',
    },
    {
      name: 'showDate',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Publish Date',
    },
    {
      name: 'showAuthor',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Author',
    },
    {
      name: 'showExcerpt',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Excerpt',
    },
  ],
}
