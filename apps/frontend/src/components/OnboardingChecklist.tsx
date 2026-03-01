"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href?: string;
  action?: string;
}

const CHECKLIST: ChecklistItem[] = [
  {
    id: "profile",
    label: "Complete Your Profile",
    description: "Add your GitHub username and wallet address",
    action: "profile",
  },
  {
    id: "browse",
    label: "Browse Bounties",
    description: "Explore available bounties and find your match",
    href: "/bounties",
  },
  {
    id: "submit",
    label: "Submit Your First Solution",
    description: "Pick a bounty and submit a proof of work",
    href: "/bounties",
  },
  {
    id: "leaderboard",
    label: "Check the Leaderboard",
    description: "See where top hunters rank",
    href: "/leaderboard",
  },
  {
    id: "post",
    label: "Post a Bounty",
    description: "Fund a task and let the community build it",
    href: "/bounties",
  },
];

export default function OnboardingChecklist({
  onEditProfile,
  hasGithub,
  hasWallet,
}: {
  onEditProfile?: () => void;
  hasGithub?: boolean;
  hasWallet?: boolean;
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("claimr_onboarding");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompleted(new Set(parsed.completed || []));
      setDismissed(parsed.dismissed || false);
    }
  }, []);

  // Auto-mark profile step
  useEffect(() => {
    if (hasGithub && hasWallet && !completed.has("profile")) {
      toggleComplete("profile");
    }
  }, [hasGithub, hasWallet]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(
        "claimr_onboarding",
        JSON.stringify({ completed: Array.from(next), dismissed })
      );
      return next;
    });
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(
      "claimr_onboarding",
      JSON.stringify({ completed: Array.from(completed), dismissed: true })
    );
  };

  if (dismissed) return null;

  const progress = Math.round((completed.size / CHECKLIST.length) * 100);

  return (
    <div className="border border-[#22C55E]/30 bg-[#050A05]">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#22C55E]/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#22C55E] uppercase tracking-widest font-bold">
            // Getting Started
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest">
            {completed.size}/{CHECKLIST.length} complete
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-1 bg-[#1E1E2E] overflow-hidden rounded-full">
            <div
              className="h-full bg-[#22C55E] transition-all duration-700 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-white/40 text-sm">{isExpanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-2">
          {CHECKLIST.map((item) => {
            const done = completed.has(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 border px-4 py-3 transition-colors ${
                  done
                    ? "border-[#22C55E]/20 bg-[#22C55E]/5"
                    : "border-[#1E1E2E] bg-black hover:border-[#22C55E]/30"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(item.id)}
                  className={`h-5 w-5 flex-shrink-0 border flex items-center justify-center transition-colors ${
                    done
                      ? "border-[#22C55E] bg-[#22C55E] text-black"
                      : "border-[#1E1E2E] hover:border-[#22C55E]"
                  }`}
                >
                  {done && <span className="text-xs">✓</span>}
                </button>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold uppercase tracking-wider ${done ? "text-white/40 line-through" : "text-white"}`}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">
                    {item.description}
                  </p>
                </div>

                {/* Action */}
                {!done && item.href && (
                  <Link
                    href={item.href}
                    className="text-[10px] text-[#22C55E] uppercase tracking-widest border border-[#22C55E]/30 px-3 py-1 hover:bg-[#22C55E] hover:text-black transition-colors flex-shrink-0"
                  >
                    Go →
                  </Link>
                )}
                {!done && item.action === "profile" && onEditProfile && (
                  <button
                    onClick={onEditProfile}
                    className="text-[10px] text-[#22C55E] uppercase tracking-widest border border-[#22C55E]/30 px-3 py-1 hover:bg-[#22C55E] hover:text-black transition-colors flex-shrink-0"
                  >
                    Edit →
                  </button>
                )}
              </div>
            );
          })}

          {/* Dismiss */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleDismiss}
              className="text-[10px] text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors"
            >
              Dismiss checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
