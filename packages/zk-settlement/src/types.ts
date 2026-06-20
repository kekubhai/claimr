export type BountyId = string;
export type EscrowRef = string;
export type TxRef = string;
export type ProofBytes = Uint8Array;
export type PublicSignals = string[];

export enum BountyStatus {
  Active = "active",
  UnderReview = "under_review",
  Closed = "closed",
  Refunded = "refunded",
}

/**
 * SettlementAdapter — the only contract between ClaimR core and any chain.
 *
 * Every chain integration (Soroban, Ethereum, Solana, etc.) must implement
 * these four methods. No chain-specific types leak into this interface;
 * all data crosses the boundary as opaque bytes or plain strings.
 */
export interface SettlementAdapter {
  /** Lock reward amount against a bountyId.
   *  @param bountyId       unique identifier for the bounty
   *  @param commitmentHash poseidon / sha256 hash of the reward amount (hides actual value)
   *  @param amountOpaque   optional opaque encoding of the actual amount (e.g. encrypted for the evaluator)
   *  @returns a reference to the on-chain escrow record
   */
  lockReward(
    bountyId: BountyId,
    commitmentHash: string,
    amountOpaque: Uint8Array,
  ): Promise<EscrowRef>;

  /** Verify a ZK proof and, on success, release escrowed funds to the winner.
   *  The proof attests that the submitter is the wallet designated by the AI
   *  evaluator's signature AND that their nullifier has not been used before.
   *
   *  @param bountyId     the bounty being claimed
   *  @param proofBytes   chain-agnostic proof blob (opaque bytes)
   *  @param publicSignals the public inputs the proof was verified against:
   *                       [bountyId, nullifierHash, evaluatorSignatureHash]
   *  @returns a transaction / receipt reference
   */
  verifyAndPayout(
    bountyId: BountyId,
    proofBytes: ProofBytes,
    publicSignals: PublicSignals,
  ): Promise<TxRef>;

  /** Read the current status of a bounty. */
  getBountyStatus(bountyId: BountyId): Promise<BountyStatus>;

  /** Check whether a nullifier hash has already been consumed (prevents double-claims). */
  getNullifierStatus(nullifierHash: string): Promise<boolean>;
}

/** Shape of the data that the off-chain proof service returns. */
export interface ClaimProofOutput {
  proofBytes: ProofBytes;
  publicSignals: PublicSignals;
}
