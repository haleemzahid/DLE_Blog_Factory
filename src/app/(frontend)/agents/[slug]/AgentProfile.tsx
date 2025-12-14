import React from 'react'
import type { Agent } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type Props = {
  agent: Agent
}

export const AgentProfile: React.FC<Props> = ({ agent }) => {
  return (
    <section className="py-16 bg-white">
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
                  <span className="text-green-500">✓</span> Over {agent.experience} years of full-time experience
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
                <Media
                  resource={agent.profilePhoto}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}
            
            {/* Brokerage Logo */}
            {agent.brokerage?.logo && typeof agent.brokerage.logo === 'object' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-500 mb-2 text-center">
                  {agent.brokerage.name || 'Brokerage'}
                </p>
                <div className="w-48">
                  <Media
                    resource={agent.brokerage.logo}
                    className="w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
