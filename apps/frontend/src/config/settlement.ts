/**
 * Settlement chain configuration.
 *
 * Change SETTLEMENT_CHAIN to swap between chain adapters.
 * No other code changes required — the SettlementAdapter interface
 * abstracts all chain-specific logic.
 *
 * Supported values:
 *   "stellar"   — Soroban (default, BN254 host functions)
 *   "ethereum"  — Ethereum/Sepolia (Groth16 via EVM verifier)
 */

export type SettlementChain = "stellar" | "ethereum";

export const SETTLEMENT_CHAIN: SettlementChain =
  (process.env.NEXT_PUBLIC_SETTLEMENT_CHAIN as SettlementChain) || "stellar";

export const SOROBAN_CONTRACT_ID =
  process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID || "CCJZ5S6T4X5Y7Q...";

export const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://rpc-futurenet.stellar.org";

export const ETH_RPC_URL =
  process.env.NEXT_PUBLIC_ETH_RPC_URL || "https://rpc.sepolia.org";
