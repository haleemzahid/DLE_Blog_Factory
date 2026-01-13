import React from 'react'
import Link from 'next/link'
import { AgentBlogBlock } from '@/blocks/AgentBlog/Component'

type Props = {
  designationName: string
  city: string
  state: string
}

export const PlaceholderAgentPage: React.FC<Props> = async ({ designationName, city, state }) => {
  return (
    <article className="pb-16">
      {/* Hero Section - Simplified */}
      <section className="relative min-h-[40vh] flex items-center bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="relative z-10 container mx-auto px-4 py-12 text-white">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{designationName}</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              {city}, {state}
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Your Designated Local Expert in {city}
            </p>
          </div>
        </div>
      </section>

      {/* About Section - Generic Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">
              About
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Designated Local Expert in {city}
            </h2>

            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
              <p>
                Welcome to {designationName}'s profile page. As part of the Designated Local Expert
                network, we represent the premier real estate professionals serving {city}, {state}.
              </p>

              <p>
                Our Designated Local Experts are carefully selected to provide exceptional service
                to home buyers and sellers throughout {city}. Each designation represents a
                commitment to excellence, local market expertise, and personalized client care.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Why Choose a Designated Local Expert?
              </h3>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>
                    <strong>Deep Local Knowledge:</strong> Intimate understanding of {city}'s
                    neighborhoods, schools, and market trends
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>
                    <strong>Proven Track Record:</strong> Verified success in helping clients buy
                    and sell homes in {city}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>
                    <strong>Personalized Service:</strong> One-on-one attention tailored to your
                    unique real estate goals
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>
                    <strong>Network Resources:</strong> Access to exclusive listings and buyer
                    networks throughout {state}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                  <span>
                    <strong>Professional Excellence:</strong> Commitment to ethical practices and
                    client advocacy
                  </span>
                </li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Services Offered</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">For Home Buyers</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Property Search & Selection</li>
                    <li>• Market Analysis & Pricing</li>
                    <li>• Negotiation & Offer Strategy</li>
                    <li>• Closing Coordination</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">For Home Sellers</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Home Valuation & Pricing</li>
                    <li>• Marketing & Staging</li>
                    <li>• Buyer Qualification</li>
                    <li>• Transaction Management</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Interested in Becoming {designationName}?
                </h3>
                <p className="text-gray-700 mb-4">
                  This designation is currently available for qualified real estate professionals
                  serving {city}, {state}. Join our network of Designated Local Experts and grow
                  your business with our proven marketing and lead generation platform.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Learn More About This Designation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Show all network blog posts */}
      <AgentBlogBlock
        title={`${city} Real Estate Blog`}
        agent={null}
        limit={9}
        layout="grid"
        enablePagination={true}
        showDate={true}
        showAuthor={true}
        showExcerpt={true}
        blockType="agentBlog"
      />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Work with a {city} Expert?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with {designationName} to discuss your real estate needs in {city}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/agents"
              className="inline-block bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              View All Agents
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
