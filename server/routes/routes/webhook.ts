import { Router } from 'express';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { query } from '../../db.js';
import { TIER_PRICE, stripe } from './billing.js';

// Reverse map: price ID → tier name
const PRICE_TO_TIER: Record<string, string> = {};
for (const [tier, priceId] of Object.entries(TIER_PRICE)) {
  if (priceId) PRICE_TO_TIER[priceId] = tier;
}

const router = Router();

// POST /api/stripe/webhook — raw body required (set at app level before express.json)
router.post('/', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return res.status(400).json({ error: 'Missing Stripe-Signature header or webhook secret' });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, secret);
  } catch (err: any) {
    console.error('[webhook] signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await onSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await onSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.paid':
        await onInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await onInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        // Unhandled type — acknowledge and ignore
        break;
    }
    res.json({ received: true });
  } catch (err: any) {
    console.error(`[webhook] handler error for ${event.type}:`, err.message);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

async function upsertUser(email: string, customerId: string): Promise<string> {
  await query(
    `INSERT INTO users (email, stripe_customer_id)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET stripe_customer_id = EXCLUDED.stripe_customer_id`,
    [email, customerId],
  );
  const result = await query('SELECT id FROM users WHERE email = $1', [email]);
  return result.rows[0].id as string;
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const customerId = session.customer as string;
  if (!email || !customerId) return;

  // One-time credit pack purchase
  if (session.mode === 'payment') {
    const pack = session.metadata?.pack;
    const credits = Number(session.metadata?.credits ?? 0);
    if (!pack || !credits) return;

    const userId = await upsertUser(email, customerId);
    await query(
      `INSERT INTO credit_ledger (user_id, source, credits, stripe_session_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, pack, credits, session.id],
    );
    return;
  }

  // Subscription checkout
  const subscriptionId = session.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const tier = PRICE_TO_TIER[priceId] ?? 'starter';
  const userId = await upsertUser(email, customerId);
  const periodEnd = new Date((subscription as any).current_period_end * 1000);

  await query(
    `INSERT INTO subscriptions
       (user_id, stripe_subscription_id, stripe_price_id, tier, status, current_period_end)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (stripe_subscription_id) DO UPDATE SET
       stripe_price_id    = EXCLUDED.stripe_price_id,
       tier               = EXCLUDED.tier,
       status             = EXCLUDED.status,
       current_period_end = EXCLUDED.current_period_end,
       updated_at         = NOW()`,
    [userId, subscriptionId, priceId, tier, subscription.status, periodEnd],
  );

  // Sync tier onto user row for fast entitlement checks
  await query('UPDATE users SET tier = $1 WHERE id = $2', [tier, userId]);
}

async function onSubscriptionUpdated(sub: Stripe.Subscription) {
  const priceId = sub.items.data[0]?.price.id;
  const tier = PRICE_TO_TIER[priceId] ?? 'starter';
  const periodEnd = new Date((sub as any).current_period_end * 1000);

  await query(
    `UPDATE subscriptions SET
       stripe_price_id    = $1,
       tier               = $2,
       status             = $3,
       current_period_end = $4,
       updated_at         = NOW()
     WHERE stripe_subscription_id = $5`,
    [priceId, tier, sub.status, periodEnd, sub.id],
  );

  // Sync tier onto user row
  const result = await query('SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1', [sub.id]);
  const userId = result.rows[0]?.user_id;
  if (userId) await query('UPDATE users SET tier = $1 WHERE id = $2', [tier, userId]);
}

async function onSubscriptionDeleted(sub: Stripe.Subscription) {
  await query(
    `UPDATE subscriptions SET status = 'canceled', updated_at = NOW()
     WHERE stripe_subscription_id = $1`,
    [sub.id],
  );
  // Downgrade user to free
  const result = await query('SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1', [sub.id]);
  const userId = result.rows[0]?.user_id;
  if (userId) await query("UPDATE users SET tier = 'free' WHERE id = $1", [userId]);
}

async function onInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string | undefined;
  if (!subscriptionId) return;
  await query(
    `UPDATE subscriptions SET status = 'active', updated_at = NOW()
     WHERE stripe_subscription_id = $1`,
    [subscriptionId],
  );
}

async function onInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string | undefined;
  if (!subscriptionId) return;
  await query(
    `UPDATE subscriptions SET status = 'past_due', updated_at = NOW()
     WHERE stripe_subscription_id = $1`,
    [subscriptionId],
  );
}

export default router;
