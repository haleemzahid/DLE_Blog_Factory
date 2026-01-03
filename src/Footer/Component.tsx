import { getCachedGlobal } from '@/utilities/getGlobals'
import {
  getTenantFooter,
  getSocialLinks,
  formatCopyrightText,
  getContactInfo,
  resolveNavLink,
} from '@/utilities/getTenantNavigation'
import Link from 'next/link'
import React from 'react'
import { Facebook, Instagram, Linkedin, Youtube, Users, Phone, Mail, MapPin } from 'lucide-react'

import type { Footer as FooterType, Tenant } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ScrollToTopButton } from './ScrollToTop'

// Custom Pinterest icon since lucide doesn't have one
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

interface FooterProps {
  tenant?: Tenant | null
}

export async function Footer({ tenant }: FooterProps) {
  // Check if tenant has a custom footer
  const tenantFooter = tenant?.id ? await getTenantFooter(String(tenant.id)) : null

  // If tenant has custom footer and is an agent site, render tenant-specific footer
  if (tenantFooter && tenant?.type === 'agent') {
    return <TenantFooter tenantFooter={tenantFooter} tenant={tenant} />
  }

  // Otherwise, render default main site footer
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType

  const legalLinks = footerData?.legalLinks || []
  const socialLinks = footerData?.socialLinks
  const copyrightText = footerData?.copyrightText || 'Designated Local Expert Network'
  const disclaimer = footerData?.disclaimer
  const disclaimerPhone = footerData?.disclaimerPhone
  const currentYear = new Date().getFullYear()

  const socialIcons = [
    { url: socialLinks?.facebook, icon: Facebook, label: 'Facebook' },
    { url: socialLinks?.instagram, icon: Instagram, label: 'Instagram' },
    { url: socialLinks?.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: socialLinks?.youtube, icon: Youtube, label: 'YouTube' },
    { url: socialLinks?.pinterest, icon: PinterestIcon, label: 'Pinterest' },
    { url: socialLinks?.twitter, icon: Users, label: 'Community' },
  ].filter((social) => social.url)

  return (
    <footer className="mt-auto bg-[#0a1628] text-white font-sans">
      <div className="container py-6">
        {/* Top Section: Logo + Copyright on left, Legal Links on right */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
          {/* Left: Logo and Copyright */}
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" className="mb-4">
              <img
                src="https://designatedlocalexpert.com/wp-content/uploads/2022/07/DleImg.png"
                alt="Designated Local Expert Logo"
                width={150}
                height={150}
                loading="lazy"
                decoding="async"
                className="object-contain w-[120px] h-[120px]"
              />
            </Link>
            <p className="text-white text-[15px] text-center lg:text-left leading-relaxed">
              Copyright &copy; {currentYear} {copyrightText},<br />
              All rights reserved
            </p>
          </div>

          {/* Right: Legal Links - vertically centered */}
          {legalLinks.length > 0 && (
            <div className="flex flex-wrap justify-center text-center lg:justify-center items-center gap-x-2 gap-y-1 text-[15px] max-w-2xl lg:flex-1">
              {legalLinks.map((item, i) => (
                <React.Fragment key={i}>
                  {item.link ? (
                    <CMSLink
                      {...item.link}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {item.label}
                    </CMSLink>
                  ) : (
                    <span className="text-white">{item.label}</span>
                  )}
                  {i < legalLinks.length - 1 && <span className="text-white">|</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Social Icons - Left aligned on desktop */}
        {socialIcons.length > 0 && (
          <div className="flex justify-center lg:justify-start gap-3 mb-8">
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
          <div className="text-center lg:text-left text-[15px]">
            <p className="text-white leading-relaxed">
              <span className="font-semibold">Disclaimer:</span>{' '}
              <span className="text-gray-300">{disclaimer}</span>
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

// Tenant-specific footer component
import type { TenantFooter as TenantFooterType } from '@/payload-types'

interface TenantFooterProps {
  tenantFooter: TenantFooterType
  tenant: Tenant
}

function TenantFooter({ tenantFooter, tenant }: TenantFooterProps) {
  const columns = tenantFooter.columns || []
  const socialLinks = getSocialLinks(tenantFooter)
  const contactInfo = getContactInfo(tenantFooter)
  const legalLinks = tenantFooter.legalLinks || []
  const copyrightText = formatCopyrightText(tenantFooter.copyrightText || undefined)
  const showDleBadge = tenantFooter.showDleBadge !== false
  const tenantName =
    tenant.name || (tenant.seoDefaults as { siteName?: string })?.siteName || 'Agent Site'

  // Map social platform to icon
  const getSocialIcon = (icon: string) => {
    switch (icon) {
      case 'facebook':
        return Facebook
      case 'instagram':
        return Instagram
      case 'linkedin':
        return Linkedin
      case 'youtube':
        return Youtube
      case 'pinterest':
        return PinterestIcon
      case 'tiktok':
        return TikTokIcon
      default:
        return Users
    }
  }

  return (
    <footer className="mt-auto bg-[#0a1628] text-white font-sans">
      <div className="container py-10">
        {/* Footer Columns */}
        {columns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {columns.map((column, colIndex) => (
              <div key={colIndex}>
                <h4 className="text-lg font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {(column.links || []).map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={resolveNavLink(link)}
                        target={link.newTab ? '_blank' : undefined}
                        rel={link.newTab ? 'noopener noreferrer' : undefined}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Info Column (if present) */}
            {(contactInfo.phone || contactInfo.email || contactInfo.address) && (
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-3">
                  {contactInfo.phone && (
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <Link
                        href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {contactInfo.phone}
                      </Link>
                    </li>
                  )}
                  {contactInfo.email && (
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <Link
                        href={`mailto:${contactInfo.email}`}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {contactInfo.email}
                      </Link>
                    </li>
                  )}
                  {contactInfo.address && (
                    <li className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <span className="text-gray-300 whitespace-pre-line">{contactInfo.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Social Icons */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center lg:justify-start gap-3 mb-8">
            {socialLinks.map((social, i) => {
              const Icon = getSocialIcon(social.icon)
              return (
                <Link
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0a1628] hover:bg-gray-200 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              )
            })}
          </div>
        )}

        {/* Bottom Section: Copyright + Legal Links */}
        <div className="border-t border-gray-700 pt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="text-center lg:text-left">
            <p className="text-gray-300 text-sm">
              {copyrightText || `© ${new Date().getFullYear()} ${tenantName}. All rights reserved.`}
            </p>
            {showDleBadge && (
              <p className="text-gray-500 text-xs mt-1">
                Powered by{' '}
                <Link
                  href="https://designatedlocalexpert.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 transition-colors"
                >
                  Designated Local Expert
                </Link>
              </p>
            )}
          </div>

          {/* Legal Links */}
          {legalLinks.length > 0 && (
            <div className="flex flex-wrap justify-center lg:justify-end gap-x-4 gap-y-1 text-sm">
              {legalLinks.map((link, i) => (
                <Link
                  key={i}
                  href={resolveNavLink(link)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </footer>
  )
}
