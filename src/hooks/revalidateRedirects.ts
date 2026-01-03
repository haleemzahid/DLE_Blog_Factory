import type { CollectionAfterChangeHook } from 'payload'

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)

  // Dynamic import to prevent Next.js bundler from including this in admin bundle
  const { revalidateTag } = await import('next/cache')
  revalidateTag('redirects')

  return doc
}
