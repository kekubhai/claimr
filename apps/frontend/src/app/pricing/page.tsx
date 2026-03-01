import { auth0 } from "@/lib/auth0";
import Navbar from "@/components/Navbar";

export default async function PricingPage() {
  let session = null;

  try {
    session = await auth0.getSession();
  } catch (error) {
    session = null;
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Navbar user={user} />

      {/* ── HERO ── */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:px-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">// subscription_model</p>
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
          ProofOfWork <span className="text-[#22C55E]">Pricing</span>
        </h1>
        <p className="text-white/50 max-w-2xl mx-auto text-sm leading-relaxed">
          Transaction fees prove the model works. Subscriptions prove companies are sticky.
          Placement fees prove we&apos;re not just a bounty board — we&apos;re a talent infrastructure company.
        </p>
      </section>

      {/* ── PRICING TIERS ── */}
      <section className="mx-auto max-w-6xl px-6 md:px-12 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* FREE */}
          <div className="border border-[#1E1E2E] rounded-none p-6 flex flex-col hover:border-white/20 transition-colors">
            <div className="mb-6">
              <span className="text-2xl">🆓</span>
              <h2 className="text-xl font-bold uppercase tracking-wider mt-2">Free</h2>
              <p className="text-xs uppercase tracking-widest text-white/40 mt-1">Solver Account</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-white/40 text-sm">/forever</span>
              </div>
            </div>
            <p className="text-xs text-white/50 mb-4">
              For students and freelancers solving bounties. The marketplace only works if the barrier to entry for talent is zero.
            </p>
            <ul className="space-y-2 text-sm text-white/70 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Full public bounty feed access
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Unlimited submissions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                AI feedback reports after every bounty
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Soulbound NFT minting on wins
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Public leaderboard profile
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Basic wallet portfolio page
              </li>
            </ul>
            <button className="mt-6 w-full border border-[#1E1E2E] py-3 text-sm uppercase tracking-wider hover:border-[#22C55E] hover:text-[#22C55E] transition-colors">
              [ Get Started Free ]
            </button>
          </div>

          {/* STARTER */}
          <div className="border border-[#1E1E2E] rounded-none p-6 flex flex-col hover:border-white/20 transition-colors">
            <div className="mb-6">
              <span className="text-2xl">🚀</span>
              <h2 className="text-xl font-bold uppercase tracking-wider mt-2">Starter</h2>
              <p className="text-xs uppercase tracking-widest text-white/40 mt-1">For Indie Devs &amp; Founders</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
            </div>
            <p className="text-xs text-white/50 mb-4">
              Solo technical operators posting occasional bounties. Up to 5 bounties per month with AI judging.
            </p>
            <ul className="space-y-2 text-sm text-white/70 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Post up to 5 bounties/month
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                AI judging pipeline (code, design, writing)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Basic submission analytics
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Standard support
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Bounty visible on public feed
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                5% platform fee on rewards
              </li>
            </ul>

            {/* Demo Data */}
            <div className="mt-4 border-t border-[#1E1E2E] pt-4">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">// demo_data</p>
              <div className="space-y-1 text-xs text-white/40">
                <p><span className="text-white/60">Company:</span> DevTools.io (2-person startup)</p>
                <p><span className="text-white/60">Monthly:</span> $49 + ~$11 fees = <span className="text-[#22C55E]">$60/mo</span></p>
                <p><span className="text-white/60">Tasks:</span> 3-4 small technical tasks</p>
              </div>
            </div>

            <button className="mt-6 w-full border border-[#1E1E2E] py-3 text-sm uppercase tracking-wider hover:border-[#22C55E] hover:text-[#22C55E] transition-colors">
              [ Start Starter ]
            </button>
          </div>

          {/* PRO */}
          <div className="border border-[#22C55E] rounded-none p-6 flex flex-col relative">
            <div className="absolute -top-3 left-6 bg-[#22C55E] text-black px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold">
              Popular
            </div>
            <div className="mb-6">
              <span className="text-2xl">💼</span>
              <h2 className="text-xl font-bold uppercase tracking-wider mt-2">Pro</h2>
              <p className="text-xs uppercase tracking-widest text-white/40 mt-1">For Startups &amp; Teams</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">$199</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
            </div>
            <p className="text-xs text-white/50 mb-4">
              Startups with regular technical needs and an interest in building a talent pipeline.
            </p>
            <ul className="space-y-2 text-sm text-white/70 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Unlimited bounty postings
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Full solver leaderboard with filters
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Private invite-only bounties
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Solver profile deep-dive
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Priority AI judging (within 2 hours)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Advanced analytics dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Dedicated Slack support
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Company branding on bounties
              </li>
            </ul>

            {/* Demo Data */}
            <div className="mt-4 border-t border-[#1E1E2E] pt-4">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">// demo_data</p>
              <div className="space-y-1 text-xs text-white/40">
                <p><span className="text-white/60">Company:</span> Stackr Labs (12-person Series A)</p>
                <p><span className="text-white/60">Monthly:</span> $199 + ~$120 fees = <span className="text-[#22C55E]">$319/mo</span></p>
                <p><span className="text-white/60">Vs. Upwork:</span> <span className="line-through">$1,800–2,500/mo</span></p>
                <p><span className="text-white/60">Savings:</span> <span className="text-[#22C55E]">~$1,500–2,200/mo</span></p>
              </div>
            </div>

            <button className="mt-6 w-full bg-[#22C55E] text-black py-3 text-sm uppercase tracking-wider font-bold hover:bg-[#16A34A] transition-colors">
              [ Start Pro ]
            </button>
          </div>

          {/* ENTERPRISE */}
          <div className="border border-[#1E1E2E] rounded-none p-6 flex flex-col hover:border-white/20 transition-colors">
            <div className="mb-6">
              <span className="text-2xl">🏢</span>
              <h2 className="text-xl font-bold uppercase tracking-wider mt-2">Enterprise</h2>
              <p className="text-xs uppercase tracking-widest text-white/40 mt-1">For Protocols &amp; Companies</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">$999</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
            </div>
            <p className="text-xs text-white/50 mb-4">
              Larger companies using ProofOfWork as a core part of their recruiting and development pipeline.
            </p>
            <ul className="space-y-2 text-sm text-white/70 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Everything in Pro
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Dedicated talent matching (top 10 solvers)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                ATS recruitment pipeline integration
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Full-time placement service
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Custom judging rubrics
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                White-labelled bounty pages
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                API access to leaderboard data
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                Quarterly talent pool reports
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22C55E] mt-0.5">›</span>
                SLA-backed support
              </li>
            </ul>

            {/* Demo Data */}
            <div className="mt-4 border-t border-[#1E1E2E] pt-4">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">// demo_data</p>
              <div className="space-y-1 text-xs text-white/40">
                <p><span className="text-white/60">Company:</span> Coinbase Dev Platform</p>
                <p><span className="text-white/60">Monthly:</span> $999 + ~$900 fees = <span className="text-[#22C55E]">$1,899/mo</span></p>
                <p><span className="text-white/60">Placement:</span> 12% of first-year salary</p>
                <p><span className="text-white/60">Year 1 Value:</span> <span className="text-[#22C55E]">~$37,188</span></p>
              </div>
            </div>

            <button className="mt-6 w-full border border-[#1E1E2E] py-3 text-sm uppercase tracking-wider hover:border-[#22C55E] hover:text-[#22C55E] transition-colors">
              [ Contact Sales ]
            </button>
          </div>
        </div>
      </section>

      {/* ── REVENUE STREAMS SUMMARY ── */}
      <section className="mx-auto max-w-6xl px-6 md:px-12 pb-16">
        <div className="border border-[#1E1E2E] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">// revenue_streams</p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Transaction Marketplace</p>
              <p className="text-2xl font-bold text-[#22C55E]">5%</p>
              <p className="text-xs text-white/40 mt-1">per win — immediate cash flow</p>
              <p className="text-[10px] text-white/30 mt-2">Gets us to break-even</p>
            </div>
            <div className="text-center border-x border-[#1E1E2E] px-6">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Subscription SaaS</p>
              <p className="text-2xl font-bold text-[#22C55E]">$49–$999</p>
              <p className="text-xs text-white/40 mt-1">recurring MRR</p>
              <p className="text-[10px] text-white/30 mt-2">Gets us to profitability</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Placement Fee</p>
              <p className="text-2xl font-bold text-[#22C55E]">12%</p>
              <p className="text-xs text-white/40 mt-1">of first year salary</p>
              <p className="text-[10px] text-white/30 mt-2">Gets us to Series A conversation</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MRR PROJECTIONS ── */}
      <section className="mx-auto max-w-6xl px-6 md:px-12 pb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">// mrr_projections</p>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Month 1 */}
          <div className="border border-[#1E1E2E] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Month 1</p>
            <p className="text-[10px] text-white/30 mb-4">Just Launched</p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex justify-between">
                <span>5 Starter × $49</span>
                <span className="text-white/80">$245</span>
              </div>
              <div className="flex justify-between">
                <span>1 Pro × $199</span>
                <span className="text-white/80">$199</span>
              </div>
              <div className="flex justify-between">
                <span>0 Enterprise</span>
                <span className="text-white/80">$0</span>
              </div>
              <div className="flex justify-between">
                <span>30 bounties × $8 avg fee</span>
                <span className="text-white/80">$240</span>
              </div>
              <div className="border-t border-[#1E1E2E] pt-2 flex justify-between font-bold text-white">
                <span>Total MRR</span>
                <span className="text-[#22C55E]">$684</span>
              </div>
            </div>
          </div>

          {/* Month 6 */}
          <div className="border border-[#1E1E2E] p-6">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Month 6</p>
            <p className="text-[10px] text-white/30 mb-4">Post ProductHunt Launch</p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex justify-between">
                <span>40 Starter × $49</span>
                <span className="text-white/80">$1,960</span>
              </div>
              <div className="flex justify-between">
                <span>12 Pro × $199</span>
                <span className="text-white/80">$2,388</span>
              </div>
              <div className="flex justify-between">
                <span>2 Enterprise × $999</span>
                <span className="text-white/80">$1,998</span>
              </div>
              <div className="flex justify-between">
                <span>400 bounties × $8 avg fee</span>
                <span className="text-white/80">$3,200</span>
              </div>
              <div className="flex justify-between">
                <span>2 placements × $12k</span>
                <span className="text-white/80">$24,000</span>
              </div>
              <div className="border-t border-[#1E1E2E] pt-2 flex justify-between font-bold text-white">
                <span>Total MRR</span>
                <span className="text-[#22C55E]">$9,546</span>
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>Incl. placements</span>
                <span>$33,546</span>
              </div>
            </div>
          </div>

          {/* Month 12 */}
          <div className="border border-[#22C55E]/30 p-6">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Month 12</p>
            <p className="text-[10px] text-white/30 mb-4">Established Marketplace</p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex justify-between">
                <span>150 Starter × $49</span>
                <span className="text-white/80">$7,350</span>
              </div>
              <div className="flex justify-between">
                <span>45 Pro × $199</span>
                <span className="text-white/80">$8,955</span>
              </div>
              <div className="flex justify-between">
                <span>10 Enterprise × $999</span>
                <span className="text-white/80">$9,990</span>
              </div>
              <div className="flex justify-between">
                <span>1,200 bounties × $9 avg fee</span>
                <span className="text-white/80">$10,800</span>
              </div>
              <div className="flex justify-between">
                <span>8 placements × $13k</span>
                <span className="text-white/80">$104,000</span>
              </div>
              <div className="border-t border-[#1E1E2E] pt-2 flex justify-between font-bold text-white">
                <span>Total MRR</span>
                <span className="text-[#22C55E]">$37,095</span>
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>ARR Run Rate</span>
                <span>$445,140</span>
              </div>
              <div className="flex justify-between text-xs text-[#22C55E]/70">
                <span>Year 1 Total Revenue</span>
                <span>$549,140</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LTV vs CAC ── */}
      <section className="mx-auto max-w-6xl px-6 md:px-12 pb-20">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6">// ltv_vs_cac</p>
        <div className="border border-[#1E1E2E] p-8">
          <div className="grid gap-4 md:grid-cols-4 text-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Tier</p>
              <div className="space-y-4">
                <p className="text-sm font-bold">Starter</p>
                <p className="text-sm font-bold">Pro</p>
                <p className="text-sm font-bold">Enterprise</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">CAC</p>
              <div className="space-y-4">
                <p className="text-sm text-white/60">~$15</p>
                <p className="text-sm text-white/60">~$80</p>
                <p className="text-sm text-white/60">~$400</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">LTV</p>
              <div className="space-y-4">
                <p className="text-sm text-white/60">$392</p>
                <p className="text-sm text-white/60">$2,786</p>
                <p className="text-sm text-white/60">~$50,000</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">LTV:CAC</p>
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#22C55E]">26:1</p>
                <p className="text-sm font-bold text-[#22C55E]">35:1</p>
                <p className="text-sm font-bold text-[#22C55E]">125:1</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-white/30 text-center mt-6">
            Anything above 3:1 is considered healthy. We&apos;re sitting at 26–125x — driven by free solver-side acquisition via NFT badge sharing and university networks.
          </p>
        </div>
      </section>

      {/* ── FOOTER QUOTE ── */}
      <section className="border-t border-[#1E1E2E] py-12 text-center">
        <p className="text-sm text-white/40 max-w-3xl mx-auto px-6 italic leading-relaxed">
          &quot;Transaction fees prove the model works. Subscriptions prove companies are sticky.
          Placement fees prove we&apos;re not just a bounty board — we&apos;re a talent infrastructure company.&quot;
        </p>
      </section>
    </div>
  );
}
