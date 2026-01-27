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
        return 'text-3xl md:text-5xl lg:text-6xl'
      case 'xlarge':
        return 'text-4xl md:text-6xl lg:text-7xl'
      default:
        return 'text-3xl md:text-5xl lg:text-6xl'
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
    <section className="py-12 md:py-[50px]" style={{ backgroundColor: backgroundColor || '#1E699B' }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column - Text Content */}
          <div className="text-left order-2 md:order-1">
            {/* Heading */}
            <h2
              className={`${getHeadingClass()} font-semibold mb-6 tracking-wide leading-tight`}
              style={{
                color: headingColor || '#ffffff',
                fontFamily: "'Roboto Slab', serif",
                fontWeight: 600,
                lineHeight: '1.2',
              }}
            >
              {heading}
            </h2>

            {/* Optional Content */}
            {content && (
              <div className="mb-0">
                <BasicRichText
                  className="prose prose-lg max-w-none [&_p]:text-base [&_p]:md:text-lg [&_p]:leading-relaxed [&_p]:font-normal [&_p]:text-white [&_ul]:text-white [&_li]:text-white [&_strong]:text-white [&_strong]:font-bold"
                  style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, color: '#ffffff' }}
                  data={content}
                  enableGutter={false}
                />
              </div>
            )}
          </div>

          {/* Right Column - Video and Button */}
          <div className="order-1 md:order-2 flex flex-col gap-6">
            {/* Video */}
            {videoUrl && (
              <div className="relative w-full shadow-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={getEmbedUrl(videoUrl)}
                  title={videoTitle || 'Video'}
                  className="absolute top-0 left-0 w-full h-full rounded-[10px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* CTA Button - Below Video in Right Column */}
            {enableCta && ctaLink && (
              <div className="text-center">
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
                  className="inline-flex items-center justify-center rounded-[10px] px-8 py-3 font-bold text-base md:text-lg transition-all hover:opacity-90 shadow-md"
                  style={{
                    backgroundColor: ctaButtonColor || '#ffffff',
                    color: ctaTextColor || '#000000',
                    border: '2px solid #ffffff',
                  }}
                >
                  {ctaLink.label}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
