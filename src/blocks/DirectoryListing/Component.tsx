import React from 'react'
import type {
  DirectoryListingBlock as DirectoryListingBlockType,
  Agent,
  State,
  Designation,
} from '@/payload-types'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Props = DirectoryListingBlockType & {
  id?: string
}

export const DirectoryListingBlock: React.FC<Props> = async ({
  title,
  listingType = 'agents',
  filterByState,
  filterByDesignation,
  filterByCountry,
  layout = 'multiColumn',
  columns = '4',
  showApplyButton = true,
  showInquireButton = true,
  applyButtonUrl = '/apply',
  inquireButtonUrl = '/member-relations',
}) => {
  const payload = await getPayload({ config: configPromise })

  let items: Array<Agent | State | Designation> = []

  if (listingType === 'agents') {
    const where: Record<string, any> = {
      _status: { equals: 'published' },
    }

    if (filterByState) {
      const stateId = typeof filterByState === 'object' ? filterByState.id : filterByState
      where.state = { equals: stateId }
    }

    if (filterByDesignation) {
      const designationId =
        typeof filterByDesignation === 'object' ? filterByDesignation.id : filterByDesignation
      where.designation = { contains: designationId }
    }

    const result = await payload.find({
      collection: 'agents',
      where,
      limit: 1000,
      sort: 'city',
    })
    items = result.docs
  } else if (listingType === 'states') {
    const where: Record<string, any> = {}

    if (filterByCountry && filterByCountry !== 'all') {
      where.country = { equals: filterByCountry }
    }

    const result = await payload.find({
      collection: 'states',
      where,
      limit: 100,
      sort: 'name',
    })
    items = result.docs
  } else if (listingType === 'designations') {
    const result = await payload.find({
      collection: 'designations',
      limit: 100,
      sort: 'sortOrder',
    })
    items = result.docs
  }

  const getGridCols = () => {
    switch (columns) {
      case '2':
        return 'sm:grid-cols-2'
      case '3':
        return 'sm:grid-cols-2 lg:grid-cols-3'
      case '4':
        return 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case '5':
        return 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      default:
        return 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
  }

  const getItemLink = (item: Agent | State | Designation) => {
    if ('city' in item) {
      // Agent
      return `/agents/${item.slug}`
    } else if ('abbreviation' in item) {
      // State
      return `/${item.slug}-network`
    } else {
      // Designation
      return `/designations/${item.slug}`
    }
  }

  const getItemName = (item: Agent | State | Designation) => {
    if ('displayName' in item) {
      return item.displayName
    } else if ('title' in item) {
      return item.title
    }
    return item.name
  }

  // Group items alphabetically if layout is alphabetical
  const groupedItems =
    layout === 'alphabetical'
      ? items.reduce(
          (acc, item) => {
            const name = getItemName(item) || ''
            const firstLetter = name.charAt(0).toUpperCase()
            if (!acc[firstLetter]) {
              acc[firstLetter] = []
            }
            acc[firstLetter].push(item)
            return acc
          },
          {} as Record<string, typeof items>,
        )
      : null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Action Buttons */}
        {(showApplyButton || showInquireButton) && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {showApplyButton && (
              <Link
                href={applyButtonUrl || '/apply'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Apply for DLE Membership
              </Link>
            )}
            {showInquireButton && (
              <Link
                href={inquireButtonUrl || '/member-relations'}
                className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg border-2 border-gray-900 transition-colors"
              >
                Inquire About Availability of Your City
              </Link>
            )}
          </div>
        )}

        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}

        {layout === 'alphabetical' && groupedItems ? (
          <div className="space-y-8">
            {Object.keys(groupedItems)
              .sort()
              .map((letter) => (
                <div key={letter}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">{letter}</h3>
                  <div className={`grid grid-cols-1 ${getGridCols()} gap-2`}>
                    {groupedItems[letter].map((item, idx) => (
                      <Link
                        key={`${item.id}-${idx}`}
                        href={getItemLink(item)}
                        className="flex items-center gap-2 py-1 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <span className="text-blue-600">▶</span>
                        {getItemName(item)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : layout === 'grid' ? (
          <div className={`grid grid-cols-1 ${getGridCols()} gap-6`}>
            {items.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={getItemLink(item)}
                className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg text-center transition-colors"
              >
                <h3 className="font-bold text-lg text-gray-900">{getItemName(item)}</h3>
                {'shortBio' in item && item.shortBio && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.shortBio}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${getGridCols()} gap-x-8 gap-y-2`}>
            {items.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={getItemLink(item)}
                className="flex items-center gap-2 py-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span className="text-blue-600">▶</span>
                {getItemName(item)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
