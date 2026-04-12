import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? 'NanoStudio <hello@captivate.icu>';
const SITE = 'https://captivate.icu';

// ── Shared layout ────────────────────────────────────────────────────────────

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    body { margin:0; padding:0; background:#0A0A0A; font-family:'Helvetica Neue',Arial,sans-serif; color:#E0E0E0; }
    .container { max-width:560px; margin:40px auto; background:#111111; border:1px solid #2A2A2A; border-radius:12px; overflow:hidden; }
    .header { padding:28px 32px; border-bottom:1px solid #2A2A2A; }
    .logo { font-size:20px; font-weight:900; letter-spacing:-0.5px; color:#FFFFFF; }
    .logo span { color:#D4A017; }
    .body { padding:32px; }
    h1 { margin:0 0 16px; font-size:22px; font-weight:800; color:#FFFFFF; }
    p { margin:0 0 16px; font-size:15px; line-height:1.6; color:#AAAAAA; }
    .btn { display:inline-block; background:#D4A017; color:#000000; font-weight:700; font-size:14px; padding:12px 24px; border-radius:8px; text-decoration:none; margin:8px 0 16px; }
    .divider { border:none; border-top:1px solid #2A2A2A; margin:24px 0; }
    .footer { padding:20px 32px; border-top:1px solid #2A2A2A; }
    .footer p { font-size:12px; color:#555555; margin:0; }
    .footer a { color:#D4A017; text-decoration:none; }
    .tag { display:inline-block; background:#D4A017/10; border:1px solid #D4A017; color:#D4A017; font-size:11px; font-weight:700; padding:3px 10px; border-radius:99px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">NANO<span>STUDIO</span></span>
    </div>
    <div class="body">${body}</div>
    <div class="footer">
      <p>NanoStudio &bull; <a href="${SITE}">${SITE}</a> &bull; <a href="mailto:support@captivate.icu">support@captivate.icu</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ── Fire-and-forget helper ───────────────────────────────────────────────────

function send(to: string, subject: string, html: string): void {
  getResend()
    .emails.send({ from: FROM, to, subject, html })
    .catch(err => console.error('[email] send failed:', err.message));
}

// ── Transactional emails ─────────────────────────────────────────────────────

export function sendWelcome(to: string): void {
  send(
    to,
    'Welcome to NanoStudio',
    wrap(`
      <div class="tag">Welcome</div>
      <h1>You're in.</h1>
      <p>Your NanoStudio account is ready. Start by creating your first project — describe your client, their industry, and what the site needs to do. Claude handles the rest.</p>
      <a class="btn" href="${SITE}/dashboard">Open Dashboard →</a>
      <hr class="divider"/>
      <p>On the <strong style="color:#FFFFFF">Free plan</strong> you get 5 credits/day and 25 exports/month. Upgrade any time from your dashboard if you need more.</p>
      <p style="font-size:13px;color:#666">Questions? Reply to this email or reach us at <a href="mailto:support@captivate.icu" style="color:#D4A017">support@captivate.icu</a>.</p>
    `),
  );
}

export function sendSubscriptionStarted(to: string, tier: string): void {
  const label = tier.charAt(0).toUpperCase() + tier.slice(1);
  send(
    to,
    `You're on NanoStudio ${label}`,
    wrap(`
      <div class="tag">${label} Plan</div>
      <h1>Subscription confirmed.</h1>
      <p>Your <strong style="color:#FFFFFF">${label}</strong> plan is now active. Your credits have been added and your dashboard is ready.</p>
      <a class="btn" href="${SITE}/dashboard">Go to Dashboard →</a>
      <hr class="divider"/>
      <p>Manage your subscription, download invoices, or cancel any time via the <a href="${SITE}/dashboard" style="color:#D4A017">billing portal</a>.</p>
    `),
  );
}

export function sendPaymentFailed(to: string, tier: string): void {
  const label = tier.charAt(0).toUpperCase() + tier.slice(1);
  send(
    to,
    'Action required: payment failed',
    wrap(`
      <div class="tag" style="border-color:#EF4444;color:#EF4444">Payment Failed</div>
      <h1>We couldn't process your payment.</h1>
      <p>Your <strong style="color:#FFFFFF">${label}</strong> subscription payment failed. Your account is still active for now — please update your payment method to avoid interruption.</p>
      <a class="btn" href="${SITE}/dashboard" style="background:#EF4444">Update Payment Method →</a>
      <hr class="divider"/>
      <p style="font-size:13px;color:#666">If you believe this is an error, contact us at <a href="mailto:support@captivate.icu" style="color:#D4A017">support@captivate.icu</a>.</p>
    `),
  );
}

export function sendSubscriptionCanceled(to: string, tier: string): void {
  const label = tier.charAt(0).toUpperCase() + tier.slice(1);
  send(
    to,
    'Your NanoStudio subscription has been canceled',
    wrap(`
      <div class="tag" style="border-color:#888;color:#888">Canceled</div>
      <h1>Subscription canceled.</h1>
      <p>Your <strong style="color:#FFFFFF">${label}</strong> plan has been canceled. You've been moved to the Free tier — 5 credits/day, 25 exports/month.</p>
      <p>Your data and projects are safe. If you change your mind, you can resubscribe any time.</p>
      <a class="btn" href="${SITE}/#pricing">View Plans →</a>
      <hr class="divider"/>
      <p style="font-size:13px;color:#666">We'd love to know why you left. Reply to this email — we read every response.</p>
    `),
  );
}

export function sendCreditPackConfirmed(to: string, credits: number): void {
  send(
    to,
    `${credits} credits added to your account`,
    wrap(`
      <div class="tag">Credits Added</div>
      <h1>${credits} credits are ready.</h1>
      <p>Your credit pack purchase was successful. <strong style="color:#FFFFFF">${credits} credits</strong> have been added to your account and are ready to use.</p>
      <a class="btn" href="${SITE}/dashboard">Start Building →</a>
      <hr class="divider"/>
      <p style="font-size:13px;color:#666">Credits never expire. Stack more any time from the <a href="${SITE}/#pricing" style="color:#D4A017">pricing page</a>.</p>
    `),
  );
}
