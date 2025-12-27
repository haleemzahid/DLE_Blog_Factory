'use client'

import React, { useState } from 'react'

interface VideoEmbedBlockProps {
  videoUrl?: string | null
  title?: string | null
  aspectRatio?: '16:9' | '4:3' | '1:1' | null
  maxWidth?: 'small' | 'medium' | 'large' | 'full' | null
  blockType: 'videoEmbed'
  blockName?: string | null
}

function getVideoEmbedUrl(url: string): { embedUrl: string; videoId: string | null; type: 'youtube' | 'vimeo' } | null {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  )
  if (youtubeMatch) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?autoplay=1`,
      videoId: youtubeMatch[1],
      type: 'youtube',
    }
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      videoId: vimeoMatch[1],
      type: 'vimeo',
    }
  }

  return null
}

export const VideoEmbedBlock: React.FC<VideoEmbedBlockProps> = ({
  videoUrl,
  title,
  aspectRatio = '16:9',
  maxWidth = 'large',
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  if (!videoUrl) return null

  const videoData = getVideoEmbedUrl(videoUrl)
  if (!videoData) return null

  const { embedUrl, videoId, type } = videoData

  // Get thumbnail URL
  const thumbnailUrl =
    type === 'youtube' && videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : type === 'vimeo' && videoId
        ? `https://vumbnail.com/${videoId}.jpg`
        : null

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
          {!isLoaded && thumbnailUrl ? (
            <button
              onClick={() => setIsLoaded(true)}
              className="absolute inset-0 w-full h-full cursor-pointer group bg-black"
              aria-label={`Play video: ${title || 'Video'}`}
            >
              {/* Thumbnail */}
              <img
                src={thumbnailUrl}
                alt={title || 'Video thumbnail'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          ) : (
            <iframe
              src={embedUrl}
              title={title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </div>
    </section>
  )
}
