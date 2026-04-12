# Checklist for approval — Captivate / NanoStudio
## Phase A — Scope and accounts
1. 	Confirm product naming — The repo mixes labels (nanostudio in package.json, “StelarBIM” in /api/health, “NanoStudio” on the landing). Decide the public name and align copy, API health string, and footer (captivate.icu).
1. 	Stripe — Confirm the Stripe account to use (test + live), business details, and tax / customer portal needs.
1. 	Email provider — Pick one for transactional (receipts, password reset if you add auth) and marketing (newsletters, campaigns): e.g. Resend, SendGrid, Mailchimp, or Customer.io. This drives DNS (SPF/DKIM) and the “campaign structure” below.

## Phase B — Connectors and environment (“all connectors satisfied”)
1. 	Document and validate existing env: DATABASE_URL, ANTHROPIC_API_KEY, PORT, NODE_ENV (from .env.example).
1. 	Add and document new secrets: Stripe (STRIPE_SECRET_KEY, webhook signing secret, publishable key for the client), email provider API keys, and any auth secrets if you add sign-in.
1. 	Production config — Ensure apprunner.yaml / Dockerfile (or your host) inject all vars safely; no secrets in the repo.

## Phase C — Stripe billing (tiers wired to your account)
1. 	Products & prices — In Stripe Dashboard, create Products/Prices matching the three tiers on the landing (Starter / Studio / Enterprise). Decide what “Enterprise / Custom” does (Checkout with quote, “Contact sales”, or manual invoicing only) 
1. 	Checkout flow — Server routes to create Checkout Sessions (or Payment Links if you prefer zero custom code) with success/cancel URLs; client keeps current visual design, only behavior changes (CTAs open real checkout).
1. 	Webhooks — POST /api/stripe/webhook (raw body): handle checkout.session.completed, customer.subscription.*, invoice.paid, invoice.payment_failed with idempotency and logging.
1. 	Customer portal — Link for “Manage subscription” (Stripe Billing Portal) where appropriate.
1. 	Entitlements — Map Stripe subscription → app limits (e.g. briefs/month, Claude runs) in PostgreSQL; extend schema.sql with users / subscriptions / stripe_customer_id as needed.

## Phase D — Auth and dashboard (needed for real billing)
1. 	Decide auth model — Today “Sign In” goes to /dashboard with no real login. Choose minimal auth (e.g. magic link or OAuth) so each Stripe customer maps to a user.
1. 	Protect API routes — Restrict /api/* to authenticated users where required; keep health/public routes explicit.

## Phase E — Landing page (keep current design)
1. 	Pricing section — Keep layout/styling; wire each tier’s CTA to the correct Stripe Checkout Session or Payment Link; handle loading/error states without changing the look.
1. 	Post-purchase UX — Success page messaging and optional “Continue to dashboard” after webhook processing.
1. 	Footer links — /privacy and /terms are referenced but not implemented; add minimal legal pages (Stripe and email compliance expect this).

## Phase F — SEO
1. HTML head — unique title, meta description, canonical URL, lang, theme color; consider react-helmet-async or Vite + index.html + per-route metadata.
1. Social — Open Graph and Twitter Card tags; default OG image (on-brand, same palette).
1. Structured data — Organization / WebSite JSON-LD as appropriate.
1. Crawlability — robots.txt, sitemap.xml (or generate at build); ensure client-side routes work with your hosting (SPA fallback is already in server/index.ts for production).

## Phase G — Email campaign structure (optimal, practical)
1. Lists & segments — e.g. Registered / Trialing / Paying / Churned; tags for tier and onboarding step.
1. Transactional — Welcome, payment receipt (Stripe can send receipts; optional duplicate via your provider), failed payment / dunning, subscription canceled.
1. Lifecycle marketing — Short sequence: welcome → product tips → case study/social proof → upgrade (if applicable); compliance: explicit opt-in for marketing, unsubscribe, physical address if required.
1. Automation triggers — Signup, subscription start, trial end, payment failed, cancellation (events from Stripe webhooks + your user table).
1. Deliverability — Domain authentication (SPF, DKIM, DMARC) for your sending domain.

## Phase H — QA and launch
1. Stripe test mode — Full flow: subscribe, webhook updates DB, portal cancel/reactivate.
1. Smoke tests — API health, landing, dashboard with subscription state, email receipt in sandbox.
1. Go-live — Switch to live keys, webhook endpoint URL, and monitor Stripe Dashboard + server logs.
1. Assumptions baked in (say if you want these changed)
1. Billing is subscription via Stripe Billing (matches “/mo” on the page).
1. Enterprise may stay “Contact us” without Checkout until you define a process.
1. Email is both provider setup and a clear campaign/automation structure (lists, triggers, sequences), not necessarily a full copywriting pass unless you ask for it.