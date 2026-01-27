import React from 'react'
import { BasicRichText } from '@/components/RichText/BasicRichText'
import type { BrandingHeroBlock as BrandingHeroBlockProps } from '@/payload-types'
import type { Media } from '@/payload-types'

export const BrandingHeroBlock: React.FC<BrandingHeroBlockProps> = (props) => {
  const {
    backgroundColor,
    backgroundImage,
    videoUrl,
    videoTitle,
    heading,
    headingColor,
    content,
    enableCta,
    ctaLink,
    ctaButtonColor,
    ctaTextColor,
  } = props

  const getEmbedUrl = (url: string) => {
    if (!url) return ''

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return url
  }

  const bgImage = backgroundImage && typeof backgroundImage === 'object' ? (backgroundImage as Media) : null
  const bgImageUrl = bgImage?.url || ''

  return (
    <div className="relative">
      <section
        className="py-8 md:py-12 relative"
        style={{
          backgroundColor: backgroundColor || '#1E699B',
        }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Two Column Layout: Content Left, Video Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start mb-0">
          {/* Left Column - Content */}
          <div className="text-white pr-4">
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
              style={{
                color: headingColor || '#ffffff',
                fontFamily: "'Roboto Slab', serif",
              }}
            >
              {heading}
            </h2>

            {content && (
              <BasicRichText
                className="prose prose-sm md:prose-base max-w-none [&_p]:text-white [&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_ul]:text-white [&_ul]:text-sm [&_ul]:md:text-base [&_li]:text-white [&_li]:text-sm [&_li]:md:text-base [&_strong]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
                data={content}
                enableGutter={false}
              />
            )}

            {enableCta && ctaLink && (
              <div className="mt-6">
                <a
                  href={
                    ctaLink.type === 'reference' && ctaLink.reference?.value
                      ? typeof ctaLink.reference.value === 'object'
                        ? `/${ctaLink.reference.value.slug}`
                        : ctaLink.url || '#'
                      : ctaLink.url || '#'
                  }
                  target={ctaLink.newTab ? '_blank' : undefined}
                  rel={ctaLink.newTab ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center rounded px-6 py-3 font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: ctaButtonColor || '#B40000',
                    color: ctaTextColor || '#ffffff',
                  }}
                >
                  {ctaLink.label}
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Video */}
          {videoUrl && (
            <div className="flex items-center">
              <div className="relative w-full rounded-lg overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={getEmbedUrl(videoUrl)}
                  title={videoTitle || 'Video'}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* Wave Divider */}
    <div className="relative" style={{ marginTop: '-1px' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 100"
        style={{ display: 'block', width: '100%', height: 'auto' }}
        preserveAspectRatio="none"
      >
        <path
          fill={backgroundColor || '#1E699B'}
          d="M0,50 Q360,100 720,50 T1440,50 L1440,0 L0,0 Z"
        />
      </svg>
    </div>
    </div>
  )
}
