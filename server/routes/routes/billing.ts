import { Router } from 'express';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { query } from '../../db.js';

// Lazy-init so importing this module without STRIPE_SECRET_KEY (e.g. in tests) does not crash
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not configured');
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

// Tier → price ID mapping (subscription tiers)
const TIER_PRICE: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro:     process.env.STRIPE_PRICE_PRO,
  studio:  process.env.STRIPE_PRICE_STUDIO,
};

// Credit pack → price ID mapping (one-time purchases)
const PACK_PRICE: Record<string, string | undefined> = {
  credits_50:  process.env.STRIPE_PRICE_CREDITS_50,
  credits_150: process.env.STRIPE_PRICE_CREDITS_150,
  credits_500: process.env.STRIPE_PRICE_CREDITS_500,
};

// Credit pack → credits granted
const PACK_CREDITS: Record<string, number> = {
  credits_50:  50,
  credits_150: 150,
  credits_500: 500,
};

const router = Router();

// GET /api/billing/config — public; returns publishable key and tier names (no secret values)
router.get('/config', (_req: Request, res: Response) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    tiers: Object.keys(TIER_PRICE).filter(t => TIER_PRICE[t]),
    packs: Object.keys(PACK_PRICE).filter(p => PACK_PRICE[p]),
  });
});

// POST /api/billing/checkout — create Stripe Checkout Session for a subscription tier
router.post('/checkout', async (req: Request, res: Response) => {
  const { tier, successUrl, cancelUrl } = req.body as {
    tier: string;
    successUrl: string;
    cancelUrl: string;
  };

  if (!tier || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: { code: 'missing_params', message: 'tier, successUrl, and cancelUrl are required' } });
  }

  const priceId = TIER_PRICE[tier];
  if (!priceId) {
    return res.status(400).json({ error: { code: 'invalid_tier', message: `Unknown tier: ${tier}` } });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      metadata: { tier },
    });
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'stripe_error', message: err.message } });
  }
});

// POST /api/billing/credits — create Stripe Checkout Session for a one-time credit pack
router.post('/credits', async (req: Request, res: Response) => {
  const { pack, successUrl, cancelUrl } = req.body as {
    pack: string;
    successUrl: string;
    cancelUrl: string;
  };

  if (!pack || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: { code: 'missing_params', message: 'pack, successUrl, and cancelUrl are required' } });
  }

  const priceId = PACK_PRICE[pack];
  if (!priceId) {
    return res.status(400).json({ error: { code: 'invalid_pack', message: `Unknown credit pack: ${pack}` } });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      metadata: { pack, credits: String(PACK_CREDITS[pack]) },
    });
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'stripe_error', message: err.message } });
  }
});

// POST /api/billing/portal — open Stripe Customer Portal for subscription management
router.post('/portal', async (req: Request, res: Response) => {
  const { email, returnUrl } = req.body as { email: string; returnUrl: string };

  if (!email || !returnUrl) {
    return res.status(400).json({ error: { code: 'missing_params', message: 'email and returnUrl are required' } });
  }

  try {
    const result = await query('SELECT stripe_customer_id FROM users WHERE email = $1', [email]);
    const customerId = result.rows[0]?.stripe_customer_id;
    if (!customerId) {
      return res.status(404).json({ error: { code: 'not_found', message: 'No billing account found for that email' } });
    }
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: { code: 'stripe_error', message: err.message } });
  }
});

export { TIER_PRICE, PACK_PRICE, PACK_CREDITS, getStripe };
export default router;
