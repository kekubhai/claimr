import type { ProofBytes, PublicSignals, BountyId } from "./types.js";

export interface ClaimProofResult {
  proofBytes: ProofBytes;
  publicSignals: PublicSignals;
}

/**
 * generateClaimProof — the only entry point for proof generation.
 *
 * This function is chain-agnostic. It wraps the Noir/Circom proof system
 * and returns opaque bytes + public signals that any SettlementAdapter
 * can verify.
 *
 * In production this would shell out to `nargo prove` or call a Barretenberg
 * proving backend. For this hackathon we simulate the proof structure so the
 * integration boundaries are fully wired and testable end-to-end.
 */
export async function generateClaimProof(
  bountyId: BountyId,
  solverSecret: string,
  evaluatorSig: string,
): Promise<ClaimProofResult> {
  // ── 1. Compute public signals ──────────────────────────────────
  // These must match the Noir circuit's public inputs exactly.
  const nullifierHash = await poseidonHash([solverSecret, bountyId]);
  const evaluatorSignatureHash = await poseidonHash([evaluatorSig, bountyId]);

  const publicSignals: PublicSignals = [
    bountyId,
    nullifierHash,
    evaluatorSignatureHash,
  ];

  // ── 2. "Prove" — in a real build this invokes:
  //      `nargo prove --prover-name claimr_eligibility --input ...`
  //    and reads back `proof.dat` + `public.json`.
  //    Here we produce a deterministic stub so the pipeline can be tested.
  const proofBytes = new Uint8Array(
    Buffer.from(JSON.stringify({ solverSecret, evaluatorSig, bountyId }), "utf-8"),
  );

  return { proofBytes, publicSignals };
}

// ── Stand-in for the Poseidon hash used in the Noir circuit ────────
// In production, use `circomlibjs` poseidon or the Barretenberg WASM.
async function poseidonHash(inputs: string[]): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputs.join("::"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}`;
}
