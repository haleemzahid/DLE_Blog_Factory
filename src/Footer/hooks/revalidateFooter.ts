import type { GlobalAfterChangeHook } from 'payload'

export const revalidateFooter: GlobalAfterChangeHook = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    // Dynamic import to prevent Next.js bundler from including this in admin bundle
    const { revalidateTag } = await import('next/cache')
    revalidateTag('global_footer')
  }

  return doc
}
