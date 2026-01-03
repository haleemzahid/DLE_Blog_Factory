import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * WordPress Sync Hooks
 *
 * These hooks send webhooks to WordPress whenever posts are created, updated, or deleted.
 * This enables real-time synchronization between Payload CMS and WordPress.
 *
 * Configuration:
 * Set these environment variables:
 * - WORDPRESS_WEBHOOK_URL: The webhook endpoint URL (e.g., https://yoursite.com/wp-json/payload-sync/v1/webhook)
 * - WORDPRESS_WEBHOOK_SECRET: The secret key for authenticating webhooks
 */

const WORDPRESS_WEBHOOK_URL = process.env.WORDPRESS_WEBHOOK_URL || ''
const WORDPRESS_WEBHOOK_SECRET = process.env.WORDPRESS_WEBHOOK_SECRET || ''

interface WebhookPayload {
  collection: string
  operation: 'create' | 'update' | 'delete'
  doc: Record<string, unknown>
  previousDoc?: Record<string, unknown>
  secret: string
}

/**
 * Send webhook to WordPress
 */
async function sendWebhook(payload: WebhookPayload): Promise<void> {
  if (!WORDPRESS_WEBHOOK_URL) {
    console.log('[WordPress Sync] Webhook URL not configured, skipping sync')
    return
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000)
    const body = JSON.stringify(payload)

    // Create HMAC signature for verification
    const crypto = await import('crypto')
    const signature = crypto
      .createHmac('sha256', WORDPRESS_WEBHOOK_SECRET)
      .update(`${timestamp}.${body}`)
      .digest('hex')

    const response = await fetch(WORDPRESS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Payload-Timestamp': timestamp.toString(),
        'X-Payload-Signature': signature,
      },
      body,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[WordPress Sync] Webhook failed with status ${response.status}: ${errorText}`)
    } else {
      console.log(`[WordPress Sync] Successfully synced ${payload.operation} for post ${payload.doc.id}`)
    }
  } catch (error) {
    console.error('[WordPress Sync] Failed to send webhook:', error)
  }
}

/**
 * After Change Hook - Syncs post creates and updates to WordPress
 */
export const syncToWordPress: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Skip if this is a draft save without publish
  if (doc._status !== 'published') {
    // Check if it was previously published and is now unpublished
    if (previousDoc?._status === 'published') {
      console.log(`[WordPress Sync] Post ${doc.id} unpublished, sending delete webhook`)
      await sendWebhook({
        collection: 'posts',
        operation: 'delete',
        doc: doc as Record<string, unknown>,
        previousDoc: previousDoc as Record<string, unknown>,
        secret: WORDPRESS_WEBHOOK_SECRET,
      })
    } else {
      console.log(`[WordPress Sync] Post ${doc.id} is draft, skipping sync`)
    }
    return doc
  }

  // Determine if this is a create or update
  const syncOperation = operation === 'create' ? 'create' : 'update'

  console.log(`[WordPress Sync] Sending ${syncOperation} webhook for post ${doc.id}`)

  // Send webhook asynchronously (don't block the save)
  sendWebhook({
    collection: 'posts',
    operation: syncOperation,
    doc: doc as Record<string, unknown>,
    previousDoc: previousDoc as Record<string, unknown>,
    secret: WORDPRESS_WEBHOOK_SECRET,
  }).catch((error) => {
    console.error('[WordPress Sync] Background webhook failed:', error)
  })

  return doc
}

/**
 * After Delete Hook - Removes post from WordPress
 */
export const deleteFromWordPress: CollectionAfterDeleteHook = async ({ doc, req }) => {
  console.log(`[WordPress Sync] Sending delete webhook for post ${doc.id}`)

  // Send webhook asynchronously
  sendWebhook({
    collection: 'posts',
    operation: 'delete',
    doc: doc as Record<string, unknown>,
    secret: WORDPRESS_WEBHOOK_SECRET,
  }).catch((error) => {
    console.error('[WordPress Sync] Background delete webhook failed:', error)
  })

  return doc
}

/**
 * Category Sync Hook - Syncs category changes to WordPress
 */
export const syncCategoryToWordPress: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  if (!WORDPRESS_WEBHOOK_URL) return doc

  const syncOperation = operation === 'create' ? 'create' : 'update'

  sendWebhook({
    collection: 'categories',
    operation: syncOperation,
    doc: doc as Record<string, unknown>,
    previousDoc: previousDoc as Record<string, unknown>,
    secret: WORDPRESS_WEBHOOK_SECRET,
  }).catch((error) => {
    console.error('[WordPress Sync] Category webhook failed:', error)
  })

  return doc
}

/**
 * Category Delete Hook
 */
export const deleteCategoryFromWordPress: CollectionAfterDeleteHook = async ({ doc }) => {
  if (!WORDPRESS_WEBHOOK_URL) return doc

  sendWebhook({
    collection: 'categories',
    operation: 'delete',
    doc: doc as Record<string, unknown>,
    secret: WORDPRESS_WEBHOOK_SECRET,
  }).catch((error) => {
    console.error('[WordPress Sync] Category delete webhook failed:', error)
  })

  return doc
}

/**
 * Media Sync Hook - Syncs media changes to WordPress
 */
export const syncMediaToWordPress: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  if (!WORDPRESS_WEBHOOK_URL) return doc

  const syncOperation = operation === 'create' ? 'create' : 'update'

  sendWebhook({
    collection: 'media',
    operation: syncOperation,
    doc: doc as Record<string, unknown>,
    previousDoc: previousDoc as Record<string, unknown>,
    secret: WORDPRESS_WEBHOOK_SECRET,
  }).catch((error) => {
    console.error('[WordPress Sync] Media webhook failed:', error)
  })

  return doc
}

/**
 * Media Delete Hook
 */
export const deleteMediaFromWordPress: CollectionAfterDeleteHook = async ({ doc }) => {
  if (!WORDPRESS_WEBHOOK_URL) return doc

  sendWebhook({
    collection: 'media',
    operation: 'delete',
    doc: doc as Record<string, unknown>,
    secret: WORDPRESS_WEBHOOK_SECRET,
  }).catch((error) => {
    console.error('[WordPress Sync] Media delete webhook failed:', error)
  })

  return doc
}
