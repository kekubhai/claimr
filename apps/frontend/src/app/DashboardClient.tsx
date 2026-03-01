"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import HeaderProfile from "@/components/HeaderProfile";
import Typewriter from "@/components/Typewriter";
import CreateUserClient from "./CreateUserClient";
import UpdateProfileModal from "@/components/UpdateProfileModal";
import { useEffect, useState } from "react";

export default function DashboardClient({ sessionUser }: { sessionUser: any }) {
  const addToDb = useMutation(api.userFunctions.createUser);
  
  // 1. Add a state to track the mutation status
  const [isInitializing, setIsInitializing] = useState(true);

  // 2. Run the query normally at the top level
  const dashboardData = useQuery(
    api.userFunctions.getUserDetails,
    sessionUser?.email ? { email: sessionUser.email } : "skip"
  );

  // 3. Await the mutation inside useEffect, then drop the loading flag
  useEffect(() => {
    async function syncUser() {
      if (sessionUser?.email) {
        try {
          await addToDb({
            name: sessionUser?.name || "Unnamed Operative",
            email: sessionUser?.email,
          });
        } catch (error) {
          console.error("Failed to sync user:", error);
        } finally {
          // Whether it created a new user or the user already existed, we are done checking.
          setIsInitializing(false); 
        }
      } else {
        // If there's no session user at all, don't hang on the loading screen
        setIsInitializing(false);
      }
    }

    syncUser();
  }, [sessionUser, addToDb]);

  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // 4. Update your loading check to ALSO wait for isInitializing
  if (isInitializing || dashboardData === undefined) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-sm uppercase tracking-widest text-white/60">
          // fetching on-chain data...
        </p>
      </div>
    );
  }

  // If we get here, initialization is done. If it's STILL null, they really don't exist.
  if (dashboardData === null) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <p className="text-sm uppercase tracking-widest text-white/60">
          // 404_user_not_found
        </p>
        <a
          href="/auth/login"
          className="border border-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
        >
          [ Return to Login ]
        </a>
      </div>
    );
  }

  // ... rest of your component rendering
  const { name, bountiesGiven, bountiesSolved, githubUsername, walletAddress, TotalTokens } = dashboardData;

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
            <a href="/leaderboard" className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
              Leaderboard
            </a>
            <a href="/pricing" className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
              Pricing
            </a>
            {githubUsername ? (
              <a href={`/projects?gh=${githubUsername}`} className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
                Projects
              </a>
            ) : (
              <button onClick={() => setProfileModalOpen(true)} className="text-sm uppercase tracking-wider cursor-pointer hover:text-white/70 transition-colors">
                Projects
              </button>
            )}
            {sessionUser ? (
              <HeaderProfile user={sessionUser} />
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
        <CreateUserClient user={sessionUser} />
        <UpdateProfileModal
          email={sessionUser?.email}
          initialGithub={githubUsername}
          initialWallet={walletAddress}
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />

        {/* ── HEADER / STATS ── */}
        <section className="py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
                // welcome back
              </p>
              <h1 className="text-4xl font-bold uppercase leading-tight md:text-5xl mb-4 text-[#22C55E]">
                <Typewriter text={name || "OPERATIVE"} speed={100} />
              </h1>
              
              {/* Display GitHub and Wallet if they exist */}
              <div className="space-y-1 text-xs uppercase tracking-widest text-white/50">
                <p>GITHUB: {githubUsername ? `@${githubUsername}` : "NOT_LINKED"}</p>
                <p>WALLET: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "NOT_LINKED"}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <div className="text-right">
                <span className="text-xs uppercase tracking-widest text-white/50 block mb-1">TOTAL WEALTH</span>
                <span className="text-4xl font-bold tabular-nums text-white">{TotalTokens || 0} <span className="text-sm text-[#22C55E]">TKN</span></span>
              </div>
              <UpdateProfileModal 
                email={sessionUser.email} 
                initialGithub={githubUsername} 
                initialWallet={walletAddress} 
              />
            </div>
          </div>

          <div className="grid gap-px border border-white md:grid-cols-3 bg-white">
            <div className="bg-black p-6 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-white/50">Bounties Posted</span>
              <span className="text-4xl font-bold">{bountiesGiven.length}</span>
            </div>
            <div className="bg-black p-6 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-white/50">Bounties Solved</span>
              <span className="text-4xl font-bold">{bountiesSolved.length}</span>
            </div>
            <div className="bg-black p-6 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-white/50">Protocol Status</span>
              <span className="text-4xl font-bold text-[#22C55E]">ACTIVE</span>
            </div>
          </div>
        </section>

        <hr className="border-[#1E1E2E]" />

        {/* ── BOUNTIES SOLVED (HUNTER) ── */}
        <section className="py-16 md:py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
                // your claims
              </p>
              <h2 className="text-3xl font-bold uppercase md:text-4xl">
                ACTIVE PURSUITS
              </h2>
            </div>
          </div>

          {bountiesSolved.length === 0 ? (
            <div className="border border-[#1E1E2E] border-dashed p-12 text-center text-white/50 text-sm uppercase tracking-widest">
              No active bounties claimed. Go hunt.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {bountiesSolved.map((bounty: any) => (
                <BountyCard key={bounty._id} bounty={bounty} />
              ))}
            </div>
          )}
        </section>

        <hr className="border-[#1E1E2E]" />

        {/* ── BOUNTIES GIVEN (SETTER) ── */}
        <section className="py-16 md:py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
                // your escrow & reviews
              </p>
              <h2 className="text-3xl font-bold uppercase md:text-4xl">
                POSTED BOUNTIES
              </h2>
            </div>
          </div>

          {bountiesGiven.length === 0 ? (
            <div className="border border-[#1E1E2E] border-dashed p-12 text-center text-white/50 text-sm uppercase tracking-widest">
              No bounties posted yet. Fund a task.
            </div>
          ) : (
            <div className="grid gap-6">
              {bountiesGiven.map((bounty: any) => (
                <SetterBountyCard key={bounty._id} bountyId={bounty._id} fallback={bounty} />
              ))}
            </div>
          )}
        </section>

        <hr className="border-[#1E1E2E]" />

        <footer className="py-10 text-sm text-white/50 flex flex-col md:flex-row justify-between uppercase tracking-widest gap-4">
          <p>&copy; {new Date().getFullYear()} CLAIMR PROTOCOL.</p>
          <p>SYSTEM ONLINE</p>
        </footer>
      </div>
    </div>
  );
}

