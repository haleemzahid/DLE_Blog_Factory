'use client'

import React from 'react'
import type { HomeValueFormBlock as HomeValueFormBlockType } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = HomeValueFormBlockType & {
  id?: string
}

export const HomeValueFormBlock: React.FC<Props> = ({
  title,
  description,
  inputPlaceholder,
  buttonText,
  widgetUrl,
  backgroundImage,
  style,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const address = formData.get('address') as string
    
    if (widgetUrl) {
      // Redirect to external widget
      window.open(widgetUrl, '_blank')
    } else {
      // Handle internal form submission
      console.log('Address submitted:', address)
    }
  }

  return (
    <section className="relative py-16 md:py-24">
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className="absolute inset-0 z-0">
          <Media
            resource={backgroundImage}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
      )}
      
      <div className={`relative z-10 container mx-auto px-4 ${style === 'centered' ? 'text-center' : ''}`}>
        <div className={`max-w-2xl ${style === 'centered' ? 'mx-auto' : ''}`}>
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          
          {description && (
            <p className="text-gray-600 mb-8 text-lg">
              {description}
            </p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="address"
              placeholder={inputPlaceholder || 'Enter Your Home Address'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              required
            />
            
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
            >
              {buttonText || 'CONTINUE'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
