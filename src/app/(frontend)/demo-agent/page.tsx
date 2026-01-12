import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { Agent } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const metadata: Metadata = {
  title: 'Agent Demo Page',
  description: 'Demo page showing agent template with real data',
}

export default async function DemoAgentPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch the first published agent from the database
  const result = await payload.find({
    collection: 'agents',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 1,
  })

  const agent = result.docs?.[0] || null

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Agent Found</h1>
          <p className="text-gray-600">Please create an agent in the admin panel first.</p>
        </div>
      </div>
    )
  }

  return (
    <article className="pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center">
        {/* Background Image */}
        {agent.heroImage && typeof agent.heroImage === 'object' && (
          <div className="absolute inset-0 z-0">
            <Media resource={agent.heroImage} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        {/* Fallback gradient if no hero image */}
        {!agent.heroImage && (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            }}
          />
        )}

        <div className="relative z-10 container mx-auto px-4 py-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Agent Photo */}
            {agent.profilePhoto && typeof agent.profilePhoto === 'object' ? (
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
                <Media resource={agent.profilePhoto} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl flex-shrink-0 bg-gray-300">
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-600">
                  {agent.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
              </div>
            )}

            <div className="text-center md:text-left">
              {/* DRE License */}
              {agent.dreLicense && (
                <p className="text-white/80 text-sm mb-2">{agent.dreLicense}</p>
              )}

              {/* Tagline */}
              {agent.tagline && (
                <p className="text-lg md:text-xl text-white/90 font-semibold mb-2 uppercase tracking-wide">
                  {agent.tagline}
                </p>
              )}

              {/* Display Name */}
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{agent.displayName}</h1>

              {/* City and State */}
              <p className="text-xl md:text-2xl text-white/90 mb-6">
                {agent.city}
                {agent.state && typeof agent.state === 'object'
                  ? `, ${agent.state.abbreviation}`
                  : ''}
              </p>

              {/* CTA Button */}
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="inline-block bg-red-600 hover:bg-black text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
                >
                  Call Me Today: {agent.phone}
                </a>
              )}
            </div>
          </div>

          {/* Logo */}
          {agent.logo && typeof agent.logo === 'object' && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0">
              <div className="w-24 h-24 md:w-32 md:h-32">
                <Media resource={agent.logo} className="w-full h-full object-contain" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Home Value Form */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What&apos;s My Home Worth?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get instant access to all the homes that sold in your neighborhood from{' '}
            {agent.displayName}&apos;s Exclusive Real Estate Network.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Enter Your Home Address"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-colors">
              CONTINUE
            </button>
          </div>
        </div>
      </section>

      {/* Agent Profile/Bio */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Bio Section */}
            <div>
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">
                About
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Realtor in {agent.city}
              </h2>

              {agent.bio && (
                <div className="prose prose-lg max-w-none text-gray-600">
                  <RichText data={agent.bio} />
                </div>
              )}

              {/* Certifications */}
              {agent.certifications && agent.certifications.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Certifications</h3>
                  <ul className="space-y-2">
                    {agent.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <span className="text-green-500">✓</span>
                        {cert.title}
                        {cert.abbreviation && (
                          <span className="text-gray-400">({cert.abbreviation})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Experience */}
              {agent.experience && (
                <div className="mt-6">
                  <p className="text-gray-600">
                    <span className="text-green-500">✓</span> Over {agent.experience} years of
                    full-time experience
                  </p>
                </div>
              )}

              {/* Home Value Button */}
              {agent.homeValueWidgetUrl && (
                <div className="mt-8">
                  <a
                    href={agent.homeValueWidgetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Your Instant Home Value
                  </a>
                </div>
              )}
            </div>

            {/* Image/Logo Section */}
            <div className="flex flex-col items-center gap-8">
              {agent.profilePhoto && typeof agent.profilePhoto === 'object' && (
                <div className="w-full max-w-md">
                  <Media resource={agent.profilePhoto} className="w-full rounded-lg shadow-lg" />
                </div>
              )}

              {/* Brokerage Logo */}
              {agent.brokerage?.logo && typeof agent.brokerage.logo === 'object' && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2 text-center">
                    {agent.brokerage.name || 'Brokerage'}
                  </p>
                  <div className="w-48">
                    <Media resource={agent.brokerage.logo} className="w-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Commented out until testimonials field is added to Agent type
      {agent.testimonials && agent.testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">
                Client Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                What People Say About {agent.displayName}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {agent.testimonials.slice(0, 6).map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  {testimonial.rating && (
                    <div className="flex items-center gap-1 mb-4">
                      <span className="text-yellow-400">
                        {'★'.repeat(testimonial.rating)}
                        {'☆'.repeat(5 - testimonial.rating)}
                      </span>
                    </div>
                  )}
                  {testimonial.content && (
                    <p className="text-gray-600 mb-4">{testimonial.content}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {testimonial.clientName
                          ? testimonial.clientName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                          : '?'}
                      </span>
                    </div>
                    <div>
                      {testimonial.clientName && (
                        <p className="font-semibold text-gray-900">{testimonial.clientName}</p>
                      )}
                      {testimonial.clientLocation && (
                        <p className="text-sm text-gray-500">{testimonial.clientLocation}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      */}

      {/* Services - Commented out until proper rich text rendering is implemented
      {agent.services && agent.services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              {agent.displayName} Services
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {agent.services.map((service, index) => (
                <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    {service.description && (
                      <p className="text-gray-600">{service.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      */}

      {/* Gallery */}
      {agent.gallery && agent.gallery.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              {agent.displayName} Gallery
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {agent.gallery.map((item, index) => (
                <div key={index} className="aspect-square bg-gray-300 rounded-lg overflow-hidden">
                  {item.image && typeof item.image === 'object' && (
                    <Media resource={item.image} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs - Commented out until proper rich text rendering is implemented
      {agent.faqs && agent.faqs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              {agent.displayName} FAQs
            </h2>

            <div className="space-y-4">
              {agent.faqs.map((faq, index) => (
                <details key={index} className="border border-gray-200 rounded-lg">
                  <summary className="cursor-pointer p-6 text-left hover:bg-gray-50 transition-colors font-semibold text-gray-900">
                    {faq.question}
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
      */}

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Contact {agent.displayName}
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              {agent.phone && (
                <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
                  <div className="text-3xl">📞</div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href={`tel:${agent.phone}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {agent.phone}
                    </a>
                  </div>
                </div>
              )}

              {agent.email && (
                <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${agent.email}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {agent.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow">
                <div className="text-3xl">📍</div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {agent.city}
                    {agent.state && typeof agent.state === 'object'
                      ? `, ${agent.state.abbreviation}`
                      : ''}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              {agent.socialLinks && (
                <div className="p-6 bg-white rounded-lg shadow">
                  <p className="text-sm text-gray-500 mb-4">Connect on Social Media</p>
                  <div className="flex gap-4">
                    {agent.socialLinks.facebook && (
                      <a
                        href={agent.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"
                      >
                        f
                      </a>
                    )}
                    {agent.socialLinks.instagram && (
                      <a
                        href={agent.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white"
                      >
                        📷
                      </a>
                    )}
                    {agent.socialLinks.linkedin && (
                      <a
                        href={agent.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800"
                      >
                        in
                      </a>
                    )}
                    {agent.socialLinks.youtube && (
                      <a
                        href={agent.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700"
                      >
                        ▶
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="How can I help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{agent.displayName}</h3>
            <p className="text-gray-400">
              {agent.name} - Your Designated Local Expert
            </p>
            {agent.dreLicense && (
              <p className="text-gray-400 text-sm mt-2">{agent.dreLicense}</p>
            )}
          </div>
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400 text-sm">
              © 2026 Designated Local Expert. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </article>
  )
}
