"use client";

import { useState } from "react";

// ── Mock data for demo ──
const MONTHLY_STATS = [
  { month: "Oct", solved: 1, posted: 0, earned: 120 },
  { month: "Nov", solved: 3, posted: 1, earned: 850 },
  { month: "Dec", solved: 2, posted: 0, earned: 400 },
  { month: "Jan", solved: 5, posted: 2, earned: 2100 },
  { month: "Feb", solved: 4, posted: 1, earned: 1600 },
  { month: "Mar", solved: 7, posted: 3, earned: 3200 },
];

// Last 28 days streak (1 = active, 0 = inactive)
const STREAK_DATA = [
  1,0,1,1,1,0,0,1,1,1,1,0,1,1,
  1,1,0,0,1,1,1,1,1,0,1,1,1,1,
];

const LEARNING_PATH = [
  { label: "Beginner Bounties", target: 3, current: 3, done: true },
  { label: "Intermediate Bounties", target: 5, current: 4, done: false },
  { label: "Multi-Chain Tasks", target: 2, current: 1, done: false },
  { label: "Advanced / Expert", target: 3, current: 0, done: false },
  { label: "AI / ML Specialization", target: 2, current: 0, done: false },
];

function BarChart({ data }: { data: typeof MONTHLY_STATS }) {
  const maxVal = Math.max(...data.map((d) => d.solved + d.posted), 1);

  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((d) => {
        const solvedH = (d.solved / maxVal) * 100;
        const postedH = (d.posted / maxVal) * 100;
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "100px" }}>
              <div className="w-full flex flex-col justify-end h-full gap-px">
                <div
                  className="w-full bg-[#22C55E] transition-all duration-500"
                  style={{ height: `${solvedH}%`, minHeight: d.solved ? "4px" : "0" }}
                />
                <div
                  className="w-full bg-[#22C55E]/30 transition-all duration-500"
                  style={{ height: `${postedH}%`, minHeight: d.posted ? "4px" : "0" }}
                />
              </div>
            </div>
            <span className="text-[10px] text-white/40 uppercase">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ProgressTracker({
  solvedCount,
  postedCount,
  totalEarned,
}: {
  solvedCount: number;
  postedCount: number;
  totalEarned: number;
}) {
  const [activeTab, setActiveTab] = useState<"activity" | "streak" | "path">("activity");

  const currentStreak = (() => {
    let count = 0;
    for (let i = STREAK_DATA.length - 1; i >= 0; i--) {
      if (STREAK_DATA[i]) count++;
      else break;
    }
    return count;
  })();

  return (
    <div className="border border-[#1E1E2E] bg-[#0A0A0F]">
      {/* Header */}
      <div className="border-b border-[#1E1E2E] px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm text-[#22C55E] uppercase tracking-widest font-bold">
          // Progress Tracker
        </h3>
        <div className="flex gap-1">
          {(["activity", "streak", "path"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] uppercase tracking-widest px-3 py-1 border transition-colors ${
                activeTab === tab
                  ? "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10"
                  : "border-[#1E1E2E] text-white/40 hover:text-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* ── ACTIVITY TAB ── */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-[#1E1E2E] p-3 text-center">
                <span className="block text-2xl font-bold text-[#22C55E] tabular-nums">{solvedCount}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Solved</span>
              </div>
              <div className="border border-[#1E1E2E] p-3 text-center">
                <span className="block text-2xl font-bold text-white tabular-nums">{postedCount}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Posted</span>
              </div>
              <div className="border border-[#1E1E2E] p-3 text-center">
                <span className="block text-2xl font-bold text-[#22C55E] tabular-nums">{totalEarned}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Earned</span>
              </div>
            </div>

            {/* Bar Chart */}
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Monthly Activity</p>
              <BarChart data={MONTHLY_STATS} />
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#22C55E]" />
                  <span className="text-[10px] text-white/40">Solved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#22C55E]/30" />
                  <span className="text-[10px] text-white/40">Posted</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STREAK TAB ── */}
        {activeTab === "streak" && (
          <div className="space-y-6">
            {/* Current Streak */}
            <div className="border border-[#22C55E]/30 bg-[#22C55E]/5 p-6 text-center">
              <span className="block text-5xl font-bold text-[#22C55E] tabular-nums">{currentStreak}</span>
              <span className="text-xs text-white/50 uppercase tracking-widest mt-1 block">Day Streak 🔥</span>
            </div>

            {/* Streak Grid (28 days) */}
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Last 28 Days</p>
              <div className="grid grid-cols-7 gap-1">
                {STREAK_DATA.map((active, i) => (
                  <div
                    key={i}
                    className={`aspect-square border transition-colors ${
                      active
                        ? "bg-[#22C55E] border-[#22C55E]/50"
                        : "bg-[#1E1E2E]/30 border-[#1E1E2E]"
                    }`}
                    title={`Day ${i + 1}: ${active ? "Active" : "Inactive"}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-white/20 uppercase tracking-widest">
                <span>4 weeks ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        )}

        {/* ── LEARNING PATH TAB ── */}
        {activeTab === "path" && (
          <div className="space-y-4">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Suggested learning milestones
            </p>
            {LEARNING_PATH.map((step, i) => {
              const pct = Math.round((step.current / step.target) * 100);
              return (
                <div key={i} className={`border p-4 ${step.done ? "border-[#22C55E]/30 bg-[#22C55E]/5" : "border-[#1E1E2E] bg-black"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {step.done ? (
                        <span className="text-[#22C55E] text-sm">✓</span>
                      ) : (
                        <span className="text-white/20 text-sm">○</span>
                      )}
                      <span className={`text-xs uppercase tracking-wider ${step.done ? "text-white/50 line-through" : "text-white/80"}`}>
                        {step.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/40 tabular-nums">
                      {step.current}/{step.target}
                    </span>
                  </div>
                  <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#22C55E] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
