import React from 'react'
import { BasicRichText } from '@/components/RichText/BasicRichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

import type { AboutSectionBlock as AboutSectionBlockProps } from '@/payload-types'

// Helper function to extract video ID from YouTube/Vimeo URLs
const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null

  // YouTube formats
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  )
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo formats
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return null
}

export const AboutSectionBlock: React.FC<AboutSectionBlockProps> = (props) => {
  const {
    heading,
    headingColor,
    content,
    enableButton,
    link,
    mediaType,
    image,
    videoUrl,
    videoTitle,
    imagePosition,
    backgroundColor,
  } = props

  const embedUrl = videoUrl ? getVideoEmbedUrl(videoUrl) : null

  return (
    <section className="py-6 md:py-6" style={{ backgroundColor: backgroundColor || '#f3f4f6' }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Content Side - left */}
          <div className="lg:order-1">
            {/* Heading */}
            {heading && (
              <h2 className="text-xl md:text-2xl mb-4" style={{ color: headingColor || '#dc2626' }}>
                {heading}
              </h2>
            )}

            {/* Rich Text Content */}
            {content && (
              <BasicRichText
                className="prose prose-sm max-w-none mb-4 [&_p]:mb-1 [&_p]:text-gray-700 [&_p]:text-sm [&_p]:leading-snug [&_strong]:font-bold [&_ul]:ml-4 [&_ul]:mb-1 [&_ul]:mt-1 [&_ul]:list-none [&_li]:mb-0.5 [&_li]:text-sm [&_li]:relative [&_li]:pl-4 [&_li:before]:content-['•'] [&_li:before]:absolute [&_li:before]:left-0 [&_li:before]:text-red-600 [&_li:before]:font-bold [&_em]:italic"
                data={content}
                enableGutter={false}
              />
            )}

            {/* Button */}
            {enableButton && link && (
              <CMSLink
                {...link}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors group"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </CMSLink>
            )}
          </div>

          {/* Media Side - right */}
          <div className="lg:order-2">
            {mediaType === 'video' && embedUrl ? (
              <div className="rounded-lg overflow-hidden shadow-xl">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={embedUrl}
                    title={videoTitle || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
            ) : image && typeof image === 'object' ? (
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Media resource={image} imgClassName="w-full h-auto object-cover" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
