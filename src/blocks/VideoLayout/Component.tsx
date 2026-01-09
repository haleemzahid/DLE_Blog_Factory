import React from 'react'
import { cn } from '@/utilities/ui'
import type { VideoLayoutBlock as VideoLayoutProps } from '@/payload-types'
import { CMSLink } from '@/components/Link'

type Props = VideoLayoutProps & {
  className?: string
}

const getEmbedUrl = (url: string): string => {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/
  const youtubeMatch = url.match(youtubeRegex)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(\d+)/
  const vimeoMatch = url.match(vimeoRegex)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // Direct video URL or already embedded
  return url
}

export const VideoLayoutBlock: React.FC<Props> = ({ videoUrl, links, className }) => {
  if (!videoUrl) return null

  const embedUrl = getEmbedUrl(videoUrl)
  const isDirectVideo = !embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com')

  return (
    <div className={cn('container my-8', className)}>
      <div className="mx-auto max-w-4xl">
        {/* Video Container */}
        <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ paddingBottom: '56.25%' }}>
          {isDirectVideo ? (
            <video
              className="absolute inset-0 h-full w-full"
              controls
              src={embedUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Buttons */}
        {links && links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {links.map((link, index) => (
              <CMSLink
                key={index}
                {...link.link}
                appearance={link.link.appearance}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
