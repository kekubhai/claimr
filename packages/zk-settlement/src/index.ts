export type {
  BountyId,
  EscrowRef,
  TxRef,
  ProofBytes,
  PublicSignals,
  SettlementAdapter,
} from "./types.js";

export { BountyStatus } from "./types.js";

export { generateClaimProof, type ClaimProofResult } from "./proof-service.js";

export { SorobanAdapter } from "./adapters/soroban.js";
