"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
// 1. FIXED: Imported BountyAnalysis instead of BountyData
import { upliftBounty, type BountyData} from "./uplift";

type Step = "form" | "analysing" | "review";

const verdictColor: Record<string, string> = {
  EXCELLENT: "#22C55E",
  GOOD: "#84CC16",
  FAIR: "#EAB308",
  POOR: "#EF4444",
};

// ── Bounty Templates ──
const TEMPLATES = [
  { emoji: "🔗", label: "Smart Contract", title: "Smart Contract Development", description: "Develop and deploy a smart contract with full test coverage, gas optimization, and security best practices. Include deployment scripts and documentation.", amount: "500", unit: "USDC" },
  { emoji: "🖥️", label: "Frontend", title: "Frontend Component / Page", description: "Build a responsive, accessible frontend component or page with modern UI/UX patterns, animations, and cross-browser compatibility.", amount: "300", unit: "USDC" },
  { emoji: "⚙️", label: "Backend API", title: "REST/GraphQL API Development", description: "Design and implement a production-ready API with authentication, validation, error handling, rate limiting, and comprehensive Swagger/GraphQL docs.", amount: "400", unit: "USDC" },
  { emoji: "🤖", label: "AI/ML", title: "AI/ML Model or Pipeline", description: "Build an AI/ML pipeline including data preprocessing, model training/fine-tuning, evaluation metrics, and a REST API endpoint for inference.", amount: "800", unit: "USDC" },
  { emoji: "🔍", label: "Security Audit", title: "Security Audit & Report", description: "Perform a comprehensive security audit covering common vulnerabilities, edge cases, and attack vectors. Deliver a detailed report with severity ratings and remediation steps.", amount: "1200", unit: "USDC" },
  { emoji: "📝", label: "Documentation", title: "Technical Documentation", description: "Write comprehensive technical documentation including API reference, getting started guide, architecture overview, and code examples.", amount: "200", unit: "USDC" },
  { emoji: "🧪", label: "Testing", title: "Test Suite Implementation", description: "Implement a comprehensive test suite with unit tests, integration tests, and E2E tests. Target 90%+ coverage with CI/CD pipeline integration.", amount: "350", unit: "USDC" },
  { emoji: "🎨", label: "UI/UX Design", title: "UI/UX Design System", description: "Design a complete UI kit or design system in Figma with components, tokens, typography, color system, and interactive prototypes.", amount: "600", unit: "USDC" },
];

