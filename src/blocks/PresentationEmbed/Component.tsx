import React from 'react'
import type { PresentationEmbedBlock as PresentationEmbedBlockProps } from '@/payload-types'

export const PresentationEmbedBlock: React.FC<PresentationEmbedBlockProps> = (props) => {
  const {
    backgroundColor,
    presentationUrl,
    presentationTitle,
    heading,
    headingColor,
    aspectRatio,
    downloadLink,
    downloadButtonText,
    downloadButtonColor,
    downloadButtonTextColor,
  } = props

  const getAspectRatioPadding = () => {
    switch (aspectRatio) {
      case '16:9':
        return '56.25%' // 9/16 * 100
      case '4:3':
        return '75%' // 3/4 * 100
      case '16:10':
        return '62.5%' // 10/16 * 100
      default:
        return '56.25%'
    }
  }

  return (
    <section className="py-8 md:py-12" style={{ backgroundColor: backgroundColor || '#1E699B' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Heading */}
        {heading && (
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-6"
            style={{
              color: headingColor || '#ffffff',
              fontFamily: "'Roboto Slab', serif",
            }}
          >
            {heading}
          </h2>
        )}

        {/* Presentation Container with Border */}
        {presentationUrl && (
          <div className="max-w-5xl mx-auto">
            <div className="border-4 border-red-600 rounded-lg overflow-hidden shadow-2xl">
              <div className="relative w-full" style={{ paddingBottom: getAspectRatioPadding() }}>
                <iframe
                  src={presentationUrl}
                  title={presentationTitle || 'Presentation'}
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Download Button */}
            {downloadLink && (
              <div className="text-center mt-6">
                <a
                  href={downloadLink}
                  download
                  className="inline-flex items-center justify-center rounded-md px-8 py-3 font-bold text-lg transition-all hover:opacity-90 shadow-lg"
                  style={{
                    backgroundColor: downloadButtonColor || '#dc2626',
                    color: downloadButtonTextColor || '#ffffff',
                  }}
                >
                  {downloadButtonText || 'Download Presentation'}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
