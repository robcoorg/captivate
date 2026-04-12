import { Link } from 'react-router-dom'

export default function TermsPage() {
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
        <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: April 12, 2026</p>

        <div className="space-y-10 text-gray-400 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Agreement</h2>
            <p>By creating an account or using NanoStudio at captivate.icu, you agree to these Terms of Service. If you do not agree, do not use the service. NanoStudio is operated by Captivate ICU.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. The service</h2>
            <p>NanoStudio provides an AI-assisted website generation tool. You submit briefs; we generate draft content using third-party AI models (Anthropic Claude, Qwen). All AI output requires your review and approval before use. We make no guarantee that generated content is accurate, complete, or suitable for any particular purpose.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Accounts</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You must be 18 or older to create an account.</li>
              <li>You are responsible for keeping your credentials secure.</li>
              <li>One account per person. Do not share accounts.</li>
              <li>We may suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Billing and refunds</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Subscriptions are billed monthly in advance via Stripe.</li>
              <li>Credit packs are one-time purchases and non-refundable once credits are consumed.</li>
              <li>You may cancel your subscription any time; access continues until the end of the paid period.</li>
              <li>We reserve the right to change pricing with 30 days notice to existing subscribers.</li>
              <li>Refund requests are evaluated case-by-case — email <a href="mailto:support@captivate.icu" className="text-[#D4A017] hover:underline">support@captivate.icu</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Acceptable use</h2>
            <p className="mb-3">You may not use NanoStudio to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Generate content that is unlawful, defamatory, obscene, or infringes third-party rights.</li>
              <li>Attempt to reverse engineer, scrape, or overload our systems.</li>
              <li>Resell or sublicense the service without a Studio plan or written agreement.</li>
              <li>Use AI-generated output to impersonate real people or organizations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Intellectual property</h2>
            <p>You own the briefs you submit and the final approved content you export. NanoStudio retains ownership of the platform, software, and underlying models. AI-generated drafts that you have not approved or exported are not your property.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, NanoStudio is provided "as is" without warranty of any kind. We are not liable for indirect, incidental, or consequential damages arising from use of the service. Our total liability shall not exceed the amount you paid us in the 12 months prior to the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Termination</h2>
            <p>Either party may terminate at any time. On termination, your right to access the service ends. We will retain your data for 30 days before deletion unless legally required to keep it longer.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Governing law</h2>
            <p>These terms are governed by the laws of the United States. Disputes shall be resolved by binding arbitration, except where prohibited by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Changes</h2>
            <p>We may update these terms. Material changes will be communicated by email at least 14 days in advance. Continued use constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact</h2>
            <p><a href="mailto:support@captivate.icu" className="text-[#D4A017] hover:underline">support@captivate.icu</a></p>
          </section>

        </div>
      </main>

      <footer className="border-t border-[#2A2A2A] py-6 px-6 text-center">
        <p className="text-xs text-gray-600">© 2026 NanoStudio · <Link to="/privacy" className="hover:text-white transition">Privacy</Link></p>
      </footer>
    </div>
  )
}