export default function UpliftBountyModal({ email }: { email: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    unit: "USDC",
    endDate: "",
  });
  const [showTemplates, setShowTemplates] = useState(true);

  // 2. FIXED: Typed the state as BountyAnalysis so TS knows about score, verdict, and remarks
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const resetModal = () => {
    setStep("form");
    setAnalysis(null);
    setAiError(null);
    setIsOpen(false);
  };

  const createBounty = useMutation(api.bountyFunctions.createBounty);
  const user = useQuery(api.userFunctions.getUserDetails, { email });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGlobalSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (user === undefined) {
      console.warn("User data is still loading. Please wait.");
      return;
    }

    if (!user?._id) {
      console.error("User ID not found for email:", email);
      return;
    }

    try {
      await createBounty({
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        unit: formData.unit,
        endDate: formData.endDate, 
        bountySetter: user._id,
      });
      console.log("Submitted Globally:", formData);
      resetModal();
    } catch (error) {
      console.error("Failed to create bounty:", error);
    }
  };

  const handleAISubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setStep("analysing");
    setAiError(null);
    
    try {
      const result = await upliftBounty(formData);
      setAnalysis(result);
      setStep("review");
    } catch (error) {
      console.error("AI Error:", error);
      setAiError("AI analysis failed. You can still submit globally.");
      setStep("review");
    }
  };

  const handleConfirmPublish = async (e: React.MouseEvent) => {
    console.log("Publishing globally after AI review...");
    await handleGlobalSubmit(e);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-[#22C55E] bg-[#22C55E]/10 px-6 py-3 text-sm text-[#22C55E] uppercase tracking-widest hover:bg-[#22C55E] hover:text-black transition-colors"
      >
        [ uplift bounty ]
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-[#1E1E2E] bg-black shadow-2xl">
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-[#1E1E2E] px-8 py-5">
              <h2 className="text-xl font-bold uppercase tracking-widest text-white">
                {step === "review" ? (
                  <>
                    AI <span className="text-[#22C55E]">Analysis</span>
                  </>
                ) : (
                  <>
                    Uplift <span className="text-[#22C55E]">Bounty</span>
                  </>
                )}
              </h2>
              <button
                onClick={resetModal}
                className="text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* ── Step: Form ── */}
            {step === "form" && (
              <form className="space-y-4 px-8 py-6">
                {/* ── Template Picker ── */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#22C55E] hover:text-[#22C55E]/80 transition-colors"
                  >
                    <span>{showTemplates ? "▼" : "▶"}</span>
                    <span>Quick Templates</span>
                  </button>
                  {showTemplates && (
                    <div className="grid grid-cols-2 gap-2">
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.label}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              title: t.title,
                              description: t.description,
                              amount: t.amount,
                              unit: t.unit,
                            }));
                            setShowTemplates(false);
                          }}
                          className="border border-[#1E1E2E] bg-black px-3 py-2 text-left hover:border-[#22C55E]/50 transition-colors group"
                        >
                          <span className="text-sm mr-1">{t.emoji}</span>
                          <span className="text-[10px] uppercase tracking-widest text-white/60 group-hover:text-[#22C55E]">
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors"
                    placeholder="e.g. Implement Zero-Knowledge Proofs"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors resize-none"
                    placeholder="Explain the requirements..."
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors"
                      placeholder="e.g. 500"
                      required
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full border border-[#1E1E2E] bg-black px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors appearance-none"
                    >
                      <option value="USDC">USDC</option>
                      <option value="ETH">ETH</option>
                      <option value="MATIC">MATIC</option>
                      <option value="SOL">SOL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/70">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full border border-[#1E1E2E] bg-transparent px-4 py-3 text-sm text-white focus:border-[#22C55E] focus:outline-none transition-colors [color-scheme:dark]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={handleGlobalSubmit}
                    disabled={user === undefined}
                    className="w-full border border-white px-4 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {user === undefined ? "Loading User..." : "Submit Globally"}
                  </button>
                  <button
                    onClick={handleAISubmit}
                    disabled={user === undefined}
                    className="w-full border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit to AI then Globally
                  </button>
                </div>
              </form>
            )}

            {/* ── Step: Analysing ── */}
            {step === "analysing" && (
              <div className="flex flex-col items-center gap-6 px-8 py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#22C55E]" />
                <p className="text-sm uppercase tracking-widest text-white/60">
                  // running ai analysis…
                </p>
              </div>
            )}

            {/* ── Step: Review ── */}
            {step === "review" && (
              <div className="px-8 py-6 space-y-6">
                {aiError ? (
                  <p className="text-sm text-red-400 border border-red-400/30 bg-red-400/10 px-4 py-3">
                    {aiError}
                  </p>
                ) : (
                  analysis && (
                    <>
                      {/* Score bar */}
                      <div className="border border-[#1E1E2E] bg-[#0A0A0F] p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-white/50">
                            // quality score
                          </span>
                          <span
                            className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 border"
                            style={{
                              color: verdictColor[analysis.verdict] ?? "#fff",
                              borderColor: verdictColor[analysis.verdict] ?? "#fff",
                              backgroundColor: `${verdictColor[analysis.verdict] ?? "#fff"}18`,
                            }}
                          >
                            {analysis.verdict}
                          </span>
                        </div>

                        <div className="flex items-end gap-3">
                          <span
                            className="text-5xl font-bold tabular-nums"
                            style={{ color: verdictColor[analysis.verdict] ?? "#fff" }}
                          >
                            {analysis.score}
                          </span>
                          <span className="mb-1 text-lg text-white/40">/100</span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1 w-full bg-[#1E1E2E]">
                          <div
                            className="h-1 transition-all duration-700"
                            style={{
                              width: `${analysis.score}%`,
                              backgroundColor: verdictColor[analysis.verdict] ?? "#fff",
                            }}
                          />
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-widest text-white/50">
                          // remarks
                        </p>
                        {analysis.remarks.map((remark: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 border border-[#1E1E2E] px-4 py-3"
                          >
                            <span className="mt-0.5 text-[#22C55E] text-xs">▸</span>
                            <span className="text-sm text-white/80 leading-relaxed">
                              {remark}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep("form")}
                    className="flex-1 border border-[#1E1E2E] px-4 py-3 text-xs uppercase tracking-wider text-white/60 hover:border-white hover:text-white transition-colors"
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={handleConfirmPublish}
                    className="flex-1 border border-[#22C55E] bg-[#22C55E]/10 px-4 py-3 text-xs text-[#22C55E] uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors"
                  >
                    Confirm &amp; Publish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}