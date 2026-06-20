"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function LeaderboardClient() {
  const rankings = useQuery(api.bountyFunctions.getRankings);
  const [revealMode, setRevealMode] = useState(false);
  const [expandedSolver, setExpandedSolver] = useState<string | null>(null);

  if (rankings === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="h-12 w-12 animate-spin border-2 border-[#1E1E2E] border-t-[#22C55E] rounded-full" />
        <p className="text-sm uppercase tracking-widest text-white/50 animate-pulse">
          // DECRYPTING NETWORK RANKS...
        </p>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="border border-[#1E1E2E] border-dashed p-16 text-center text-white/50 text-sm uppercase tracking-widest">
        No operatives found on the network.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="border-b border-[#1E1E2E] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-4">
              Global <span className="text-[#22C55E]">Rankings</span>
            </h1>
            <p className="text-white/50 max-w-2xl leading-relaxed text-sm uppercase tracking-wider">
              {revealMode
                ? "// IDENTITIES REVEALED — WALLET ADDRESSES AND EARNINGS VISIBLE."
                : "// SHIELDED MODE — SOLVER IDENTITY PROTECTED. RANK AND BADGES ONLY."}
            </p>
          </div>

          {/* Shield toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-[10px] uppercase tracking-widest ${revealMode ? "text-red-400" : "text-[#22C55E]"}`}>
              {revealMode ? "Revealed" : "Shielded"}
            </span>
            <button
              onClick={() => setRevealMode(!revealMode)}
              className={`relative w-12 h-6 rounded-full border transition-colors ${
                revealMode ? "bg-red-500/20 border-red-500" : "bg-[#22C55E]/20 border-[#22C55E]"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                  revealMode ? "bg-red-500 left-[25px]" : "bg-[#22C55E] left-[2px]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="border border-[#1E1E2E] bg-[#0A0A0F]">
        {/* Table Header */}
        <div className="hidden md:flex items-center px-6 py-4 border-b border-[#1E1E2E] text-xs uppercase tracking-widest text-white/40">
          <div className="w-16">Rank</div>
          <div className="flex-1">Operative</div>
          <div className="w-24 text-right">Badge</div>
          {revealMode && <div className="w-48 text-right">Wallet / Earnings</div>}
          {!revealMode && <div className="w-24 text-right">Status</div>}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#1E1E2E]">
          {rankings.map((user, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const isExpanded = expandedSolver === user._id;

            return (
              <div key={user._id}>
                <div
                  className={`flex items-center px-6 py-4 transition-colors hover:bg-[#1E1E2E]/30 cursor-pointer ${
                    rank === 1 ? "bg-[#22C55E]/5 border-l-2 border-l-[#22C55E]" : "border-l-2 border-l-transparent"
                  }`}
                  onClick={() => setExpandedSolver(isExpanded ? null : user._id)}
                >
                  {/* Rank Number */}
                  <div className={`w-12 md:w-16 text-lg font-bold tabular-nums ${
                    rank === 1 ? "text-[#22C55E]" :
                    rank === 2 ? "text-white/90" :
                    rank === 3 ? "text-white/70" : "text-white/40"
                  }`}>
                    #{rank < 10 ? `0${rank}` : rank}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold uppercase tracking-wider ${isTop3 ? "text-white" : "text-white/80"}`}>
                        {revealMode
                          ? (user.name || "UNKNOWN_OPERATIVE")
                          : (user.name || "UNKNOWN_OPERATIVE")
                        }
                      </span>
                      {rank === 1 && (
                        <span className="border border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 text-[10px] uppercase tracking-widest hidden md:inline-block">
                          APEX HUNTER
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                      {revealMode ? (
                        <>
                          ID: {user._id.slice(-8)}
                          {user.githubUsername && ` // GITHUB: @${user.githubUsername}`}
                        </>
                      ) : (
                        <>
                          ID: 0x...{user._id.slice(-4)}
                          <span className="text-[#22C55E] ml-2">[SHIELDED]</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badge / Status column */}
                  {!revealMode && (
                    <div className="w-24 text-right">
                      {isTop3 ? (
                        <span className="border border-[#22C55E] text-[#22C55E] text-[10px] px-2 py-0.5 uppercase tracking-widest">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">
                          PROVEN
                        </span>
                      )}
                    </div>
                  )}

                  {/* Wallet / Earnings (reveal mode only) */}
                  {revealMode && (
                    <div className="w-32 md:w-48 text-right">
                      <span className={`text-2xl font-bold tabular-nums ${
                        isTop3 ? "text-[#22C55E]" : "text-white/70"
                      }`}>
                        {user.TotalTokens || 0}
                      </span>
                      <span className="hidden md:inline-block text-[10px] text-[#22C55E]/50 uppercase tracking-widest ml-2">
                        TKN
                      </span>
                      {user.walletAddress && (
                        <div className="text-[10px] text-white/30 font-mono mt-0.5">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Expandable proof-of-completion badge detail */}
                {isExpanded && !revealMode && (
                  <div className="border-t border-[#1E1E2E] bg-black px-6 py-4">
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span className="border border-[#22C55E]/30 bg-[#22C55E]/5 text-[#22C55E] px-3 py-1 text-[10px] uppercase tracking-widest">
                        ✓ PROOF_OF_COMPLETION
                      </span>
                      <span className="text-white/30">
                        Bounties solved: {user.TotalTokens ? Math.floor(user.TotalTokens / 100) : 0}
                      </span>
                      <span className="text-white/30 ml-auto text-[10px]">
                        {user.walletAddress
                          ? `Wallet: ${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)} (reveal on)`
                          : "Wallet: NOT_LINKED"
                        }
                      </span>
                    </div>
                    <p className="text-[10px] text-white/20 mt-2 uppercase tracking-widest">
                      // Rank determined by shielded aggregate score. Exact earnings hidden until solver opts to reveal.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
