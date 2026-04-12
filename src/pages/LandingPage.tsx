import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

async function startCheckout(tier: string) {
  const res = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tier,
      successUrl: `${window.location.origin}/dashboard`,
      cancelUrl: `${window.location.origin}/#pricing`,
    }),
  })
  const data = await res.json()
  if (data.url) window.location.href = data.url
}

async function startCreditCheckout(pack: string) {
  const res = await fetch('/api/billing/credits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pack,
      successUrl: `${window.location.origin}/dashboard`,
      cancelUrl: `${window.location.origin}/#pricing`,
    }),
  })
  const data = await res.json()
  if (data.url) window.location.href = data.url
}

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dest = user ? '/dashboard' : '/access'

  const [loadingTier, setLoadingTier] = useState<string | null>(null)
  const [loadingPack, setLoadingPack] = useState<string | null>(null)

  const handleTierClick = async (tier: string | null) => {
    if (!tier) { navigate(dest); return }
    // Paid tiers: must be signed in first; if not, send to /access
    if (!user) { navigate('/access'); return }
    setLoadingTier(tier)
    try { await startCheckout(tier) } finally { setLoadingTier(null) }
  }

  const handlePackClick = async (pack: string) => {
    if (!user) { navigate('/access'); return }
    setLoadingPack(pack)
    try { await startCreditCheckout(pack) } finally { setLoadingPack(null) }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Outfit']">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">NANO<span className="text-[#D4A017]">STUDIO</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to={dest} className="text-sm text-gray-400 hover:text-white transition px-3 py-2">
              {user ? 'Dashboard' : 'Sign In'}
            </Link>
            <Link to={dest} className="text-sm font-semibold bg-[#D4A017] hover:bg-[#F0C040] text-black px-5 py-2 rounded transition">
              {user ? 'Go to App' : 'Start Free'}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#D4A017]/10 border border-[#D4A017]/30 text-[#D4A017] text-xs font-semibold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] animate-pulse"></span>
            AI Website Builder — Now in Beta
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tight">
            <span className="text-white">Build client</span><br />
            <span className="text-[#D4A017]">websites</span><br />
            <span className="text-white">in minutes.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            NanoStudio uses AI to turn your brief into a complete, professional website.
            You describe the client, the goal, and the vibe — we generate copy, layout, and structure.
            You review it, approve it, and ship it. That's it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to={dest} className="inline-flex items-center justify-center gap-2 bg-[#D4A017] hover:bg-[#F0C040] text-black font-bold px-8 py-4 rounded-lg text-base transition">
              {user ? 'Go to Dashboard →' : 'Start Building Free →'}
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 border border-[#2A2A2A] hover:border-[#D4A017]/50 text-gray-300 hover:text-white font-medium px-8 py-4 rounded-lg text-base transition">
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-12 text-center sm:text-left">
            <div>
              <p className="text-3xl font-black text-[#D4A017]">10×</p>
              <p className="text-sm text-gray-500 mt-1">Faster than manual builds</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{'< 5 min'}</p>
              <p className="text-sm text-gray-500 mt-1">From brief to first draft</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-sm text-gray-500 mt-1">You control approval & edits</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#D4A017] text-sm font-semibold uppercase tracking-widest mb-4">The Workflow</p>
          <h2 className="text-4xl md:text-5xl font-black mb-16">Three steps to a live site.</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Write a brief',
                desc: "Tell NanoStudio about the client: their industry, target audience, goals, and tone. Takes about 2 minutes. No technical skills needed.",
                icon: '📝',
              },
              {
                step: '02',
                title: 'AI generates the site',
                desc: "Claude reviews the brief and produces: page structure, headline copy, section content, calls-to-action, and an SEO summary — ready for your review.",
                icon: '⚡',
              },
              {
                step: '03',
                title: 'Approve and ship',
                desc: "Review the output in the cockpit. Make notes, request changes, or approve. Once approved, the site moves to deployment. You stay in control at every step.",
                icon: '✅',
              },
            ].map(s => (
              <div key={s.step} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-8">
                <div className="text-4xl mb-4">{s.icon}</div>
                <p className="text-[#D4A017] text-xs font-bold uppercase tracking-widest mb-2">Step {s.step}</p>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#D4A017] text-sm font-semibold uppercase tracking-widest mb-4">Features</p>
          <h2 className="text-4xl md:text-5xl font-black mb-16">Everything you need to<br />build faster.</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'AI Copy Generation', desc: 'Claude writes headline copy, body text, CTAs, and meta descriptions based on your brief — not generic templates.' },
              { title: 'Approval Gate', desc: "Every AI output goes through your review queue before anything ships. You're always the final decision-maker." },
              { title: 'Task Queue & History', desc: 'Track every site brief, run, revision, and approval in one place. Never lose context on a client project.' },
              { title: 'Cost & Speed Tracking', desc: 'See exactly how long each generation took and what it cost. Know your margins on every project.' },
              { title: 'Revision Workflow', desc: "Reject a run with notes, and Claude will revise based on your feedback. Iterate until it's right." },
              { title: 'Multi-Project', desc: 'Manage dozens of client projects simultaneously from a single cockpit. Each project gets its own isolated task queue.' },
            ].map(f => (
              <div key={f.title} className="flex gap-4 p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl hover:border-[#D4A017]/30 transition">
                <div className="w-2 h-2 rounded-full bg-[#D4A017] mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#D4A017] text-sm font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Simple, honest pricing.</h2>
          <p className="text-gray-400 mb-16 text-lg">No hidden fees. Cancel anytime. Credits roll over.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                badge: '5 CREDITS / DAY · 25 / MO',
                desc: 'For individuals exploring AI site generation.',
                features: [
                  '5 credits/day · 25/mo',
                  '25 exports/month',
                  'Single-file HTML output',
                  'Qwen 3 generation',
                  'Brand voice system prompt',
                  'Credit rollover',
                ],
                cta: 'Start Free',
                highlight: false,
                tier: null,
              },
              {
                name: 'Starter',
                price: '$12',
                period: '/mo',
                badge: '100 CREDITS + 5/DAY · ROLLOVER',
                desc: 'For freelancers building client sites regularly.',
                features: [
                  '~150 credits/month',
                  '~150 exports/month',
                  'Single-file HTML output',
                  'Qwen 3 + Claude fallback',
                  'Brand voice system prompt',
                  'Credits roll over',
                ],
                cta: 'Get Starter',
                highlight: true,
                tier: 'starter',
              },
              {
                name: 'Pro',
                price: '$40',
                period: '/mo',
                badge: '500 CREDITS / MO · FULL API',
                desc: 'For agencies running multiple client projects.',
                features: [
                  '500 credits/month',
                  '500 exports/month',
                  'Single-file HTML output',
                  'Qwen 3 + Claude fallback',
                  'Brand voice system prompt',
                  'Full API access',
                ],
                cta: 'Get Pro',
                highlight: false,
                tier: 'pro',
              },
              {
                name: 'Studio',
                price: '$90',
                period: '/mo',
                badge: 'UNLIMITED · WHITE-LABEL',
                desc: 'Unlimited exports, white-label, and reseller rights.',
                features: [
                  'Unlimited exports',
                  'Single-file HTML output',
                  'Qwen 3 + Claude fallback',
                  'Brand voice system prompt',
                  'Full API access',
                  'White-label + reseller rights',
                ],
                cta: 'Get Studio',
                highlight: false,
                tier: 'studio',
              },
            ].map(p => (
              <div
                key={p.name}
                className={`relative rounded-xl p-8 border flex flex-col ${
                  p.highlight
                    ? 'bg-[#D4A017] text-black border-[#D4A017]'
                    : 'bg-[#111111] text-white border-[#2A2A2A]'
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-[#D4A017] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#D4A017]">
                    Most Popular
                  </span>
                )}
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${p.highlight ? 'text-black/60' : 'text-[#D4A017]'}`}>
                  {p.badge}
                </p>
                <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${p.highlight ? 'text-black/70' : 'text-gray-300'}`}>
                  {p.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-5xl font-black">{p.price}</span>
                  <span className={`text-lg mb-2 ${p.highlight ? 'text-black/60' : 'text-gray-500'}`}>{p.period}</span>
                </div>
                <p className={`text-sm mb-6 ${p.highlight ? 'text-black/70' : 'text-gray-400'}`}>{p.desc}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleTierClick(p.tier)}
                  disabled={!!p.tier && loadingTier === p.tier}
                  className={`block w-full text-center font-bold py-3 rounded-lg transition disabled:opacity-60 ${
                    p.highlight
                      ? 'bg-black text-[#D4A017] hover:bg-black/80'
                      : 'bg-[#D4A017] text-black hover:bg-[#F0C040]'
                  }`}
                >
                  {p.tier && loadingTier === p.tier ? 'Loading…' : p.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Credit Packs */}
          <div className="border-t border-[#2A2A2A] pt-16">
            <p className="text-[#D4A017] text-sm font-semibold uppercase tracking-widest mb-2">No Subscription? No Problem.</p>
            <h3 className="text-3xl font-black mb-2">Pay-as-you-go credit packs</h3>
            <p className="text-gray-400 mb-10">Credits never expire. Stack them. Use them whenever.</p>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { pack: 'credits_50',  exports: 50,  price: '$15', rate: '$0.30 / export' },
                { pack: 'credits_150', exports: 150, price: '$35', rate: '$0.23 / export' },
                { pack: 'credits_500', exports: 500, price: '$99', rate: '$0.20 / export' },
              ].map(p => (
                <div key={p.pack} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-8 flex flex-col">
                  <p className="text-4xl font-black mb-1">{p.exports}</p>
                  <p className="text-gray-400 text-sm mb-4">Site Exports</p>
                  <p className="text-3xl font-black text-[#D4A017] mb-1">{p.price}</p>
                  <p className="text-gray-500 text-xs mb-8">{p.rate}</p>
                  <button
                    onClick={() => handlePackClick(p.pack)}
                    disabled={loadingPack === p.pack}
                    className="mt-auto w-full bg-[#D4A017] hover:bg-[#F0C040] text-black font-bold py-3 rounded-lg transition disabled:opacity-60"
                  >
                    {loadingPack === p.pack ? 'Loading…' : 'Buy Credits'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to build<br /><span className="text-[#D4A017]">faster?</span></h2>
          <p className="text-gray-400 text-lg mb-10">Join agencies already using NanoStudio to deliver more sites with less effort.</p>
          <Link to={dest} className="inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#F0C040] text-black font-bold px-10 py-4 rounded-lg text-lg transition">
            {user ? 'Go to Dashboard →' : 'Start Building Free →'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-black">NANO<span className="text-[#D4A017]">STUDIO</span></span>
          <p className="text-xs text-gray-600">© 2026 NanoStudio. All rights reserved. captivate.icu</p>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
            <a href="/terms" className="hover:text-white transition">Terms</a>
            <a href="mailto:support@captivate.icu" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
