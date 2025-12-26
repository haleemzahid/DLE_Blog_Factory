import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Designation Directory | Designated Local Expert',
  description: 'Browse our trademarked protected designation directories by state and specialty.',
}

export default async function DirectoryPage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch all states
  const states = await payload.find({
    collection: 'states',
    where: {
      country: { equals: 'usa' },
      isUnincorporated: { equals: false },
    },
    limit: 100,
    sort: 'name',
  })

  // Fetch all designations
  const designations = await payload.find({
    collection: 'designations',
    where: {
      featured: { equals: true },
    },
    limit: 50,
    sort: 'sortOrder',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Designation Directory</h1>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Apply for DLE Membership
            </Link>
            <Link
              href="/member-relations"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Inquire About Availability of Your City
            </Link>
          </div>
        </div>
      </section>

      {/* Directory Listing */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Trademarked Protected Designation Directories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-2">
            {/* States Column */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">By State</h3>
              <ul className="space-y-1">
                {states.docs.map((state) => (
                  <li key={state.id}>
                    <Link
                      href={`/${state.slug}-network`}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                    >
                      <span className="text-blue-600">▶</span>
                      {state.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Designations Columns */}
            <div className="md:col-span-3 xl:col-span-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">By Specialty</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-1">
                {designations.docs.map((designation) => (
                  <Link
                    key={designation.id}
                    href={`/designations/${designation.slug}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-1"
                  >
                    <span className="text-blue-600">▶</span>
                    {designation.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-8 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Quick Links</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <Link href="/about-us" className="hover:text-blue-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/realtor-solutions" className="hover:text-blue-600">
                    Realtor Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/apply" className="hover:text-blue-600">
                    Apply
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-blue-600">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Services</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <Link href="/our-system" className="hover:text-blue-600">
                    Our System
                  </Link>
                </li>
                <li>
                  <Link href="/google-seo-services" className="hover:text-blue-600">
                    Google SEO Services
                  </Link>
                </li>
                <li>
                  <Link href="/dove-designation" className="hover:text-blue-600">
                    Dove Designation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">International</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <Link href="/canada-network" className="hover:text-blue-600">
                    Canada Network
                  </Link>
                </li>
                <li>
                  <Link href="/uk-network" className="hover:text-blue-600">
                    UK Network
                  </Link>
                </li>
                <li>
                  <Link href="/australia-network" className="hover:text-blue-600">
                    Australia Network
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Resources</h4>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <Link href="/posts" className="hover:text-blue-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="hover:text-blue-600">
                    Meet The Team
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
