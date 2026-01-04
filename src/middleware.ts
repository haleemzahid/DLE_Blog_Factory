import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Multi-tenant middleware for domain-based routing
 *
 * This middleware:
 * 1. Detects the current hostname
 * 2. Sets tenant context headers for downstream use
 * 3. Skips admin, API, and static file routes
 */
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Skip middleware for admin, API, and static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
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
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}
