"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderProfile from "./HeaderProfile";

const NAV_LINKS = [
  { label: "Bounties", href: "/bounties" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar({ user }: { user?: any }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1E1E2E] bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
        <Link
          href="/"
          className="text-lg font-bold uppercase tracking-widest cursor-pointer hover:text-[#22C55E] transition-colors"
        >
          CLAIMR
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm uppercase tracking-wider transition-colors ${
                  isActive
                    ? "text-[#22C55E]"
                    : "hover:text-white/70"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {user ? (
            <HeaderProfile user={user} />
          ) : (
            <Link
              href="/auth/login"
              className="border border-[#1E1E2E] px-4 py-2 text-sm uppercase tracking-wider hover:border-[#22C55E] hover:text-[#22C55E] transition-colors"
            >
              [ login ]
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
