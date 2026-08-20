import type { SettlementAdapter } from "./types.js";
import { SorobanAdapter } from "./adapters/soroban.js";
import { EthereumAdapter } from "./adapters/ethereum.js";

/**
 * The single config flag that switches which chain adapter is live.
 * Change this to "ethereum" and no other code needs to change.
 *
 * In production this would be read from an env var:
 *   SETTLEMENT_CHAIN=stellar|ethereum
 */
export type SupportedChain = "stellar" | "ethereum";

let _chain: SupportedChain = (process.env.SETTLEMENT_CHAIN as SupportedChain) || "stellar";

export function getSettlementChain(): SupportedChain {
  return _chain;
}

export function setSettlementChain(chain: SupportedChain): void {
  _chain = chain;
}

export function createAdapter(chain?: SupportedChain): SettlementAdapter {
  const c = chain ?? _chain;

  switch (c) {
    case "stellar":
      return new SorobanAdapter(
        process.env.SOROBAN_CONTRACT_ID ||
          "CAJO3FV7NPDGDIAJVX4ILN54G7W62T5UBGFNVNT44X4KW4GRYQAPA3JZ",
        process.env.SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org",
      );
    case "ethereum":
      return new EthereumAdapter(
        process.env.ETH_RPC_URL || "https://rpc.sepolia.org",
      );
    default: {
      const _exhaustive: never = c;
      throw new Error(`Unsupported settlement chain: ${_exhaustive}`);
    }
  }
}
