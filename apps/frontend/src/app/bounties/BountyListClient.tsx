"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

/** Compute urgency metadata from a deadline timestamp */
function getUrgency(endDate: number) {
  const now = Date.now();
  const diff = endDate - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0)
    return { label: "EXPIRED", color: "#6B7280", border: "border-[#6B7280]/40", pulse: false };
  if (days <= 3)
    return { label: `${days}d LEFT`, color: "#EF4444", border: "border-red-500/60", pulse: true };
  if (days <= 7)
    return { label: `${days}d LEFT`, color: "#F59E0B", border: "border-amber-500/50", pulse: false };
  return { label: `${days}d LEFT`, color: "#22C55E", border: "border-[#1E1E2E]", pulse: false };
}

export default function BountyListClient() {
  // Fetch real data from Convex
  const dbBounties = useQuery(api.bountyFunctions.getAllBounties);

  // Schema-aligned mockups
  const mockBounties = [
    {
      _id: "mock-1",
      title: "DeFi Liquidity Dashboard Alerts",
      description: "Build a real-time dashboard to monitor liquidity pools and send WebSocket alerts based on specific threshold triggers.",
      amount: 1200,
      unit: "USDC",
      endDate: new Date("2026-05-01").getTime(),
      amountStatus: "ESCROWED",
      bountyStatus: "OPEN",
      bountySetter: "user_mock1",
    },
    {
      _id: "mock-2",
      title: "P2P Lending Smart Contract Security Audit",
      description: "Perform a comprehensive security audit on our v2 lending contracts. Focus on reentrancy and oracle manipulation.",
      amount: 2.5,
      unit: "ETH",
      endDate: new Date("2026-06-15").getTime(),
      amountStatus: "FUNDED",
      bountyStatus: "IN_PROGRESS",
      bountySetter: "user_mock2",
    },
    {
      _id: "mock-3",
      title: "Rust-based MEV Bot Indexer",
      description: "Create a highly optimized Rust indexer to track and categorize MEV extraction across multiple L2s.",
      amount: 3000,
      unit: "USDC",
      endDate: new Date("2026-04-20").getTime(),
      amountStatus: "ESCROWED",
      bountyStatus: "OPEN",
      bountySetter: "user_mock3",
    }
  ];

  const displayBounties = dbBounties && dbBounties.length > 0 ? dbBounties : mockBounties;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayBounties.map((bounty) => {
        const urgency = getUrgency(bounty.endDate);

        return (
          <div
            key={bounty._id}
            className={`${urgency.border} bg-black p-6 hover:border-[#22C55E]/50 transition-colors group flex flex-col relative overflow-hidden border`}
          >
            {/* Urgency Ribbon */}
            {urgency.label !== "EXPIRED" && (
              <div
                className={`absolute top-0 left-0 h-[2px] transition-all duration-700`}
                style={{
                  width: urgency.label.includes("LEFT") ? "100%" : "0%",
                  backgroundColor: urgency.color,
                }}
              />
            )}

            {/* Status + Urgency Badges */}
            <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
              <span
                className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${urgency.pulse ? "animate-pulse" : ""}`}
                style={{
                  color: urgency.color,
                  borderColor: `${urgency.color}66`,
                  backgroundColor: `${urgency.color}15`,
                }}
              >
                {urgency.label}
              </span>
              <span
                className={`text-[10px] uppercase tracking-widest px-2 py-1 border ${
                  bounty.bountyStatus === "OPEN"
                    ? "border-[#22C55E]/50 text-[#22C55E] bg-[#22C55E]/10"
                    : "border-white/20 text-white/50"
                }`}
              >
                {bounty.bountyStatus}
              </span>
            </div>

            {/* Reward Amount */}
            <div className="flex items-end gap-2 mb-4 mt-8">
              <span className="text-4xl font-bold text-[#22C55E] tabular-nums leading-none">
                {bounty.amount}
              </span>
              <span className="text-sm text-[#22C55E]/70 mb-0.5 font-bold">
                {bounty.unit}
              </span>
            </div>

            {/* Core Info */}
            <h3 className="text-xl font-bold text-white mb-3 leading-tight">
              {bounty.title}
            </h3>
            <p className="text-sm text-white/50 mb-8 line-clamp-3">
              {bounty.description}
            </p>

            {/* Footer details */}
            <div className="mt-auto border-t border-[#1E1E2E] pt-4 flex items-center justify-between">
              <div className="text-xs text-white/40 uppercase tracking-wider flex flex-col">
                <span className="mb-1 text-[10px] text-white/30">// DEADLINE</span>
                <span style={{ color: urgency.color }}>
                  {new Date(bounty.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
              </div>
              <Link
                href={`/bounties/${bounty._id}`}
                className="text-xs text-white hover:text-black hover:bg-[#22C55E] border border-transparent hover:border-[#22C55E] px-3 py-2 uppercase tracking-widest transition-colors"
              >
                [ View_Details ]
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}