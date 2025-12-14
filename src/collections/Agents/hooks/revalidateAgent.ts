import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Agent } from '../../../payload-types'

export const revalidateAgent: CollectionAfterChangeHook<Agent> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/agents/${doc.slug}`

      payload.logger.info(`Revalidating agent at path: ${path}`)

      revalidatePath(path)
      revalidateTag('agents-sitemap')
    }

    // If the agent was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/agents/${previousDoc.slug}`

      payload.logger.info(`Revalidating old agent at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('agents-sitemap')
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Agent> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/agents/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('agents-sitemap')
  }

  return doc
}
