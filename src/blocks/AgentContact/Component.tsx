'use client'

import React, { useState } from 'react'
import type { AgentContactBlock as AgentContactBlockType, Agent } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = AgentContactBlockType & {
  id?: string
  resolvedAgent?: Agent
}

const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => {
  const icons: Record<string, React.ReactElement> = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path
          d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
        <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="white" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
    pinterest: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
    googleMaps: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  }

  return icons[platform] || null
}

export const AgentContactBlock: React.FC<Props> = ({
  title,
  showBio = true,
  showPhoto = true,
  showSocialLinks = true,
  showWorkingHours = true,
  showContactForm = true,
  layout = 'twoColumn',
  backgroundColor = 'white',
  resolvedAgent,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  if (!resolvedAgent) {
    return null
  }

  const agent = resolvedAgent

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setFormData({ name: '', email: '', message: '' })
    setSubmitting(false)
    alert('Message sent successfully!')
  }

  const bgClass = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }[backgroundColor || 'white']

  const socialLinks = agent.socialLinks

  return (
    <section className={`py-6 ${bgClass}`}>
      <div className="container mx-auto px-4">
        {title && (
          <h2
            className={`text-3xl md:text-4xl font-bold mb-12 text-center ${backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </h2>
        )}

        <div
          className={`
          ${layout === 'twoColumn' ? 'grid md:grid-cols-2 gap-12' : ''}
          ${layout === 'sidebar' ? 'flex flex-col md:flex-row gap-8' : ''}
          ${layout === 'fullWidth' ? 'max-w-4xl mx-auto' : ''}
        `}
        >
          {/* Agent Info */}
          <div className={layout === 'sidebar' ? 'md:w-1/3' : ''}>
            {showPhoto && agent.profilePhoto && typeof agent.profilePhoto === 'object' && (
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 mx-auto md:mx-0">
                <Media resource={agent.profilePhoto} className="w-full h-full object-cover" />
              </div>
            )}

            <h3 className="text-xl font-bold mb-2">{agent.displayName}</h3>

            {agent.dreLicense && (
              <p
                className={`text-sm mb-4 ${backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {agent.dreLicense}
              </p>
            )}

            {showBio && agent.shortBio && (
              <p
                className={`mb-6 ${backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {agent.shortBio}
              </p>
            )}

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              {agent.address?.street && (
                <p className={backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  📍 {agent.address.street}, {agent.address.city}, {agent.address.state}{' '}
                  {agent.address.zip}
                </p>
              )}
              {agent.phone && (
                <p>
                  <a href={`tel:${agent.phone}`} className="text-blue-600 hover:text-blue-800">
                    📞 {agent.phone}
                  </a>
                </p>
              )}
              {agent.email && (
                <p>
                  <a href={`mailto:${agent.email}`} className="text-blue-600 hover:text-blue-800">
                    ✉️ {agent.email}
                  </a>
                </p>
              )}
            </div>

            {/* Working Hours */}
            {showWorkingHours && agent.workingHours && agent.workingHours.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Working Hours</h4>
                <ul
                  className={`text-sm space-y-1 ${backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {agent.workingHours.map((wh, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="capitalize">{wh.day}:</span>
                      <span>{wh.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Links */}
            {showSocialLinks && socialLinks && (
              <div className="flex gap-3">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  if (!url || platform === 'id') return null
                  return (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full transition-colors ${
                        backgroundColor === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <SocialIcon platform={platform} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Contact Form */}
          {showContactForm && (
            <div className={layout === 'sidebar' ? 'md:w-2/3' : ''}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${backgroundColor === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${backgroundColor === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${backgroundColor === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    Your Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send a Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
