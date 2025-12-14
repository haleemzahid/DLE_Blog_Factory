import React from 'react'

interface VideoEmbedBlockProps {
  videoUrl?: string | null
  title?: string | null
  aspectRatio?: '16:9' | '4:3' | '1:1' | null
  maxWidth?: 'small' | 'medium' | 'large' | 'full' | null
  blockType: 'videoEmbed'
  blockName?: string | null
}

function getVideoEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  return null
}

export const VideoEmbedBlock: React.FC<VideoEmbedBlockProps> = ({
  videoUrl,
  title,
  aspectRatio = '16:9',
  maxWidth = 'large',
}) => {
  if (!videoUrl) return null
  
  const embedUrl = getVideoEmbedUrl(videoUrl)
  if (!embedUrl) return null

  const maxWidthClass = {
    small: 'max-w-xl',
    medium: 'max-w-3xl',
    large: 'max-w-5xl',
    full: 'max-w-full',
  }[maxWidth || 'large']

  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  }[aspectRatio || '16:9']

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900">
      <div className={`container mx-auto px-4 ${maxWidthClass}`}>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {title}
          </h2>
        )}
        <div className={`relative ${aspectRatioClass} rounded-xl overflow-hidden shadow-2xl`}>
          <iframe
            src={embedUrl}
            title={title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}
