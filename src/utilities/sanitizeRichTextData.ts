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

  console.log('🧹 Starting sanitization of data with', data.root.children.length, 'children')

  // Deep clone to avoid mutating original
  let sanitized: any
  try {
    sanitized = JSON.parse(JSON.stringify(data))
  } catch (error) {
    console.error('❌ Failed to clone data:', error)
    return null
  }

  // Filter out any undefined or null children
  if (Array.isArray(sanitized.root.children)) {
    const originalCount = sanitized.root.children.length
    sanitized.root.children = sanitized.root.children.filter(
      (child: any, index: number) => {
        if (child === null || child === undefined) {
          console.warn(`🧹 Removed null/undefined child at index ${index}`)
          return false
        }
        if (typeof child !== 'object') {
          console.warn(`🧹 Removed non-object child at index ${index}:`, typeof child)
          return false
        }
        return true
      }
    )

    if (originalCount !== sanitized.root.children.length) {
      console.log(`🧹 Filtered ${originalCount - sanitized.root.children.length} invalid children`)
    }

    // Recursively clean each child
    sanitized.root.children = sanitized.root.children.map((child: any, index: number) => {
      const cleaned = cleanObject(child)
      if (!cleaned || Object.keys(cleaned).length === 0) {
        console.warn(`🧹 Child at index ${index} became empty after cleaning`)
      }
      return cleaned
    }).filter((child: any) => child && typeof child === 'object' && Object.keys(child).length > 0)
  }

  console.log('🧹 Sanitization complete:', sanitized.root.children.length, 'children remain')

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
