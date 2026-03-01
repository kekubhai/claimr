// Smart Contract Addresses on Sepolia Testnet
export const CONTRACTS = {
  network: 'sepolia',
  ProofOfWorkNFT: '0x1cf40bdad929efa57ea17f12a83ac92130cd6d26',
  BountyEscrow: '0x450c874fa78c0e24cc61f4ce81e121e8646a9eb2',
  AIOracle: '0xd5fd1e833cc7b4a2116e7ad5fc6437fc9556f3b0',
  deployedAt: '2026-02-28T11:02:05.682Z',
} as const;

// ABI for BountyEscrow Contract
export const BOUNTY_ESCROW_ABI = [
  {
    name: 'createBounty',
    type: 'function',
    inputs: [
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'amount', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'bountyId', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    name: 'claimBounty',
    type: 'function',
    inputs: [
      { name: 'bountyId', type: 'uint256' },
      { name: 'solutionProof', type: 'string' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'releaseFunds',
    type: 'function',
    inputs: [{ name: 'bountyId', type: 'uint256' }],
    outputs: [{ name: 'amount', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const;

// Helper function to format contract address
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Get contract info
export function getContractInfo(contractName: keyof typeof CONTRACTS) {
  if (contractName === 'network' || contractName === 'deployedAt') {
    return null;
  }
  const address = CONTRACTS[contractName];
  return {
    name: contractName,
    address: address as string,
    formatted: formatAddress(address as string),
  };
}
