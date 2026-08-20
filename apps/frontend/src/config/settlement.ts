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
  process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID ||
  "CAJO3FV7NPDGDIAJVX4ILN54G7W62T5UBGFNVNT44X4KW4GRYQAPA3JZ";

export const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
  "https://soroban-testnet.stellar.org";

export const ETH_RPC_URL =
  process.env.NEXT_PUBLIC_ETH_RPC_URL || "http://127.0.0.1:8545";
