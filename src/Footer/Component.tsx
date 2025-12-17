import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
} from 'lucide-react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ScrollToTopButton } from './ScrollToTop'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer

  const legalLinks = footerData?.legalLinks || []
  const socialLinks = footerData?.socialLinks
  const copyrightText = footerData?.copyrightText || 'Designated Local Expert Network'
  const disclaimer = footerData?.disclaimer
  const disclaimerPhone = footerData?.disclaimerPhone
  const currentYear = new Date().getFullYear()

  const socialIcons = [
    { url: socialLinks?.facebook, icon: Facebook, label: 'Facebook' },
    { url: socialLinks?.twitter, icon: Twitter, label: 'Twitter' },
    { url: socialLinks?.instagram, icon: Instagram, label: 'Instagram' },
    { url: socialLinks?.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: socialLinks?.youtube, icon: Youtube, label: 'YouTube' },
    { url: socialLinks?.pinterest, icon: MapPin, label: 'Pinterest' },
  ].filter((social) => social.url)

  return (
    <footer className="mt-auto bg-[#0a1628] text-white">
      <div className="container py-12">
        {/* Legal Links */}
        {legalLinks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8 text-sm">
            {legalLinks.map((item, i) => (
              <React.Fragment key={i}>
                {item.link ? (
                  <CMSLink
                    {...item.link}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.label}
                  </CMSLink>
                ) : (
                  <span className="text-gray-300">{item.label}</span>
                )}
                {i < legalLinks.length - 1 && (
                  <span className="text-gray-500">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="text-center mb-8">
          <p className="text-gray-300 text-sm">
            Copyright &copy; {currentYear} {copyrightText}, All rights reserved
          </p>
        </div>

        {/* Social Icons */}
        {socialIcons.length > 0 && (
          <div className="flex justify-center gap-3 mb-8">
            {socialIcons.map((social, i) => (
              <Link
                key={i}
                href={social.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0a1628] hover:bg-gray-200 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        {disclaimer && (
          <div className="text-center text-sm text-gray-400 max-w-4xl mx-auto">
            <p>
              <span className="font-medium text-gray-300">Disclaimer:</span>{' '}
              {disclaimer}
              {disclaimerPhone && (
                <Link
                  href={`tel:${disclaimerPhone.replace(/\D/g, '')}`}
                  className="text-white hover:underline ml-1"
                >
                  {disclaimerPhone}
                </Link>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </footer>
  )
}
