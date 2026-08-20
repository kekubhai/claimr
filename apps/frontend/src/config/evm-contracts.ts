/**
 * Local Hardhat (chainId 31337) addresses from
 * `apps/proof-of-work-contracts/deployed-addresses.json`.
 *
 * Override with NEXT_PUBLIC_* env vars after a Sepolia deploy.
 */
export const EVM_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_EVM_CHAIN_ID || "31337"
);

export const PROOF_OF_WORK_NFT_ADDRESS =
  process.env.NEXT_PUBLIC_PROOF_OF_WORK_NFT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const BOUNTY_ESCROW_ADDRESS =
  process.env.NEXT_PUBLIC_BOUNTY_ESCROW_ADDRESS ||
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const AI_ORACLE_ADDRESS =
  process.env.NEXT_PUBLIC_AI_ORACLE_ADDRESS ||
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
