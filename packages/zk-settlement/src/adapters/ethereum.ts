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
 * EthereumAdapter — reference implementation for EVM chains.
 *
 * This file is intentionally kept as a minimal stub to demonstrate that
 * adding a new chain is a single new file implementing 4 methods.
 *
 * To complete: replace the console.log stubs with ethers/viem contract calls
 * to the deployed `BountyEscrow` + `AIOracle` + a Groth16 verifier contract.
 */
export class EthereumAdapter implements SettlementAdapter {
  private rpcUrl: string;

  constructor(rpcUrl: string = "https://rpc.sepolia.org") {
    this.rpcUrl = rpcUrl;
  }

  async lockReward(
    bountyId: BountyId,
    commitmentHash: string,
    amountOpaque: Uint8Array,
  ): Promise<EscrowRef> {
    console.log(`[Ethereum] lockReward(${bountyId}, commitment=${commitmentHash.slice(0, 10)}...)`);
    return `0xescrow:${bountyId}`;
  }

  async verifyAndPayout(
    bountyId: BountyId,
    proofBytes: ProofBytes,
    publicSignals: PublicSignals,
  ): Promise<TxRef> {
    console.log(`[Ethereum] verifyAndPayout(${bountyId}, proof=${proofBytes.length}B)`);
    return `0xtx:${bountyId}:${Date.now()}`;
  }

  async getBountyStatus(bountyId: BountyId): Promise<BountyStatus> {
    console.log(`[Ethereum] getBountyStatus(${bountyId})`);
    return BountyStatus.Active;
  }

  async getNullifierStatus(nullifierHash: string): Promise<boolean> {
    console.log(`[Ethereum] getNullifierStatus(${nullifierHash.slice(0, 10)}...)`);
    return false;
  }
}
