'use client'

import { useEffect } from 'react'

/**
 * Client component that hides the parent layout's Header and Footer
 * This is necessary because the root layout renders Header/Footer for all pages,
 * but agent pages need to show tenant-specific headers/footers instead
 */
export function HideParentNav() {
  useEffect(() => {
    // Find and hide the root layout's header and footer
    // The agent page content is nested inside the root layout
    const agentWrapper = document.querySelector('.agent-page-wrapper')
    if (!agentWrapper) return

    // Get the parent body container
    const body = document.body

    // Find all headers and footers in the root layout (not inside agent-page-wrapper)
    const headers = body.querySelectorAll('header')
    const footers = body.querySelectorAll('footer')

    headers.forEach((header) => {
      // Only hide headers that are NOT inside the agent-page-wrapper
      if (!agentWrapper.contains(header)) {
        header.style.display = 'none'
      }
    })

    footers.forEach((footer) => {
      // Only hide footers that are NOT inside the agent-page-wrapper
      if (!agentWrapper.contains(footer)) {
        footer.style.display = 'none'
      }
    })

    // Cleanup function to restore on unmount
    return () => {
      headers.forEach((header) => {
        if (!agentWrapper.contains(header)) {
          header.style.display = ''
        }
      })
      footers.forEach((footer) => {
        if (!agentWrapper.contains(footer)) {
          footer.style.display = ''
        }
      })
    }
  }, [])

  return null
}
