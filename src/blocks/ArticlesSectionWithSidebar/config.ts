import type { Block } from 'payload'

export const ArticlesSectionWithSidebar: Block = {
  slug: 'articlesSidebar',
  interfaceName: 'ArticlesSidebarBlock',
  labels: {
    singular: 'Articles Section With Sidebar',
    plural: 'Articles Sections With Sidebar',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'About',
          fields: [
            {
              name: 'showAbout',
              type: 'checkbox',
              label: 'Show About Section',
              defaultValue: true,
            },
            {
              name: 'aboutTitle',
              type: 'text',
              label: 'About Title',
              defaultValue: 'About',
              admin: {
                condition: (_, siblingData) => siblingData?.showAbout,
              },
            },
            {
              name: 'aboutContent',
              type: 'richText',
              label: 'About Content',
              admin: {
                condition: (_, siblingData) => siblingData?.showAbout,
                description: 'Enter the about description text for the agent',
              },
            },
          ],
        },
        {
          label: 'Articles',
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
              defaultValue: 6,
              min: 1,
              max: 50,
            },
            {
              name: 'columns',
              type: 'select',
              label: 'Columns',
              defaultValue: '2',
              options: [
                { label: '1 Column', value: '1' },
                { label: '2 Columns', value: '2' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'showAuthor',
                  type: 'checkbox',
                  label: 'Show Author',
                  defaultValue: true,
                  admin: { width: '25%' },
                },
                {
                  name: 'showDate',
                  type: 'checkbox',
                  label: 'Show Date',
                  defaultValue: true,
                  admin: { width: '25%' },
                },
                {
                  name: 'showExcerpt',
                  type: 'checkbox',
                  label: 'Show Excerpt',
                  defaultValue: true,
                  admin: { width: '25%' },
                },
                {
                  name: 'showReadMore',
                  type: 'checkbox',
                  label: 'Show Read More',
                  defaultValue: true,
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'enablePagination',
              type: 'checkbox',
              label: 'Enable Pagination',
              defaultValue: true,
            },
            {
              name: 'postsPerPage',
              type: 'number',
              label: 'Posts Per Page',
              defaultValue: 6,
              min: 1,
              max: 20,
              admin: {
                condition: (_, siblingData) => siblingData?.enablePagination,
              },
            },
          ],
        },
        {
          label: 'Sidebar',
          fields: [
            {
              name: 'showSidebar',
              type: 'checkbox',
              label: 'Show Sidebar',
              defaultValue: true,
            },
            {
              name: 'sidebarAgent',
              type: 'relationship',
              relationTo: 'agents',
              label: 'Select Agent for Sidebar',
              admin: {
                condition: (_, siblingData) => siblingData?.showSidebar,
                description: 'Select an agent to display their contact info in the sidebar',
              },
            },
            {
              name: 'showContactInfo',
              type: 'checkbox',
              label: 'Show Contact Info',
              defaultValue: true,
              admin: {
                condition: (_, siblingData) => siblingData?.showSidebar,
              },
            },
            {
              name: 'showSocialLinks',
              type: 'checkbox',
              label: 'Show Social Links',
              defaultValue: true,
              admin: {
                condition: (_, siblingData) => siblingData?.showSidebar,
              },
            },
            {
              name: 'showFeaturedOn',
              type: 'checkbox',
              label: 'Show "Featured On" Section',
              defaultValue: true,
              admin: {
                condition: (_, siblingData) => siblingData?.showSidebar,
              },
            },
            {
              name: 'featuredOnLogos',
              type: 'array',
              label: 'Featured On Logos',
              admin: {
                condition: (_, siblingData) => siblingData?.showSidebar && siblingData?.showFeaturedOn,
              },
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'name',
                  type: 'text',
                  label: 'Company Name',
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link URL',
                },
              ],
            },
          ],
        },
        {
          label: 'Styling',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'titleColor',
                  type: 'text',
                  label: 'Title Text Color',
                  defaultValue: '#1a1a1a',
                  admin: { width: '33%' },
                },
                {
                  name: 'titleBgColor',
                  type: 'text',
                  label: 'Title Background Color',
                  defaultValue: '#fde047',
                  admin: { width: '33%' },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Accent Color (Author, Read More)',
                  defaultValue: '#dc2626',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Section Background Color',
              defaultValue: '#ffffff',
            },
          ],
        },
      ],
    },
  ],
}
