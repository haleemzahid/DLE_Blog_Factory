'use client'

import Link from 'next/link'
import React from 'react'
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react'

import type { TenantFooter, Tenant } from '@/payload-types'
import { resolveNavLink, formatCopyrightText } from '@/utilities/tenantNavigationHelpers'

// Custom Pinterest icon
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
)

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
)

// Twitter/X icon
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

interface TenantFooterClientProps {
  tenantFooter: TenantFooter
  tenant: Tenant
}

export const TenantFooterClient: React.FC<TenantFooterClientProps> = ({
  tenantFooter,
  tenant,
}) => {
  const columns = tenantFooter.columns || []
  const socialLinks = tenantFooter.socialLinks || {}
  const contactInfo = tenantFooter.contactInfo || {}
  const legalLinks = tenantFooter.legalLinks || []
  const copyrightText = formatCopyrightText(tenantFooter.copyrightText ?? undefined, tenant)
  const showDleBadge = tenantFooter.showDleBadge

  // Get tenant logo
  const logo =
    (tenant.branding as { logo?: { url?: string; alt?: string } })?.logo?.url || null

  // Social media icons mapping
  const socialIconMap: Record<
    string,
    { icon: React.ComponentType<{ className?: string }>; label: string }
  > = {
    facebook: { icon: Facebook, label: 'Facebook' },
    instagram: { icon: Instagram, label: 'Instagram' },
    linkedin: { icon: Linkedin, label: 'LinkedIn' },
    youtube: { icon: Youtube, label: 'YouTube' },
    twitter: { icon: TwitterIcon, label: 'Twitter/X' },
    pinterest: { icon: PinterestIcon, label: 'Pinterest' },
    tiktok: { icon: TikTokIcon, label: 'TikTok' },
  }

  const activeSocialLinks = Object.entries(socialLinks)
    .filter(([_, url]) => url)
    .map(([platform, url]) => ({
      platform,
      url: url as string,
      ...socialIconMap[platform],
    }))

  return (
    <footer className="mt-auto bg-gray-900 text-white">
      <div className="container py-12">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(columns.length + 2, 4)} gap-8 mb-8`}
        >
          {/* Logo and Description */}
          <div>
            {logo ? (
              <img
                src={logo}
                alt={tenant.name || 'Logo'}
                className="h-12 w-auto object-contain mb-4"
              />
            ) : (
              <h3 className="text-xl font-bold mb-4">{tenant.name}</h3>
            )}
            {showDleBadge && (
              <p className="text-gray-400 text-sm">
                Powered by <strong>Designated Local Expert</strong>
              </p>
            )}
          </div>

          {/* Dynamic Columns */}
          {columns.map((column, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{column.title}</h4>
              {column.links && column.links.length > 0 && (
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => {
                    const href = resolveNavLink(link)
                    return (
                      <li key={linkIndex}>
                        <Link
                          href={href}
                          target={link.newTab ? '_blank' : undefined}
                          rel={link.newTab ? 'noopener noreferrer' : undefined}
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}

          {/* Contact Info */}
          {(contactInfo.phone || contactInfo.email || contactInfo.address) && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                {contactInfo.phone && (
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </li>
                )}
                {contactInfo.email && (
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </li>
                )}
                {contactInfo.address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-400">{contactInfo.address}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Social Links */}
          {activeSocialLinks.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {activeSocialLinks.map(({ platform, url, icon: Icon, label }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Legal Links and Copyright */}
        <div className="border-t border-gray-800 pt-8">
          {/* Legal Links */}
          {legalLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
              {legalLinks.map((link, index) => {
                const href = resolveNavLink(link)
                return (
                  <React.Fragment key={index}>
                    <Link
                      href={href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                    {index < legalLinks.length - 1 && (
                      <span className="text-gray-600">|</span>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          )}

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>{copyrightText}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
