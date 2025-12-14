'use client'

import React, { useState } from 'react'
import type { AgentGalleryBlock as AgentGalleryBlockType, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = AgentGalleryBlockType & {
  id?: string
  resolvedImages?: Array<{ image: MediaType; caption?: string | null }>
}

export const AgentGalleryBlock: React.FC<Props> = ({
  title,
  images,
  layout = 'grid',
  columns = '3',
  enableLightbox = true,
  resolvedImages,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const galleryImages = resolvedImages || images || []

  if (galleryImages.length === 0) {
    return null
  }

  const getGridCols = () => {
    switch (columns) {
      case '2':
        return 'grid-cols-1 sm:grid-cols-2'
      case '3':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case '4':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setCurrentIndex(index)
      setLightboxOpen(true)
    }
  }

  const closeLightbox = () => setLightboxOpen(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}
        
        <div className={`grid ${getGridCols()} gap-4`}>
          {galleryImages.map((item, index) => {
            const imageData = typeof item.image === 'object' ? item.image : null
            
            if (!imageData) return null
            
            return (
              <div
                key={imageData.id || index}
                className={`
                  relative overflow-hidden rounded-lg shadow-md
                  ${enableLightbox ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
                  ${layout === 'masonry' && index % 3 === 0 ? 'row-span-2' : ''}
                `}
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square relative">
                  <Media
                    resource={imageData}
                    fill
                    className="object-cover"
                  />
                </div>
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
                    {item.caption}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && enableLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
            aria-label="Previous image"
          >
            ‹
          </button>
          
          <div
            className="max-w-4xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages[currentIndex]?.image && typeof galleryImages[currentIndex].image === 'object' && (
              <Media
                resource={galleryImages[currentIndex].image as MediaType}
                className="max-h-[90vh] w-auto"
              />
            )}
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
            aria-label="Next image"
          >
            ›
          </button>
          
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            aria-label="Close lightbox"
          >
            ×
          </button>
        </div>
      )}
    </section>
  )
}
