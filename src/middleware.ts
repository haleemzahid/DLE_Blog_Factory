import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Add CORS headers to response
 */
function addCorsHeaders(response: NextResponse, origin: string | null, host: string | null) {
  // For credentials to work, we must echo back the exact origin (not wildcard)
  // If origin is provided, use it directly (handles any external domain)
  // If no origin (same-origin), construct from host
  let allowOrigin = '*'
  if (origin) {
    allowOrigin = origin
  } else if (host) {
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
    const protocol = isLocalhost ? 'http' : 'https'
    allowOrigin = `${protocol}://${host}`
  }
  response.headers.set('Access-Control-Allow-Origin', allowOrigin)
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  response.headers.set('Vary', 'Origin')
  return response
}

/**
 * Multi-tenant middleware for domain-based routing
 *
 * This middleware:
 * 1. Handles CORS for API and admin routes
 * 2. Detects the current hostname
 * 3. Sets tenant context headers for downstream use
 */
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  const origin = request.headers.get('origin')

  // Handle CORS preflight requests for API and admin routes
  if (request.method === 'OPTIONS' && (pathname.startsWith('/api') || pathname.startsWith('/admin'))) {
    const response = new NextResponse(null, { status: 204 })
    return addCorsHeaders(response, origin, hostname)
  }

  // Add CORS headers to API and admin responses
  if (pathname.startsWith('/api') || pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    return addCorsHeaders(response, origin, hostname)
  }

  // Skip middleware for static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/media') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Set tenant context header for downstream use
  const response = NextResponse.next()
  response.headers.set('x-tenant-host', hostname)

  // Clean hostname for easier processing
  const cleanHost = hostname
    .replace(/:\d+$/, '') // Remove port
    .replace(/^www\./, '') // Remove www
    .toLowerCase()

  response.headers.set('x-tenant-clean-host', cleanHost)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
