/**
 * Processes media resource URL to ensure proper formatting
 *
 * IMPORTANT: This function returns relative URLs as-is, allowing the browser
 * to automatically resolve them to the current domain. This works correctly
 * in both client-side and server-side rendering without requiring environment
 * variables like VERCEL_PROJECT_PRODUCTION_URL.
 *
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  // Encode cache tag if provided
  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  // Already absolute URL (Vercel Blob Storage or external) - return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // ✅ FIX: For relative URLs, return them as-is!
  // The browser will automatically resolve /api/media/file/image.jpg to the current domain
  // This works in both client and server rendering without needing getClientSideURL()
  if (url.startsWith('/')) {
    return cacheTag ? `${url}?${cacheTag}` : url
  }

  // If URL doesn't start with / or http, prepend / to make it relative
  const normalizedUrl = `/${url}`
  return cacheTag ? `${normalizedUrl}?${cacheTag}` : normalizedUrl
}
