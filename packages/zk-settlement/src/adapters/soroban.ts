import {
  type BountyId,
  type EscrowRef,
  type TxRef,
  type ProofBytes,
  type PublicSignals,
  type SettlementAdapter,
  BountyStatus,
} from "../types.js";

/**
 * SorobanAdapter — client-side TypeScript binding for the Soroban
 * `claimr_verifier` contract (see contracts/claimr-verifier/).
 *
 * Every method serialises to the contract's JSON-RPC / Soroban CLI format.
 * In a real frontend this would use `soroban-client` or `stellar-sdk`
 * to submit transactions. Here we show the interface contract is honoured
 * without leaking chain types.
 */
export class SorobanAdapter implements SettlementAdapter {
  private contractId: string;
  private rpcUrl: string;

  constructor(contractId: string, rpcUrl: string = "https://rpc-futurenet.stellar.org") {
    this.contractId = contractId;
    this.rpcUrl = rpcUrl;
  }

  async lockReward(
    bountyId: BountyId,
    commitmentHash: string,
    amountOpaque: Uint8Array,
  ): Promise<EscrowRef> {
    // In production: call `contract.lock_reward(bountyId, commitmentHash, amountOpaque)`
    // via Soroban SDK. The contract stores the commitment (hash) on-chain and locks
    // the asset against the bountyId.
    console.log(`[Soroban] lockReward(${bountyId}, ${commitmentHash.slice(0, 10)}..., ${amountOpaque.length}B)`);
    return `escrow:${bountyId}`;
  }

  async verifyAndPayout(
    bountyId: BountyId,
    proofBytes: ProofBytes,
    publicSignals: PublicSignals,
  ): Promise<TxRef> {
    // 1. Parse public signals
    //    signals[0] = bountyId
    //    signals[1] = nullifierHash
    //    signals[2] = evaluatorSignatureHash
    //
    // 2. Call contract.verify_and_payout(bountyId, proofBytes, publicSignals)
    //    - Contract calls host.bn254_msm(), host.bn254_scalar_mul(), etc.
    //    - Contract checks nullifierHash is not already spent (storage lookup)
    //    - On success: marks nullifierHash as spent, transfers asset to winner
    console.log(`[Soroban] verifyAndPayout(${bountyId}, ${proofBytes.length}B proof, ${publicSignals.length} signals)`);
    return `tx:${bountyId}:${Date.now()}`;
  }

  async getBountyStatus(bountyId: BountyId): Promise<BountyStatus> {
    console.log(`[Soroban] getBountyStatus(${bountyId})`);
    return BountyStatus.Active;
  }

  async getNullifierStatus(nullifierHash: string): Promise<boolean> {
    console.log(`[Soroban] getNullifierStatus(${nullifierHash.slice(0, 10)}...)`);
    return false;
  }
}
