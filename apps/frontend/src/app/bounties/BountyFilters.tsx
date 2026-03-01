"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = ["All", "Web3", "Frontend", "Backend", "AI / ML", "Design", "Writing"];
const DIFFICULTIES = ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert"];

type HardcodedBounty = {
  id: string;
  title: string;
  company: string;
  category: string;
  difficulty: string;
  reward: string;
  tags: string[];
};

export default function BountyFilters({ bounties }: { bounties: HardcodedBounty[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBounties = bounties.filter((bounty) => {
    const matchesCategory = activeCategory === "All" || bounty.category === activeCategory;
    const matchesDifficulty = activeDifficulty === "All Levels" || bounty.difficulty === activeDifficulty;
    const matchesSearch = 
      bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bounty.company.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <>
      <div className="space-y-6 mb-8 border-b border-[#1E1E2E] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white/80">// Community Bounty Board</h2>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search parameters..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#12121A] border border-[#1E1E2E] px-4 py-2 text-sm text-white focus:outline-none focus:border-[#22C55E] placeholder:text-white/20 transition-colors w-full md:w-64"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 text-sm">
          {/* Category Filter */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#22C55E] font-bold">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`border px-3 py-1 text-xs uppercase tracking-widest transition-colors ${
                    activeCategory === cat 
                      ? "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]" 
                      : "border-[#1E1E2E] text-white/50 hover:border-white/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-px bg-[#1E1E2E]" />

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-[#22C55E] font-bold">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  onClick={() => setActiveDifficulty(diff)}
                  className={`border px-3 py-1 text-xs uppercase tracking-widest transition-colors ${
                    activeDifficulty === diff 
                      ? "border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]" 
                      : "border-[#1E1E2E] text-white/50 hover:border-white/30"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render filtered results */}
      <div className="space-y-4">
        {filteredBounties.length === 0 ? (
          <div className="border border-[#1E1E2E] bg-[#12121A] p-12 text-center text-white/40 font-mono text-sm uppercase tracking-widest">
            // ERR: NO_TARGETS_FOUND
          </div>
        ) : (
          filteredBounties.map((bounty) => (
            <div key={bounty.id} className="border border-[#1E1E2E] bg-[#12121A] flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 hover:border-white/30 transition-colors gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-white/50 uppercase tracking-widest">{bounty.company}</span>
                  <span className="w-1 h-1 bg-[#1E1E2E] rounded-full"></span>
                  <span className={`text-[10px] uppercase font-bold tracking-widest 
                    ${bounty.difficulty === 'Beginner' ? 'text-blue-400' : 
                      bounty.difficulty === 'Intermediate' ? 'text-yellow-400' : 
                      bounty.difficulty === 'Advanced' ? 'text-orange-400' : 'text-red-400'}`}>
                    {bounty.difficulty}
                  </span>
                  <span className="w-1 h-1 bg-[#1E1E2E] rounded-full"></span>
                  <span className="text-[10px] uppercase tracking-widest text-[#22C55E]/70">{bounty.category}</span>
                </div>
                <h3 className="text-lg font-bold text-white/90 mb-3">{bounty.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {bounty.tags.map((tag: string) => (
                    <span key={tag} className="border border-[#1E1E2E] bg-black px-2 py-0.5 text-[10px] text-white/60 uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-4 md:gap-3 border-t md:border-t-0 border-[#1E1E2E] pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Reward</p>
                  <p className="text-lg font-bold text-[#22C55E]">{bounty.reward}</p>
                </div>
                <Link 
                  href={`/bounties/${bounty.id}`}
                  className="border border-[#1E1E2E] px-6 py-2 text-xs text-white uppercase tracking-widest hover:border-[#22C55E] hover:text-[#22C55E] transition-colors whitespace-nowrap"
                >
                  View &gt;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}