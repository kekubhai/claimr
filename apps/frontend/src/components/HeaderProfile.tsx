"use client";

import { useState } from "react";

export default function HeaderProfile({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-10 w-10 border-2 border-[#1E1E2E] bg-[#12121A] overflow-hidden group-hover:border-[#22C55E] transition-colors">
          <img
            src={user?.picture || "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton"}
            alt="avatar"
          />
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-14 w-80 border border-[#1E1E2E] bg-[#0A0A0F] shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
            <div className="p-4 border-b border-[#1E1E2E] flex items-center gap-3 bg-[#12121A]">
              <div className="h-12 w-12 border border-[#22C55E] bg-[#0A0A0F] overflow-hidden shrink-0">
                <img
                  src={user?.picture || "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton"}
                  alt="avatar"
                />
              </div>
              <div className="overflow-hidden">
                <p className="font-mono text-sm text-[#22C55E] truncate">{user?.name || "root@student"}</p>
                <p className="text-xs text-white/40 truncate font-mono">{user?.email || "sys.admin@university.edu"}</p>
              </div>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">// Curriculum</h4>
                <p className="text-sm font-mono text-white/90">B.S. CompSci [Y3]</p>
                <p className="text-xs font-mono text-white/50 mt-1">Focus: Web3 & Systems</p>
                <div className="mt-2 text-xs font-mono text-[#22C55E]">GPA: 3.8 / 4.0</div>
              </div>

              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">// Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {["Solidity", "React", "Rust", "Node.js", "Crypto", "Go"].map((skill) => (
                    <span key={skill} className="border border-[#1E1E2E] bg-[#12121A] px-2 py-1 text-[10px] font-mono text-white/70 uppercase tracking-wider hover:border-[#22C55E] hover:text-[#22C55E] transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">// Network Links</h4>

                <div className="space-y-2">
                  <a href="#" className="flex items-center justify-between font-mono text-sm group/link hover:bg-[#12121A] -mx-2 px-2 py-2 rounded-none transition-colors border border-transparent hover:border-[#1E1E2E]">
                    <div className="flex items-center gap-3 text-white/70 group-hover/link:text-white">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                      gh/student
                    </div>
                    <span className="text-[#22C55E] text-xs font-mono">1.4k commits</span>
                  </a>

                  <a href="#" className="flex items-center justify-between font-mono text-sm group/link hover:bg-[#12121A] -mx-2 px-2 py-2 rounded-none transition-colors border border-transparent hover:border-[#1E1E2E]">
                    <div className="flex items-center gap-3 text-white/70 group-hover/link:text-white">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.187c-.467-.467-.662-1.111-.662-1.823 0-.713.195-1.357.662-1.824l2.697-2.608c.466-.467 1.111-.662 1.823-.662s1.357.195 1.824.662l4.332 4.187c.467.467.662 1.111.662 1.824 0 .712-.195 1.357-.662 1.824m-3.14-9.873l-1.07-1.034a.978.978 0 0 0-1.4 0l-5.694 5.503a.978.978 0 0 0 0 1.4l1.07 1.035a.978.978 0 0 0 1.4 0l5.694-5.504a.978.978 0 0 0 0-1.4M3.208 11.232l5.694-5.503a.978.978 0 0 1 1.4 0l1.07 1.034a.978.978 0 0 1 0 1.4L5.678 13.666a.978.978 0 0 1-1.4 0l-1.07-1.034a.978.978 0 0 1 0-1.4"></path></svg>
                      lc/student
                    </div>
                    <span className="text-[#22C55E] text-xs font-mono">top 8%</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1E1E2E] p-2 bg-[#12121A]">
              <a href="/auth/logout" className="block w-full text-center py-2 text-xs font-mono tracking-widest text-[#ef4444] hover:text-[#f87171] hover:bg-[#ef4444]/10 transition-colors">
                [ terminate_session ]
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}