// ── NEW: UPDATE PROFILE MODAL COMPONENT ──


// ── SETTER BOUNTY CARD (Shows Submissions) ──
export function SetterBountyCard({ bountyId, fallback }: { bountyId: Id<"bounty">, fallback: any }) {
  const data = useQuery(api.bountyFunctions.getBountyDetailsAfterEnd, { bountyId });
  const acceptSolution = useMutation(api.bountyFunctions.acceptSolution);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const bounty = data || fallback;
  const solutions = data?.solutions || [];
  const isClosed = bounty.bountyStatus === "closed";

  const handleAccept = async (solutionId: Id<"solutions">) => {
    if (processingId || isClosed) return;
    
    setProcessingId(solutionId);
    try {
      await acceptSolution({ solutionId });
    } catch (error: any) {
      console.error("Failed to accept solution:", error);
      alert(error.message || "Failed to process transaction.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <article className={`border p-6 flex flex-col gap-4 transition-colors ${
      isClosed ? "border-[#22C55E]/30 bg-[#050A05]" : "border-[#1E1E2E] bg-[#0A0A0F]"
    }`}>
      <div className="flex justify-between items-start border-b border-[#1E1E2E] pb-4">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wide mb-2">
            {bounty.title}
          </h3>
          <p className="text-sm leading-relaxed text-white/50 line-clamp-2 max-w-3xl">
            {bounty.description}
          </p>
        </div>
        <div className="text-right ml-4">
          <span className={`block text-2xl font-bold whitespace-nowrap ${isClosed ? "text-white/30 line-through" : "text-[#22C55E]"}`}>
            {bounty.amount} {bounty.unit}
          </span>
          <span className={`text-[10px] uppercase tracking-widest ${isClosed ? "text-[#22C55E]" : "text-white/40"}`}>
            STATUS: {bounty.bountyStatus}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
          // Submitted Proofs ({solutions.length})
        </p>
        
        {solutions.length === 0 ? (
          <div className="border border-[#1E1E2E] border-dashed py-6 text-center text-[10px] uppercase tracking-widest text-white/30">
            Awaiting Hunter Submissions...
          </div>
        ) : (
          <div className="space-y-3">
            {solutions.map((sol: any) => {
              const isWinner = sol.status === "selected";
              const isProcessingThis = processingId === sol._id;

              return (
                <div 
                  key={sol._id} 
                  className={`border p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition-colors ${
                    isWinner ? "border-[#22C55E] bg-[#22C55E]/5" : "border-[#1E1E2E] bg-black"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 border uppercase tracking-widest ${
                        isWinner ? "border-[#22C55E] text-[#22C55E]" : "border-white/20 text-white/50"
                      }`}>
                        Hunter: {sol.hunterId.slice(-4)}
                      </span>
                      <a href={sol.proof} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline truncate max-w-[200px] md:max-w-xs block">
                        {sol.proof}
                      </a>
                    </div>
                    <p className={`text-xs p-2 border-l-2 ${
                      isWinner ? "bg-[#22C55E]/10 border-[#22C55E] text-white/90" : "bg-[#1E1E2E]/50 border-[#22C55E] text-white/70"
                    }`}>
                      <span className="text-[#22C55E] mr-2 font-bold">AI:</span> {sol.remarks}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <span className={`block text-2xl font-bold tabular-nums ${isWinner ? "text-[#22C55E]" : "text-white"}`}>
                        {sol.score}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">Score</span>
                    </div>
                    
                    {isWinner ? (
                      <div className="border border-[#22C55E] bg-[#22C55E] text-black px-4 py-2 text-xs uppercase tracking-widest font-bold">
                        WINNER
                      </div>
                    ) : !isClosed ? (
                      <button 
                        onClick={() => handleAccept(sol._id)}
                        disabled={processingId !== null}
                        className="border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-black px-4 py-2 text-xs uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessingThis ? "Processing..." : "Accept"}
                      </button>
                    ) : (
                      <div className="px-4 py-2 text-xs uppercase tracking-widest text-white/20">
                        Rejected
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

// ── REUSABLE BOUNTY CARD (For Hunter view) ──
function BountyCard({ bounty }: { bounty: any }) {
  return (
    <article className="group flex flex-col gap-4 border border-[#1E1E2E] bg-black p-6 cursor-pointer transition-colors hover:border-[#22C55E]">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold uppercase tracking-wide pr-4 group-hover:text-[#22C55E] transition-colors">
          {bounty.title}
        </h3>
        <span className="border border-[#1E1E2E] px-2 py-1 text-xs uppercase tracking-wider whitespace-nowrap group-hover:border-[#22C55E] group-hover:text-[#22C55E]">
          {bounty.amount} {bounty.unit}
        </span>
      </div>
      
      <p className="text-sm leading-relaxed text-white/50 line-clamp-2">
        {bounty.description}
      </p>
      
      <div className="mt-auto pt-6 flex justify-between items-center text-[10px] tracking-widest text-white/40 border-t border-[#1E1E2E] mt-4">
        <span>STATUS: {bounty.bountyStatus}</span>
        <span>DUE: {new Date(bounty.endDate).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "2-digit"
        })}</span>
      </div>
    </article>
  );
}


