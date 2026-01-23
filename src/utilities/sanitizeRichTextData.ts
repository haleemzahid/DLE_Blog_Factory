import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

/**
 * Sanitize rich text data to remove any undefined/null values
 * This prevents React error #130 when rendering
 */
export function sanitizeRichTextData(data: any): DefaultTypedEditorState | null {
  if (!data) {
    console.warn('sanitizeRichTextData: No data provided')
    return null
  }

  // Check if data has required structure
  if (!data.root || !data.root.children) {
    console.error('sanitizeRichTextData: Invalid data structure', data)
    return null
  }

  // Deep clone to avoid mutating original
  const sanitized = JSON.parse(JSON.stringify(data))

  // Filter out any undefined or null children
  if (Array.isArray(sanitized.root.children)) {
    sanitized.root.children = sanitized.root.children.filter(
      (child: any) => child !== null && child !== undefined && typeof child === 'object'
    )

    // Recursively clean each child
    sanitized.root.children = sanitized.root.children.map((child: any) => {
      return cleanObject(child)
    })
  }

  return sanitized
}

/**
 * Recursively remove undefined/null values from an object
 */
function cleanObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return undefined
  }

  if (typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== null && item !== undefined)
      .map((item) => cleanObject(item))
  }

  const cleaned: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue // Skip undefined/null values
    }

    if (typeof value === 'object') {
      const cleanedValue = cleanObject(value)
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue
      }
    } else {
      cleaned[key] = value
    }
  }

  return cleaned
}
