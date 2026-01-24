import { NextRequest, NextResponse } from 'next/server'
import {
  importJsonLdFromUrl,
  importJsonLdFromText,
  getImportPreview,
} from '@/utilities/importJsonLd'

/**
 * POST /api/import-jsonld
 *
 * Import JSON-LD data from a URL or raw text
 *
 * Request body:
 * {
 *   "method": "url" | "text",
 *   "url"?: "https://...",
 *   "text"?: "{ ... json-ld ... }"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { ...imported agent data... },
 *   "preview": [ { field, value, willImport }... ]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { method, url, text } = body

    if (!method || (method !== 'url' && method !== 'text')) {
      return NextResponse.json(
        { success: false, error: 'Invalid method. Must be "url" or "text"' },
        { status: 400 },
      )
    }

    let importedData

    if (method === 'url') {
      if (!url) {
        return NextResponse.json(
          { success: false, error: 'URL is required for URL import method' },
          { status: 400 },
        )
      }

      // Validate URL format
      try {
        const parsedUrl = new URL(url)
        if (parsedUrl.protocol !== 'https:') {
          return NextResponse.json(
            { success: false, error: 'Only HTTPS URLs are supported for security' },
            { status: 400 },
          )
        }
      } catch {
        return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 })
      }

      importedData = await importJsonLdFromUrl(url)
    } else {
      if (!text) {
        return NextResponse.json(
          { success: false, error: 'JSON-LD text is required for text import method' },
          { status: 400 },
        )
      }

      importedData = importJsonLdFromText(text)
    }

    // Generate preview of what will be imported
    const preview = getImportPreview(importedData)

    return NextResponse.json({
      success: true,
      data: importedData,
      preview,
    })
  } catch (error) {
    console.error('JSON-LD import error:', error)

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

/**
 * GET /api/import-jsonld
 *
 * Health check / info endpoint
 */
export async function GET() {
  return NextResponse.json({
    name: 'JSON-LD Import API',
    version: '1.0.0',
    endpoints: {
      POST: {
        description: 'Import JSON-LD data from URL or text',
        body: {
          method: '"url" | "text"',
          url: 'HTTPS URL to fetch (for url method)',
          text: 'Raw JSON-LD text (for text method)',
        },
      },
    },
    supportedSchemas: ['RealEstateAgent', 'LocalBusiness', 'Person', 'Organization'],
  })
}
