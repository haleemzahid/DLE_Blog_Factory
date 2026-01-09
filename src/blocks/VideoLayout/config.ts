import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const VideoLayout: Block = {
  slug: 'videoLayout',
  interfaceName: 'VideoLayoutBlock',
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      required: true,
      admin: {
        description: 'Enter YouTube, Vimeo, or direct video URL',
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
        required: false,
        admin: {
          description: 'Add up to 2 optional buttons below the video',
        },
      },
    }),
  ],
  labels: {
    plural: 'Video Layouts',
    singular: 'Video Layout',
  },
}
