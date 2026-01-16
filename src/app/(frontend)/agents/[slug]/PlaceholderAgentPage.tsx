import React from 'react'
import Link from 'next/link'
import { AgentBlogBlock } from '@/blocks/AgentBlog/Component'
import { HomeValueFormBlock } from '@/blocks/HomeValueForm/Component'
import type { Media } from '@/payload-types'

type Props = {
  designationName: string
  city: string
  state: string
  slug: string
  networkLogo?: Media | null
}

export const PlaceholderAgentPage: React.FC<Props> = async ({ designationName, city, state, slug, networkLogo }) => {
  return (
    <article className="pb-0">
      {/* Hero Section with Image */}
      <section className="relative bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">{designationName}</h1>
            <p className="text-xl md:text-2xl text-gray-700">{city} Approved Local Area Expert</p>
          </div>

          {/* Home Image */}
          <div className="flex justify-center mb-8">
            <img
              src="https://designatedlocalexpert.com/wp-content/uploads/al_opt_content/IMAGE/designatedlocalexpert.com/wp-content/uploads/2020/09/home.png.bv.webp?bv_host=designatedlocalexpert.com"
              alt="Home"
              className="max-w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      </section>

      {/* Home Value Form */}
      <HomeValueFormBlock
        title="What's My Home Worth?"
        description={`Get instant access to all the homes that sold in your neighborhood from ${designationName}'s Exclusive Real Estate Network.`}
        inputPlaceholder="Enter Your Home Address"
        buttonText="CONTINUE"
        widgetUrl={undefined}
        style="centered"
        blockType="homeValueForm"
      />

      {/* About Section */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              About {designationName}
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="text-lg">
                Welcome to {designationName}. As part of the Designated Local Expert network, we
                represent premier real estate professionals serving {city}, {state}.
              </p>

              <p>
                Our Designated Local Experts are carefully selected to provide exceptional service
                to home buyers and sellers. Each designation represents a commitment to excellence,
                deep local market expertise, and personalized client care.
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Why Choose a {city} Expert?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                      <span>Deep knowledge of {city} neighborhoods and market trends</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                      <span>Proven track record in {city} real estate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                      <span>Personalized service tailored to your goals</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                      <span>Access to exclusive listings and networks</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Services</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">For Buyers:</h4>
                      <p className="text-sm text-gray-600">
                        Property search, market analysis, negotiation strategy, and closing
                        coordination
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">For Sellers:</h4>
                      <p className="text-sm text-gray-600">
                        Home valuation, professional marketing, buyer qualification, and transaction
                        management
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 p-6 rounded-r-lg my-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Interested in This Designation?
                </h3>
                <p className="text-gray-700 mb-4">
                  The {designationName} designation is currently available for qualified real estate
                  professionals. Join our network and grow your business with proven marketing and
                  lead generation.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Learn More About This Opportunity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section - Network-wide posts only */}
      <AgentBlogBlock
        title={`${city} Real Estate Insights`}
        agent={networkLogo ? { logo: networkLogo } as any : null}
        overrideAgentSlug={slug}
        limit={9}
        layout="grid"
        enablePagination={true}
        showDate={true}
        showAuthor={true}
        showExcerpt={true}
        blockType="agentBlog"
      />
    </article>
  )
}
