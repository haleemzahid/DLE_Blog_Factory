'use client'

import React, { useState } from 'react'

import type { Header as HeaderType, Designation, State } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, ChevronDown, ChevronRight } from 'lucide-react'

interface DropdownMenuProps {
  label: string
  items: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false)
        setActiveSubmenu(null)
      }}
    >
      <button
        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-[70vh] overflow-y-auto">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => item.children && item.children.length > 0 && setActiveSubmenu(item.label)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <Link
                href={item.href}
                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {item.label}
                {item.children && item.children.length > 0 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Link>
              
              {/* Submenu */}
              {item.children && item.children.length > 0 && activeSubmenu === item.label && (
                <div className="absolute left-full top-0 ml-1 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {item.children.map((child, j) => (
                    <Link
                      key={j}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
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
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ 
  data, 
  designations = [],
  childDesignations = [],
  states = [],
}) => {
  const navItems = data?.navItems || []

  // Build designation dropdown items with nested children
  const designationDropdownItems = designations.map((designation) => {
    // Find children of this designation
    const children = childDesignations
      .filter((child) => {
        const parentId = typeof child.parentDesignation === 'object' 
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

  // Build states dropdown items grouped by region
  const stateDropdownItems = states.map((state) => ({
    label: state.name,
    href: `/networks/${state.slug}`,
  }))

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map((item, i) => {
        // Handle dropdown type
        if (item.type === 'dropdown') {
          let dropdownItems: DropdownMenuProps['items'] = []
          
          // Add manual dropdown items
          if (item.dropdownItems && item.dropdownItems.length > 0) {
            dropdownItems = item.dropdownItems.map((di) => {
              const href = di.link?.type === 'custom' 
                ? di.link?.url || '#'
                : di.link?.reference && typeof di.link.reference.value === 'object'
                  ? `/${(di.link.reference.value as { slug: string }).slug}`
                  : '#'
              return {
                label: di.label,
                href,
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
            return (
              <DropdownMenu
                key={i}
                label={item.label}
                items={dropdownItems}
              />
            )
          }
        }
        
        // Handle single link type
        return (
          <CMSLink 
            key={i} 
            {...item.link} 
            appearance="link"
          >
            {item.label}
          </CMSLink>
        )
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
