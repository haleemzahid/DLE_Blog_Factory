import { revalidatePath, revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  try {
    const requestHeaders = await headers()
    const payload = await getPayload({ config })

    // Authenticate by passing request headers
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { tag, path, type = 'tag' } = body as { tag?: string; path?: string; type?: 'tag' | 'path' }

    if (type === 'path' && path) {
      // Revalidate specific path
      revalidatePath(path)
      payload.logger.info(`Revalidated path: ${path}`)
      return Response.json({ success: true, revalidated: 'path', path })
    }

    if (type === 'tag' && tag) {
      // Revalidate specific tag
      revalidateTag(tag)
      payload.logger.info(`Revalidated tag: ${tag}`)
      return Response.json({ success: true, revalidated: 'tag', tag })
    }

    // Default: revalidate common tags
    revalidateTag('global_header')
    revalidateTag('global_footer')
    revalidatePath('/', 'layout')

    payload.logger.info('Revalidated all common caches')
    return Response.json({ success: true, revalidated: 'all' })
  } catch (error) {
    console.error('Revalidation error:', error)
    return new Response('Revalidation failed', { status: 500 })
  }
}

export async function GET(): Promise<Response> {
  return new Response('Use POST to revalidate cache', { status: 405 })
}
