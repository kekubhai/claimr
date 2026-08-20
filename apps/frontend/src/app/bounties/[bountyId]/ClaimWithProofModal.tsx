"use client";

import { useState } from "react";

interface ClaimWithProofProps {
  bountyId: string;
  bountyTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "generate" | "submitting" | "success" | "error";

export default function ClaimWithProofModal({
  bountyId,
  bountyTitle,
  isOpen,
  onClose,
}: ClaimWithProofProps) {
  const [step, setStep] = useState<Step>("generate");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txRef, setTxRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateAndClaim = async () => {
    setStep("submitting");
    setErrorMsg(null);

    try {
      // In production this calls: generateClaimProof() from @claimr/zk-settlement
      // then submits the proof to the SettlementAdapter.
      //
      // For now, simulate a successful ZK claim flow.
      await new Promise((r) => setTimeout(r, 2500));

      setTxRef(`zk_tx_${bountyId}_${Date.now()}`);
      setStep("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Proof generation or verification failed.");
      setStep("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg border border-[#1E1E2E] bg-black shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E1E2E] px-8 py-5">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">
            Shielded <span className="text-[#22C55E]">Claim</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          {step === "generate" && (
            <>
              <div className="border border-[#1E1E2E] bg-[#0A0A0F] p-6">
                <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
                  // Zero-Knowledge Claim
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  Your identity and earnings remain shielded. A ZK proof attests you
                  are the winner without revealing your wallet or the exact reward
                  amount to the public ledger.
                </p>
              </div>

              <div className="text-xs text-white/40 uppercase tracking-widest space-y-2 border border-[#1E1E2E] p-4">
                <div className="flex justify-between">
                  <span>Target</span>
                  <span className="text-[#22C55E]">{bountyTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bounty ID</span>
                  <span className="text-white/70 font-mono">{bountyId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Proof System</span>
                  <span className="text-white/70">Groth16 (BN254)</span>
                </div>
                <div className="flex justify-between">
                  <span>Chain</span>
                  <span className="text-white/70">Stellar/Soroban</span>
                </div>
              </div>

              <button
                onClick={handleGenerateAndClaim}
                className="w-full border border-[#22C55E] bg-[#22C55E]/10 px-6 py-4 text-sm font-bold text-[#22C55E] uppercase tracking-widest hover:bg-[#22C55E] hover:text-black transition-colors"
              >
                [ Generate_Proof_and_Claim ]
              </button>
            </>
          )}

          {step === "submitting" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-12 w-12 animate-spin border-2 border-[#1E1E2E] border-t-[#22C55E] rounded-full" />
              <p className="text-sm text-white/70 uppercase tracking-widest animate-pulse">
                Generating ZK proof & verifying on-chain...
              </p>
              <div className="text-xs text-white/40 space-y-1">
                <p>✓ Computing witness</p>
                <p>✓ Proving circuit constraints</p>
                <p className="animate-pulse text-[#22C55E]">
                  ▸ Submitting to SettlementAdapter
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="text-5xl text-[#22C55E]">✓</div>
              <div>
                <p className="text-lg font-bold text-white uppercase tracking-widest mb-1">
                  Claim Verified
                </p>
                <p className="text-sm text-white/50">
                  Your ZK proof was accepted. Escrow released.
                </p>
              </div>
              {txRef && (
                <div className="border border-[#22C55E]/30 bg-[#22C55E]/5 px-6 py-3">
                  <p className="text-[10px] text-[#22C55E]/60 uppercase tracking-widest mb-1">
                    Transaction Ref
                  </p>
                  <p className="text-sm font-mono text-[#22C55E]">{txRef}</p>
                </div>
              )}
              <button
                onClick={onClose}
                className="mt-4 border border-[#1E1E2E] px-6 py-2 text-xs uppercase tracking-widest hover:border-white transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="text-5xl text-red-500">✕</div>
              <div>
                <p className="text-lg font-bold text-red-500 uppercase tracking-widest mb-1">
                  Proof Rejected
                </p>
                <p className="text-sm text-white/50">{errorMsg}</p>
              </div>
              <button
                onClick={() => setStep("generate")}
                className="border border-[#1E1E2E] px-6 py-2 text-xs uppercase tracking-widest hover:border-white transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
