"use client";

import { useState } from "react";

interface QAItem {
  id: string;
  author: string;
  question: string;
  timestamp: number;
  answer?: { author: string; text: string; timestamp: number };
}

// Demo Q&A data
const DEMO_QA: QAItem[] = [
  {
    id: "qa-1",
    author: "hunter_xyz",
    question: "Are there specific L2 networks that must be supported, or is the choice up to the implementer?",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    answer: {
      author: "bounty_setter",
      text: "Minimum requirement is Arbitrum and Optimism. Bonus points for Base and zkSync support.",
      timestamp: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
    },
  },
  {
    id: "qa-2",
    author: "dev_alice",
    question: "Is there a preferred testing framework, or can we use any (Hardhat, Foundry, etc.)?",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    answer: {
      author: "bounty_setter",
      text: "Foundry preferred but Hardhat is also acceptable. Please include at least 80% test coverage.",
      timestamp: Date.now() - 2.5 * 24 * 60 * 60 * 1000,
    },
  },
  {
    id: "qa-3",
    author: "newbie_bob",
    question: "Can the frontend be built with Vue.js instead of React?",
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function BountyQA() {
  const [items, setItems] = useState<QAItem[]>(DEMO_QA);
  const [newQuestion, setNewQuestion] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const q: QAItem = {
      id: `qa-${Date.now()}`,
      author: "you",
      question: newQuestion.trim(),
      timestamp: Date.now(),
    };
    setItems((prev) => [q, ...prev]);
    setNewQuestion("");
  };

  return (
    <div className="border border-[#1E1E2E] bg-[#0A0A0F]">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E] hover:bg-[#1E1E2E]/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#22C55E] uppercase tracking-widest font-bold">
            // Q&amp;A
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest border border-[#1E1E2E] px-2 py-0.5">
            {items.length} threads
          </span>
        </div>
        <span className="text-white/40 text-sm">{isExpanded ? "▲" : "▼"}</span>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-4">
          {/* Ask Question */}
          <form onSubmit={handleAsk} className="flex gap-3">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a clarification question..."
              className="flex-1 border border-[#1E1E2E] bg-transparent px-4 py-2 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!newQuestion.trim()}
              className="border border-[#22C55E] bg-[#22C55E]/10 px-4 py-2 text-xs text-[#22C55E] uppercase tracking-widest hover:bg-[#22C55E] hover:text-black transition-colors disabled:opacity-30"
            >
              Ask
            </button>
          </form>

          {/* Q&A Threads */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="border border-[#1E1E2E] bg-black">
                {/* Question */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#22C55E] border border-[#22C55E]/20 px-1.5 py-0.5">
                      Q
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-white/40">
                      {item.author}
                    </span>
                    <span className="text-[10px] text-white/20 ml-auto">
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{item.question}</p>
                </div>

                {/* Answer */}
                {item.answer ? (
                  <div className="border-t border-[#1E1E2E] bg-[#0A0A0F] px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-amber-400 border border-amber-400/20 px-1.5 py-0.5">
                        A
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">
                        {item.answer.author}
                      </span>
                      <span className="text-[10px] text-white/20 ml-auto">
                        {timeAgo(item.answer.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">{item.answer.text}</p>
                  </div>
                ) : (
                  <div className="border-t border-[#1E1E2E] px-4 py-2 text-[10px] text-white/20 uppercase tracking-widest">
                    Awaiting response from poster...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
