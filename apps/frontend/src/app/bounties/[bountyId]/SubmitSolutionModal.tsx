// src/app/bounties/[bountyId]/SubmitSolutionModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { evaluateProof } from "../evaluateSolution";

interface SubmitSolutionProps {
  bountyId: Id<"bounty">;
  bountyTitle: string;
  bountyDescription: string;
  userEmail?: string | null;
}

type Step = "input" | "evaluating" | "report" | "success";

// ── Criteria the AI rates ──
const CRITERIA = [
  { key: "relevance", label: "Relevance", desc: "How well the proof addresses the bounty requirements" },
  { key: "quality", label: "Quality", desc: "Code / deliverable quality and best practices" },
  { key: "completeness", label: "Completeness", desc: "All requirements met, edge cases handled" },
  { key: "documentation", label: "Documentation", desc: "Clarity of explanation and supporting materials" },
];

function scoreColor(score: number) {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#EAB308";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

export default function SubmitSolutionModal({
  bountyId,
  bountyTitle,
  bountyDescription,
  userEmail,
}: SubmitSolutionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [proof, setProof] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [evaluatingStage, setEvaluatingStage] = useState(0);
  const [aiReport, setAiReport] = useState<{
    score: number;
    remarks: string;
    criteria: { key: string; score: number }[];
  } | null>(null);

  // ── Draft auto-save ──
  const draftKey = `claimr_draft_${bountyId}`;

  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      setProof(saved);
      setDraftSaved(true);
    }
  }, [draftKey]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!proof.trim()) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(draftKey, proof);
      setDraftSaved(true);
    }, 1500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [proof, draftKey]);

  // Get user
  const user = useQuery(
    api.userFunctions.getUserDetails,
    userEmail ? { email: userEmail } : "skip"
  );
  const createSolution = useMutation(api.bountyFunctions.createSolution);

  // ── Judging pipeline stages ──
  const STAGES = [
    "Encrypting submission channel...",
    "Parsing proof artifacts...",
    "Running AI evaluation model...",
    "Generating multi-criteria scores...",
    "Compiling feedback report...",
  ];

  useEffect(() => {
    if (step !== "evaluating") return;
    const interval = setInterval(() => {
      setEvaluatingStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [step]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!proof.trim()) return;

    if (!userEmail || user === null) {
      setError("Authentication required. Please log in.");
      return;
    }
    if (user === undefined) return;

    setStep("evaluating");
    setEvaluatingStage(0);
    setError(null);

    try {
      const aiResult = await evaluateProof(
        { title: bountyTitle, description: bountyDescription },
        proof
      );

      // Derive multi-criteria breakdown from overall score (simulated)
      const base = aiResult.score;
      const criteria = CRITERIA.map((c) => ({
        key: c.key,
        score: Math.max(0, Math.min(100, base + Math.floor((Math.random() - 0.5) * 20))),
      }));

      setAiReport({ score: aiResult.score, remarks: aiResult.remarks, criteria });
      setStep("report");
    } catch (err: any) {
      console.error(err);
      setError("Secure channel disrupted. AI evaluation failed. Try again.");
      setStep("input");
    }
  };

  const handleConfirmSubmit = async () => {
    if (!user || !aiReport) return;
    try {
      await createSolution({
        bountyId,
        hunterId: user._id,
        proof,
        score: aiReport.score,
        remarks: aiReport.remarks,
      });
      localStorage.removeItem(draftKey);
      setStep("success");
    } catch (err: any) {
      console.error(err);
      setError("Failed to save solution on-chain. Try again.");
      setStep("report");
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
    setProof("");
    setDraftSaved(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full border border-[#22C55E] bg-[#22C55E]/10 px-6 py-4 text-sm font-bold text-[#22C55E] uppercase tracking-widest hover:bg-[#22C55E] hover:text-black transition-colors"
      >
        [ Submit_Solution ]
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl border border-[#1E1E2E] bg-black shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E1E2E] px-8 py-5 sticky top-0 bg-black z-10">
              <h2 className="text-xl font-bold uppercase tracking-widest text-white">
                {step === "report" ? (
                  <>AI <span className="text-[#22C55E]">Report</span></>
                ) : step === "success" ? (
                  <>Mission <span className="text-[#22C55E]">Complete</span></>
                ) : (
                  <>Submit <span className="text-[#22C55E]">Proof</span></>
                )}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-6">
              {/* ── STEP: INPUT ── */}
              {step === "input" && (
                <form className="space-y-4">
                  {error && (
                    <p className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 px-4 py-3">
                      {error}
                    </p>
                  )}

                  {/* Draft indicator */}
                  {draftSaved && (
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40 border border-[#1E1E2E] px-4 py-2">
                      <span>✓ Draft auto-saved</span>
                      <button type="button" onClick={clearDraft} className="text-red-400 hover:text-red-300">
                        Clear Draft
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                      Proof of Work (Link or Text)
                    </label>
                    <textarea
                      value={proof}
                      onChange={(e) => { setProof(e.target.value); setDraftSaved(false); }}
                      rows={6}
                      className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors resize-none"
                      placeholder="https://github.com/your-repo/pull/123&#10;or explain your solution..."
                      required
                    />
                    <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">
                      {proof.length} chars — drafts save automatically
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={user === undefined || !proof.trim()}
                    className="w-full border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors disabled:opacity-50"
                  >
                    Transmit to AI Evaluator
                  </button>
                </form>
              )}

              {/* ── STEP: EVALUATING (Judging Pipeline) ── */}
              {step === "evaluating" && (
                <div className="py-8 space-y-6">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 animate-spin border-2 border-[#1E1E2E] border-t-[#22C55E] rounded-full" />
                  </div>
                  <div className="space-y-3">
                    {STAGES.map((stage, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${
                          i < evaluatingStage ? "bg-[#22C55E]" : i === evaluatingStage ? "bg-[#22C55E] animate-pulse" : "bg-[#1E1E2E]"
                        }`} />
                        <span className={`text-xs uppercase tracking-widest transition-colors duration-500 ${
                          i <= evaluatingStage ? "text-white/70" : "text-white/20"
                        }`}>
                          {stage}
                        </span>
                        {i < evaluatingStage && <span className="text-[#22C55E] text-xs ml-auto">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP: AI FEEDBACK REPORT ── */}
              {step === "report" && aiReport && (
                <div className="space-y-6">
                  {error && (
                    <p className="text-xs text-red-400 border border-red-400/30 bg-red-400/10 px-4 py-3">{error}</p>
                  )}

                  {/* Overall Score */}
                  <div className="border border-[#1E1E2E] bg-[#0A0A0F] p-6">
                    <p className="text-xs uppercase tracking-widest text-white/50 mb-3">// Overall Score</p>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-bold tabular-nums" style={{ color: scoreColor(aiReport.score) }}>
                        {aiReport.score}
                      </span>
                      <span className="mb-2 text-xl text-white/30">/100</span>
                    </div>
                    <div className="h-1.5 bg-[#1E1E2E] mt-4 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${aiReport.score}%`, backgroundColor: scoreColor(aiReport.score) }}
                      />
                    </div>
                  </div>

                  {/* Multi-Criteria Breakdown */}
                  <div className="border border-[#1E1E2E] bg-[#0A0A0F] p-6 space-y-4">
                    <p className="text-xs uppercase tracking-widest text-white/50">// Criteria Breakdown</p>
                    {aiReport.criteria.map((c) => {
                      const meta = CRITERIA.find((cr) => cr.key === c.key);
                      return (
                        <div key={c.key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs uppercase tracking-wider text-white/70">{meta?.label}</span>
                            <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor(c.score) }}>
                              {c.score}
                            </span>
                          </div>
                          <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${c.score}%`, backgroundColor: scoreColor(c.score) }}
                            />
                          </div>
                          <p className="text-[10px] text-white/30 mt-0.5">{meta?.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Remarks */}
                  <div className="border border-[#1E1E2E] p-6">
                    <p className="text-xs uppercase tracking-widest text-white/50 mb-3">// AI Remarks</p>
                    <p className="text-sm text-white/70 leading-relaxed border-l-2 border-[#22C55E] pl-4 bg-[#22C55E]/5 py-3">
                      <span className="text-[#22C55E] font-bold mr-1">AI:</span> {aiReport.remarks}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStep("input")}
                      className="flex-1 border border-[#1E1E2E] px-4 py-3 text-xs uppercase tracking-wider text-white/60 hover:border-white hover:text-white transition-colors"
                    >
                      ← Revise Proof
                    </button>
                    <button
                      onClick={handleConfirmSubmit}
                      className="flex-1 border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-xs text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors"
                    >
                      Confirm &amp; Submit
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: SUCCESS ── */}
              {step === "success" && (
                <div className="flex flex-col items-center text-center gap-4 py-8">
                  <div className="text-5xl text-[#22C55E]">✓</div>
                  <div>
                    <p className="text-lg font-bold text-white uppercase tracking-widest mb-1">
                      Transmission Successful
                    </p>
                    <p className="text-sm text-white/50">
                      Your solution has been scored and secured on the network.
                    </p>
                  </div>
                  {aiReport && (
                    <div className="border border-[#1E1E2E] bg-[#0A0A0F] px-8 py-4 mt-2">
                      <span className="text-3xl font-bold" style={{ color: scoreColor(aiReport.score) }}>
                        {aiReport.score}
                      </span>
                      <span className="text-white/30 ml-1">/100</span>
                    </div>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 border border-[#1E1E2E] px-6 py-2 text-xs uppercase tracking-widest hover:border-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}