'use client'

import React from 'react'

// =============================================================================
// GLOBAL PAGINATION STYLES - Change these values to update pagination everywhere
// =============================================================================
export const paginationStyles = {
  // Container
  container: 'flex justify-center items-center gap-2 mt-10',

  // Previous/Next buttons
  navButton: 'px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',

  // Page numbers container
  pageNumbersWrapper: 'flex gap-1',

  // Page number button (inactive)
  pageButton: 'w-10 h-10 rounded-lg font-medium transition-colors border border-gray-300 text-gray-600 hover:bg-gray-50',

  // Page number button (active)
  pageButtonActive: 'w-10 h-10 rounded-lg font-medium transition-colors border border-gray-900 text-gray-900 bg-white',

  // Page info text
  pageInfo: 'text-sm text-gray-500 ml-4',
}

// =============================================================================
// PAGINATION PROPS
// =============================================================================
interface ArticlePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  itemLabel?: string // e.g., "posts", "articles"
  showPageInfo?: boolean
}

// =============================================================================
// PAGINATION COMPONENT
// =============================================================================
export const ArticlePagination: React.FC<ArticlePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemLabel = 'posts',
  showPageInfo = true,
}) => {
  return (
    <div className={paginationStyles.container}>
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={paginationStyles.navButton}
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className={paginationStyles.pageNumbersWrapper}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? paginationStyles.pageButtonActive
                : paginationStyles.pageButton
            }
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className={paginationStyles.navButton}
      >
        Next
      </button>

      {/* Page Info */}
      {showPageInfo && (
        <span className={paginationStyles.pageInfo}>
          Page {currentPage} of {totalPages || 1} ({totalItems} {itemLabel})
        </span>
      )}
    </div>
  )
}
