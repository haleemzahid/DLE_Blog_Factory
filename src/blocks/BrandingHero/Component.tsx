import React from 'react'
import { BasicRichText } from '@/components/RichText/BasicRichText'
import type { BrandingHeroBlock as BrandingHeroBlockProps } from '@/payload-types'

export const BrandingHeroBlock: React.FC<BrandingHeroBlockProps> = (props) => {
  const {
    backgroundColor,
    videoUrl,
    videoTitle,
    heading,
    headingColor,
    headingSize,
    content,
    enableCta,
    ctaLink,
    ctaButtonColor,
    ctaTextColor,
  } = props

  const getHeadingClass = () => {
    switch (headingSize) {
      case 'small':
        return 'text-2xl md:text-3xl'
      case 'medium':
        return 'text-3xl md:text-4xl'
      case 'large':
        return 'text-4xl md:text-5xl'
      case 'xlarge':
        return 'text-5xl md:text-6xl'
      default:
        return 'text-4xl md:text-5xl'
    }
  }

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

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Video */}
          {videoUrl && (
            <div className="mb-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={getEmbedUrl(videoUrl)}
                  title={videoTitle || 'Video'}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Heading */}
          <h2
            className={`${getHeadingClass()} font-bold mb-6`}
            style={{
              color: headingColor || '#000000',
              fontFamily: "'Roboto Slab', serif",
            }}
          >
            {heading}
          </h2>

          {/* Optional Content */}
          {content && (
            <div className="mb-8">
              <BasicRichText
                className="prose prose-lg max-w-none mx-auto [&_p]:text-gray-700 [&_p]:leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
                data={content}
                enableGutter={false}
              />
            </div>
          )}

          {/* CTA Button */}
          {enableCta && ctaLink && (
            <div className="mt-8">
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
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 font-semibold text-lg transition-opacity hover:opacity-90"
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
      </div>
    </section>
  )
}
