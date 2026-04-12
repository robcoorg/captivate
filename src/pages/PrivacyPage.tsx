import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Outfit']">
      <header className="border-b border-[#2A2A2A] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-black tracking-tight">
            NANO<span className="text-[#D4A017]">STUDIO</span>
          </Link>
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition">← Home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: April 12, 2026</p>

        <div className="space-y-10 text-gray-400 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Who we are</h2>
            <p>NanoStudio is operated by Captivate ICU ("we", "us", "our"). We provide an AI-powered website builder accessible at captivate.icu. To contact us: <a href="mailto:support@captivate.icu" className="text-[#D4A017] hover:underline">support@captivate.icu</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information we collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-white">Account data:</strong> email address and hashed password when you register.</li>
              <li><strong className="text-white">Billing data:</strong> Stripe handles all payment card data. We store your Stripe customer ID and subscription status only.</li>
              <li><strong className="text-white">Usage data:</strong> project briefs, AI task inputs/outputs, credit usage, and approval decisions you create inside the app.</li>
              <li><strong className="text-white">Technical data:</strong> IP address, browser type, and server access logs retained for up to 90 days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How we use your information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To provide, operate, and improve the NanoStudio service.</li>
              <li>To process payments and manage your subscription via Stripe.</li>
              <li>To send transactional emails (account confirmation, receipts, payment alerts).</li>
              <li>To send product and marketing emails — you may unsubscribe at any time via the link in any email.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data sharing</h2>
            <p className="mb-3">We do not sell your data. We share data only with:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-white">Stripe</strong> — payment processing (<a href="https://stripe.com/privacy" className="text-[#D4A017] hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>).</li>
              <li><strong className="text-white">Anthropic</strong> — AI generation; your brief content is sent to Anthropic's API per their <a href="https://www.anthropic.com/privacy" className="text-[#D4A017] hover:underline" target="_blank" rel="noopener noreferrer">privacy policy</a>.</li>
              <li><strong className="text-white">Resend</strong> — transactional email delivery.</li>
              <li><strong className="text-white">AWS</strong> — hosting infrastructure (App Runner, RDS).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data retention</h2>
            <p>We retain your account and project data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Your rights</h2>
            <p>Depending on your location you may have the right to access, correct, export, or delete your personal data. To exercise any right, email <a href="mailto:support@captivate.icu" className="text-[#D4A017] hover:underline">support@captivate.icu</a>. We respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
            <p>We use a single httpOnly session cookie (<code className="text-[#D4A017] bg-[#1A1A1A] px-1 rounded">ns_session</code>) to keep you signed in. No third-party tracking cookies are set by NanoStudio.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Security</h2>
            <p>Passwords are hashed with bcrypt (12 rounds). All traffic is encrypted via TLS. We follow industry-standard security practices, but no system is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Changes to this policy</h2>
            <p>We may update this policy. Material changes will be communicated via email. Continued use after the effective date constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact</h2>
            <p><a href="mailto:support@captivate.icu" className="text-[#D4A017] hover:underline">support@captivate.icu</a></p>
          </section>

        </div>
      </main>

      <footer className="border-t border-[#2A2A2A] py-6 px-6 text-center">
        <p className="text-xs text-gray-600">© 2026 NanoStudio · <Link to="/terms" className="hover:text-white transition">Terms</Link></p>
      </footer>
    </div>
  )
}
