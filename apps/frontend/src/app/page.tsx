import { auth0 } from "@/lib/auth0";
import Typewriter from "@/components/Typewriter";
import HeaderProfile from "@/components/HeaderProfile";
import GlowButton from "@/components/ui/GlowButton";

const projects = [
  {
    title: "CLAIMR PROTOCOL",
    desc: "On-chain bounty settlement layer with escrow, dispute resolution, and automated payouts.",
    tags: ["Solidity", "Hardhat", "Ethereum"],
  },
  {
    title: "PROOF-OF-WORK ENGINE",
    desc: "Submission verification pipeline — validates deliverables against bounty specs using LLM scoring.",
    tags: ["TypeScript", "Next.js", "OpenAI"],
  },
  {
    title: "BOUNTY MATCHER",
    desc: "Embedding-based recommendation system that pairs solvers with relevant open bounties.",
    tags: ["Python", "FastAPI", "Embeddings"],
  },
  {
    title: "CLAIMR CLI",
    desc: "Terminal tool for submitting claims, checking bounty status, and managing wallet connections.",
    tags: ["Rust", "CLI", "Web3"],
  },
  {
    title: "NFT BADGE SYSTEM",
    desc: "Soulbound achievement tokens minted on-chain when solvers hit milestones.",
    tags: ["ERC-721", "IPFS", "Metadata"],
  },
  {
    title: "DASHBOARD UI",
    desc: "Minimal monochrome interface for browsing bounties, tracking earnings, and viewing leaderboards.",
    tags: ["Next.js", "Tailwind", "Auth0"],
  },
];

const navLinks = ["About", "Projects", "Contact"];

export default async function DashboardPage() {
  let session = null;

  try {
    session = await auth0.getSession();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Invalid Compact JWE")) {
      session = null;
    } else {
      throw error;
    }
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1E1E2E] bg-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <a href="#" className="text-lg font-bold uppercase tracking-widest cursor-pointer hover:text-[#22C55E] transition-colors">
            CLAIMR
          </a>
          <div className="flex items-center gap-6">
            <a href="/bounties" className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
              Bounties
            </a>
            <a href="/projects" className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
              Projects
            </a>
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors"
              >
                {link}
              </a>
            ))}
            {user ? (
              <HeaderProfile user={user} />
            ) : (
              <a
                href="/auth/login"
                className="border border-[#1E1E2E] px-4 py-2 text-sm uppercase tracking-wider cursor-pointer hover:border-[#22C55E] hover:text-[#22C55E] transition-colors"
              >
                [ login ]
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        {/* ── HERO ── */}
        <section className="py-24 md:py-32">
          <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
            elcome
          </p>
          <h1 className="text-5xl font-bold uppercase leading-tight md:text-7xl">
            <Typewriter text="CLAIMR" speed={120} />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Claim bounties. Ship proof. Get paid.&nbsp;
            <br />
            On-chain settlement for real work.
          </p>
          <div className="mt-10 flex gap-4">
            <GlowButton href="/bounties">
              View Bounties
            </GlowButton>
            <GlowButton href="#contact">
              Contact Us
            </GlowButton>
          </div>
        </section>

        <hr className="border-white" />

        {/* ── ABOUT ── */}
        <section id="about" className="py-20 md:py-24">
          <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
            // about
          </p>
          <h2 className="mb-8 text-3xl font-bold uppercase md:text-4xl">
            WHAT IS CLAIMR
          </h2>
          <div className="max-w-2xl space-y-6 text-base leading-relaxed text-white/80">
            <p>
              Claimr is an on-chain bounty protocol. Companies post tasks — code,
              design, writing, research — and solvers claim them by shipping real
              deliverables.
            </p>
            <p>
              Every submission is verified. Every payout is automated. No
              middlemen, no invoices, no waiting 30 days for a wire transfer.
              Just work, proof, and payment.
            </p>
            <p>
              Built for developers, designers, and independent contributors who
              want to get paid for what they ship — not what they promise.
            </p>
          </div>
        </section>

        <hr className="border-white" />

        {/* ── PROJECTS ── */}
        <section id="projects" className="py-20 md:py-24">
          <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
            // projects
          </p>
          <h2 className="mb-10 text-3xl font-bold uppercase md:text-4xl">
            WHAT WE BUILD
          </h2>
          <div className="grid gap-px border border-white md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group flex flex-col gap-4 border border-white bg-black p-6 cursor-pointer transition-colors hover:bg-white hover:text-black"
              >
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/70 group-hover:text-black/70">
                  {project.desc}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-white px-2 py-1 text-xs uppercase tracking-wider group-hover:border-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <hr className="border-white" />

        {/* ── CONTACT ── */}
        <section id="contact" className="py-20 md:py-24">
          <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
            // contact
          </p>
          <h2 className="mb-10 text-3xl font-bold uppercase md:text-4xl">
            GET IN TOUCH
          </h2>
          <form
            action="#"
            method="POST"
            className="max-w-lg space-y-6"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm uppercase tracking-wider"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full border border-white bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:bg-white focus:text-black transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full border border-white bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:bg-white focus:text-black transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm uppercase tracking-wider"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Your message..."
                className="w-full border border-white bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:bg-white focus:text-black transition-colors resize-none"
              />
            </div>
            <GlowButton type="submit">
              Send Message
            </GlowButton>
          </form>
        </section>

        <hr className="border-white" />

        {/* ── FOOTER ── */}
        <footer className="py-10 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} CLAIMR. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}