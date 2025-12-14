import React from 'react'
import type { Agent } from '@/payload-types'
import { Media } from '@/components/Media'
import Link from 'next/link'

type Props = {
  agent: Agent
}

export const AgentHero: React.FC<Props> = ({ agent }) => {
  return (
    <section className="relative min-h-[60vh] flex items-center">
      {/* Background Image */}
      {agent.heroImage && typeof agent.heroImage === 'object' && (
        <div className="absolute inset-0 z-0">
          <Media
            resource={agent.heroImage}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-white">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Agent Photo */}
          {agent.profilePhoto && typeof agent.profilePhoto === 'object' && (
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
              <Media
                resource={agent.profilePhoto}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="text-center md:text-left">
            {/* DRE License */}
            {agent.dreLicense && (
              <p className="text-white/80 text-sm mb-2">
                {agent.dreLicense}
              </p>
            )}
            
            {/* Tagline */}
            {agent.tagline && (
              <p className="text-lg md:text-xl text-white/90 font-semibold mb-2 uppercase tracking-wide">
                {agent.tagline}
              </p>
            )}
            
            {/* Display Name */}
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {agent.displayName}
            </h1>
            
            {/* City and State */}
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              {agent.city}{agent.state && typeof agent.state === 'object' ? `, ${agent.state.abbreviation}` : ''}
            </p>
            
            {/* CTA Button */}
            {agent.phone && (
              <a
                href={`tel:${agent.phone}`}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
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
              <Media
                resource={agent.logo}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
