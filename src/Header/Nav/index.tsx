'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'

import type { Header as HeaderType, Designation, State } from '@/payload-types'
import { CMSLink } from '@/components/Link'

interface DropdownItem {
  label: string
  href: string
  children?: Array<{ label: string; href: string }>
}

interface DropdownMenuProps {
  label: string
  items: DropdownItem[]
  alignRight?: boolean
  isDarkTheme?: boolean
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items, alignRight = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  // Show all items in single column (no multi-column split)

  const renderMenuItem = (item: DropdownItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = activeSubmenu === item.label

    return (
      <div
        key={index}
        className="relative"
        onMouseEnter={() => hasChildren && setActiveSubmenu(item.label)}
        onMouseLeave={() => setActiveSubmenu(null)}
      >
        <Link
          href={item.href}
          className={`flex items-center justify-between px-4 py-2 text-[17px] transition-colors ${
            isActive
              ? 'bg-header-accent text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-header-accent hover:text-white'
          }`}
        >
          {item.label}
          {hasChildren && <ChevronRight className="w-4 h-4 ml-2" />}
        </Link>

        {/* Submenu - aligned to bottom of parent item */}
        {hasChildren && isActive && (
          <div
            className="absolute left-full bottom-0 ml-0 w-56 bg-white dark:bg-gray-900 z-50 rounded-xl py-2"
            style={{
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            {item.children!.map((child, j) => (
              <Link
                key={j}
                href={child.href}
                className="block px-4 py-2.5 text-[15px] text-gray-700 dark:text-gray-300 hover:bg-header-accent hover:text-white transition-all duration-200"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false)
        setActiveSubmenu(null)
      }}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 py-2 text-[15px] text-gray-800 hover:text-header-accent transition-all duration-300 font-medium group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="relative">
          {label}
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-header-accent transition-all duration-300 group-hover:w-full" />
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Invisible bridge to maintain hover */}
          <div className="absolute top-full left-0 h-2 w-full" />
          <div
            className={`absolute top-[calc(100%+0.5rem)] ${alignRight ? 'right-0' : 'left-0'} py-3 bg-white dark:bg-gray-900 z-50 rounded-xl min-w-[220px] animate-fade-in-up`}
            style={{
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <div>{items.map((item, i) => renderMenuItem(item, i))}</div>
          </div>
        </>
      )}
    </div>
  )
}

// Mobile Dropdown Component
interface MobileDropdownProps {
  label: string
  items: DropdownItem[]
  onItemClick: () => void
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({ label, items, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-left text-primary font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="bg-gray-50 dark:bg-gray-800">
          {items.map((item, i) => {
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedSubmenu === item.label

            return (
              <div key={i}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className="flex-1 px-6 py-2 text-[17px] text-gray-700 dark:text-gray-300 hover:bg-header-accent hover:text-white transition-colors"
                    onClick={onItemClick}
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      className="px-4 py-2 text-gray-500 hover:text-header-accent"
                      onClick={() => setExpandedSubmenu(isExpanded ? null : item.label)}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className="bg-gray-100 dark:bg-gray-900">
                    {item.children!.map((child, j) => (
                      <Link
                        key={j}
                        href={child.href}
                        className="block px-8 py-2 text-[17px] text-gray-600 dark:text-gray-400 hover:bg-header-accent hover:text-white transition-colors"
                        onClick={onItemClick}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface HeaderNavProps {
  data: HeaderType
  designations?: Designation[]
  childDesignations?: Designation[]
  states?: State[]
  mobileMenuOpen?: boolean
  setMobileMenuOpen?: (open: boolean) => void
  isDarkTheme?: boolean
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  data,
  designations = [],
  childDesignations = [],
  states = [],
  mobileMenuOpen = false,
  setMobileMenuOpen,
}) => {
  const navItems = data?.navItems || []

  // Build designation dropdown items with nested children
  const designationDropdownItems = designations.map((designation) => {
    const children = childDesignations
      .filter((child) => {
        const parentId =
          typeof child.parentDesignation === 'object'
            ? child.parentDesignation?.id
            : child.parentDesignation
        return parentId === designation.id
      })
      .map((child) => ({
        label: child.title,
        href: `/designations/${child.slug}`,
      }))

    return {
      label: designation.title,
      href: `/designations/${designation.slug}`,
      children,
    }
  })

  // Build states dropdown items
  const stateDropdownItems = states.map((state) => ({
    label: state.name,
    href: `/networks/${state.slug}`,
  }))

  const closeMobileMenu = () => {
    setMobileMenuOpen?.(false)
  }

  const renderNavItems = (isMobile: boolean = false) => {
    return navItems.map((item, i) => {
      // Handle dropdown type
      if (item.type === 'dropdown') {
        let dropdownItems: DropdownItem[] = []

        // Add manual dropdown items with optional sub-items
        if (item.dropdownItems && item.dropdownItems.length > 0) {
          dropdownItems = item.dropdownItems.map((di: any) => {
            const href =
              di.link?.type === 'custom'
                ? di.link?.url || '#'
                : di.link?.reference && typeof di.link.reference.value === 'object'
                  ? `/${(di.link.reference.value as { slug: string }).slug}`
                  : '#'

            // Handle sub-items if hasSubmenu is enabled
            let children: Array<{ label: string; href: string }> | undefined
            if (di.hasSubmenu && di.subItems && di.subItems.length > 0) {
              children = di.subItems.map((sub: any) => {
                const subHref =
                  sub.link?.type === 'custom'
                    ? sub.link?.url || '#'
                    : sub.link?.reference && typeof sub.link.reference.value === 'object'
                      ? `/${(sub.link.reference.value as { slug: string }).slug}`
                      : '#'
                return {
                  label: sub.label,
                  href: subHref,
                }
              })
            }

            return {
              label: di.label,
              href,
              children,
            }
          })
        }

        // Auto-include designations with nested children if flag is set
        if (item.includeDesignations && designations.length > 0) {
          dropdownItems = [...dropdownItems, ...designationDropdownItems]
        }

        // Auto-include states if flag is set
        if (item.includeStates && states.length > 0) {
          dropdownItems = [...dropdownItems, ...stateDropdownItems]
        }

        if (dropdownItems.length > 0) {
          if (isMobile) {
            return (
              <MobileDropdown
                key={i}
                label={item.label}
                items={dropdownItems}
                onItemClick={closeMobileMenu}
              />
            )
          }
          // Align right for last 2 dropdown items to prevent overflow
          const isLastItems = i >= navItems.length - 2
          return (
            <DropdownMenu
              key={i}
              label={item.label}
              items={dropdownItems}
              alignRight={isLastItems}
            />
          )
        }
      }

      // Handle single link type
      if (isMobile) {
        return (
          <div
            key={i}
            className="border-b border-gray-200 dark:border-gray-700"
            onClick={closeMobileMenu}
          >
            <CMSLink
              {...item.link}
              appearance="link"
              className="block px-4 py-3 text-primary font-medium hover:bg-header-accent hover:text-white transition-colors"
            >
              {item.label}
            </CMSLink>
          </div>
        )
      }

      return (
        <CMSLink
          key={i}
          {...item.link}
          appearance="link"
          className="relative text-[15px] text-gray-800 hover:text-header-accent transition-all duration-300 font-medium group"
        >
          <span className="relative">
            {item.label}
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-header-accent transition-all duration-300 group-hover:w-full" />
          </span>
        </CMSLink>
      )
    })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-4 items-center">
        {renderNavItems(false)}
      </nav>

      {/* Mobile Menu Toggle */}
      <button
        type="button"
        className="md:hidden p-2 text-gray-800 hover:text-header-accent transition-colors"
        onClick={() => setMobileMenuOpen?.(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[80px] bg-white dark:bg-gray-900 z-50 overflow-y-auto">
          <div className="flex flex-col">
            {renderNavItems(true)}
          </div>
        </div>
      )}
    </>
  )
}
