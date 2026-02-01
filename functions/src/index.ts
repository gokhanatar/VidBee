import * as admin from 'firebase-admin'
import { onRequest } from 'firebase-functions/v2/https'
import { defineString } from 'firebase-functions/params'

admin.initializeApp()
const db = admin.firestore()
const webhookAuthKey = defineString('REVENUECAT_WEBHOOK_AUTH_KEY')

interface RevenueCatEvent {
  type: string
  app_user_id: string
  product_id: string
  entitlement_ids?: string[]
  expiration_at_ms?: number
  purchased_at_ms?: number
  store: string
  environment: string
  is_family_share?: boolean
  period_type?: string
  presented_offering_id?: string
  transaction_id?: string
  original_transaction_id?: string
}

interface WebhookPayload {
  api_version: string
  event: RevenueCatEvent
}

export const revenuecatWebhook = onRequest(async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || authHeader !== `Bearer ${webhookAuthKey.value()}`) {
    res.status(401).send('Unauthorized')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed')
    return
  }

  const payload = req.body as WebhookPayload
  const event = payload.event
  const userId = event.app_user_id

  if (!userId || !event.type) {
    res.status(400).send('Invalid payload')
    return
  }

  const subscriptionRef = db.collection('subscriptions').doc(userId)
  const now = admin.firestore.FieldValue.serverTimestamp()

  try {
    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'UNCANCELLATION':
        await subscriptionRef.set(
          {
            status: 'active',
            productId: event.product_id,
            expiresAt: event.expiration_at_ms ? new Date(event.expiration_at_ms) : null,
            store: event.store,
            billingIssue: false,
            updatedAt: now
          },
          { merge: true }
        )
        break

      case 'CANCELLATION':
        await subscriptionRef.set(
          {
            status: 'cancelled',
            cancelledAt: now,
            expiresAt: event.expiration_at_ms ? new Date(event.expiration_at_ms) : null,
            updatedAt: now
          },
          { merge: true }
        )
        await logRefundEvent(userId, event, 'cancellation')
        break

      case 'EXPIRATION':
        await subscriptionRef.set(
          {
            status: 'expired',
            expiredAt: now,
            updatedAt: now
          },
          { merge: true }
        )
        break

      case 'BILLING_ISSUE':
        await subscriptionRef.set(
          {
            billingIssue: true,
            billingIssueDetectedAt: now,
            updatedAt: now
          },
          { merge: true }
        )
        break

      case 'PRODUCT_CHANGE':
        await subscriptionRef.set(
          {
            status: 'active',
            productId: event.product_id,
            expiresAt: event.expiration_at_ms ? new Date(event.expiration_at_ms) : null,
            updatedAt: now
          },
          { merge: true }
        )
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    res.status(200).send('OK')
  } catch (error) {
    console.error('Webhook processing error:', error)
    res.status(500).send('Internal error')
  }
})

async function logRefundEvent(
  userId: string,
  event: RevenueCatEvent,
  reason: string
): Promise<void> {
  await db.collection('refund_logs').add({
    userId,
    productId: event.product_id,
    transactionId: event.transaction_id,
    originalTransactionId: event.original_transaction_id,
    store: event.store,
    reason,
    eventType: event.type,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  })
}
