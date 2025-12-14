import type { Block } from 'payload'

export const VideoEmbed: Block = {
  slug: 'videoEmbed',
  interfaceName: 'VideoEmbedBlock',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      required: true,
      admin: {
        description: 'YouTube or Vimeo URL (e.g., https://www.youtube.com/watch?v=xxxxx)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Video Title',
      admin: {
        description: 'Optional title displayed above the video',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Aspect Ratio',
      defaultValue: '16:9',
      options: [
        { label: '16:9 (Widescreen)', value: '16:9' },
        { label: '4:3 (Standard)', value: '4:3' },
        { label: '1:1 (Square)', value: '1:1' },
      ],
    },
    {
      name: 'maxWidth',
      type: 'select',
      label: 'Maximum Width',
      defaultValue: 'large',
      options: [
        { label: 'Small (640px)', value: 'small' },
        { label: 'Medium (800px)', value: 'medium' },
        { label: 'Large (1024px)', value: 'large' },
        { label: 'Full Width', value: 'full' },
      ],
    },
  ],
}
