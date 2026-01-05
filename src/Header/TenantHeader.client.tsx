'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Menu, X, Search } from 'lucide-react'

import type { TenantHeader, Tenant } from '@/payload-types'
import { resolveNavLink } from '@/utilities/tenantNavigationHelpers'

interface TenantHeaderClientProps {
  tenantHeader: TenantHeader
  tenant: Tenant
  logo: { url: string; alt: string } | null
}

export const TenantHeaderClient: React.FC<TenantHeaderClientProps> = ({
  tenantHeader,
  tenant,
  logo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = tenantHeader.navItems || []
  const ctaButton = tenantHeader.ctaButton
  const showSearch = tenantHeader.showSearch
  const isSticky = tenantHeader.sticky
  const isTransparent = tenantHeader.transparent

  // Get tenant name for fallback
  const tenantName =
    tenant.name || (tenant.seoDefaults as { siteName?: string })?.siteName || 'Agent Site'

  return (
    <header
      className={`${isSticky ? 'sticky top-0' : 'relative'} z-20 bg-white shadow-sm ${isTransparent ? 'lg:bg-transparent lg:shadow-none' : ''}`}
    >
      <div className="container py-4 md:py-5 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group transition-transform duration-300 hover:scale-105">
          {logo ? (
            <img
              src={logo.url}
              alt={logo.alt}
              className="h-10 md:h-12 w-auto object-contain"
              loading="eager"
            />
          ) : (
            <span className="text-xl font-bold text-gray-900">{tenantName}</span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item, index) => {
            const href = resolveNavLink(item)
            const isActive = pathname === href

            return (
              <Link
                key={index}
                href={href}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : item.highlight
                      ? 'text-blue-600 hover:text-blue-700'
                      : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          {/* Search Icon */}
          {showSearch && (
            <button
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* CTA Button */}
          {ctaButton?.show && ctaButton.text && (
            <Link
              href={resolveNavLink(ctaButton)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                ctaButton.style === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {ctaButton.text}
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <nav className="container py-4 flex flex-col gap-4">
            {navItems.map((item, index) => {
              const href = resolveNavLink(item)
              const isActive = pathname === href

              return (
                <Link
                  key={index}
                  href={href}
                  target={item.newTab ? '_blank' : undefined}
                  rel={item.newTab ? 'noopener noreferrer' : undefined}
                  className={`text-base font-medium py-2 transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : item.highlight
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* Mobile CTA Button */}
            {ctaButton?.show && ctaButton.text && (
              <Link
                href={resolveNavLink(ctaButton)}
                className={`px-4 py-3 rounded-md text-center font-semibold transition-colors ${
                  ctaButton.style === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {ctaButton.text}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
