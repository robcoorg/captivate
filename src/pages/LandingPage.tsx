import { Link } from 'react-router-dom'

export default function LandingPage() {
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
            <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition px-3 py-2">
              Sign In
            </Link>
            <Link to="/dashboard" className="text-sm font-semibold bg-[#D4A017] hover:bg-[#F0C040] text-black px-5 py-2 rounded transition">
              Start Free
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
            <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 bg-[#D4A017] hover:bg-[#F0C040] text-black font-bold px-8 py-4 rounded-lg text-base transition">
              Start Building Free →
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
              { title: 'Approval Gate', desc: 'Every AI output goes through your review queue before anything ships. You\'re always the final decision-maker.' },
              { title: 'Task Queue & History', desc: 'Track every site brief, run, revision, and approval in one place. Never lose context on a client project.' },
              { title: 'Cost & Speed Tracking', desc: 'See exactly how long each generation took and what it cost. Know your margins on every project.' },
              { title: 'Revision Workflow', desc: 'Reject a run with notes, and Claude will revise based on your feedback. Iterate until it\'s right.' },
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
          <p className="text-gray-400 mb-16 text-lg">Pay per project or go monthly. No hidden fees. Cancel anytime.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: '$49',
                period: '/mo',
                desc: 'For freelancers building 1–5 sites per month.',
                features: ['5 site briefs/month', '10 Claude runs', 'Approval gate', 'Project history'],
                cta: 'Get Started',
                highlight: false,
              },
              {
                name: 'Studio',
                price: '$149',
                period: '/mo',
                desc: 'For agencies running multiple client projects.',
                features: ['Unlimited briefs', '50 Claude runs', 'Full cockpit', 'Team access (3 seats)', 'Priority support'],
                cta: 'Start Free Trial',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                desc: 'For large teams with custom requirements.',
                features: ['Unlimited everything', 'Custom AI models', 'Dedicated support', 'SLA', 'On-premise option'],
                cta: 'Contact Us',
                highlight: false,
              },
            ].map(p => (
              <div key={p.name} className={`rounded-xl p-8 border ${p.highlight ? 'bg-[#D4A017] text-black border-[#D4A017]' : 'bg-[#111111] text-white border-[#2A2A2A]'}`}>
                <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${p.highlight ? 'text-black/70' : 'text-[#D4A017]'}`}>{p.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-5xl font-black">{p.price}</span>
                  <span className={`text-lg mb-2 ${p.highlight ? 'text-black/60' : 'text-gray-500'}`}>{p.period}</span>
                </div>
                <p className={`text-sm mb-6 ${p.highlight ? 'text-black/70' : 'text-gray-400'}`}>{p.desc}</p>
                <ul className="space-y-2 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard" className={`block text-center font-bold py-3 rounded-lg transition ${p.highlight ? 'bg-black text-[#D4A017] hover:bg-black/80' : 'bg-[#D4A017] text-black hover:bg-[#F0C040]'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#2A2A2A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to build<br /><span className="text-[#D4A017]">faster?</span></h2>
          <p className="text-gray-400 text-lg mb-10">Join agencies already using NanoStudio to deliver more sites with less effort.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-[#D4A017] hover:bg-[#F0C040] text-black font-bold px-10 py-4 rounded-lg text-lg transition">
            Start Building Free →
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
