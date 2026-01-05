import type { GlobalAfterChangeHook } from 'payload'

export const revalidateHeader: GlobalAfterChangeHook = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    // Dynamic import to prevent Next.js bundler from including this in admin bundle
    const { revalidateTag } = await import('next/cache')
    revalidateTag('global_header')
  }

  return doc
}
