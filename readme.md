# ClaimR-ZK — Private Bounty Payouts with Chain-Agnostic Settlement

ClaimR is a bounty platform where companies lock crypto rewards, students submit
solutions, an AI evaluator scores them, and winners get paid. This fork adds a
zero-knowledge layer so solver identity and reward amounts stay shielded, with a
clean chain abstraction so the settlement network (Soroban, Ethereum, Solana) is
swappable by changing one config flag.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ClaimR Frontend (Next.js)                      │
│  Leaderboard (shielded toggle) │ Bounty Details │ Claim w/ Proof │
└──────────────────────┬──────────────────────────────────────────┘
                       │  SETTLEMENT_CHAIN=stellar|ethereum
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│              @claimr/zk-settlement  (TypeScript package)          │
│                                                                   │
│  generateClaimProof() ───► opaque proof bytes + public signals   │
│                              │                                    │
│                              ▼                                    │
│  SettlementAdapter (interface) ──► SorobanAdapter  (Stellar)     │
│                              │──► EthereumAdapter (Sepolia)      │
│                              │──► (next: Solana)                  │
└─────────────────────────────┬────────────────────────────────────┘
                              │  proofBytes + publicSignals[]
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Soroban Contract (claimr_verifier.rs)                            │
│                                                                   │
│  - BN254 host functions for Groth16 verification                  │
│  - Nullifier storage (double-claim prevention)                    │
│  - Reward commitment (hash, not plaintext amount)                 │
│  - Escrow lock / release                                          │
└──────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
circuits/
  claimr-eligibility/          # Noir circuit (winner-eligibility + nullifier)
    Nargo.toml
    src/main.nr                # Circuit constraints
    Prover.toml                # Test vectors
    Verifier.toml

contracts/
  claimr-verifier/             # Soroban SettlementAdapter implementation
    Cargo.toml
    src/lib.rs                 # Contract: lock_reward, verify_and_payout, etc.
    src/test.rs

packages/
  zk-settlement/               # Chain-agnostic ZK settlement package
    src/types.ts               # SettlementAdapter interface + types
    src/proof-service.ts       # generateClaimProof()
    src/cli.ts                 # CLI: npx tsx src/cli.ts <bountyId> <secret> <sig>
    src/adapter-registry.ts    # Factory: createAdapter()
    src/adapters/
      soroban.ts               # Soroban adapter (TypeScript binding)
      ethereum.ts              # Ethereum adapter (reference stub)

apps/
  frontend/
    src/
      config/settlement.ts     # SETTLEMENT_CHAIN flag
      app/leaderboard/         # Shielded leaderboard with reveal toggle
      app/bounties/[bountyId]/
        ClaimWithProofModal.tsx # ZK claim flow modal
        BountyDetailsClient.tsx # Updated with claim button
```

## SettlementAdapter Interface

The single abstraction boundary. Every chain integration implements exactly
these four methods:

| Method | Purpose |
|---|---|
| `lockReward(bountyId, commitmentHash, amountOpaque)` | Store commitment, lock asset |
| `verifyAndPayout(bountyId, proofBytes, publicSignals)` | Verify ZK proof, release escrow |
| `getBountyStatus(bountyId)` | Read bounty lifecycle status |
| `getNullifierStatus(nullifierHash)` | Check if nullifier is spent |

All data crosses as `string` (bountyId), `Uint8Array` (proof), or `string[]`
(public signals). No chain-specific types leak into the rest of the app.

## Noir Circuit

**Location:** `circuits/claimr-eligibility/src/main.nr`

**Public inputs:** bountyId, nullifierHash, evaluatorSignatureHash
**Private inputs:** solverSecret, solverWalletKey, evaluatorSignature

The circuit proves:
1. The solver knows the secret preimage of `nullifierHash` (sybil resistance)
2. The solver knows the evaluator signature that hashes to `evaluatorSignatureHash`
3. The wallet key is consistent across both constraints

**Run tests:**
```bash
cd circuits/claimr-eligibility
nargo test
```

**Generate a proof:**
```bash
nargo prove --prover-name claimr_eligibility
```

## Off-Chain Proof CLI

```bash
cd packages/zk-settlement
npx tsx src/cli.ts "bounty-1" "s0lv3r_s3cr3t" "ev4l_s1gn4tur3"
```

Outputs `proofs/<bountyId>/proof.bin` and `proofs/<bountyId>/public.json`.

## Adding a New Chain

To add a new chain (e.g. Solana, Polygon, etc.), follow this checklist:

### 1. Create a new adapter file

`packages/zk-settlement/src/adapters/solana.ts`

Implement the `SettlementAdapter` interface:

```typescript
import { SettlementAdapter, BountyId, EscrowRef, TxRef, ProofBytes, PublicSignals, BountyStatus } from "../types.js";

export class SolanaAdapter implements SettlementAdapter {
  async lockReward(bountyId: BountyId, commitmentHash: string, amountOpaque: Uint8Array): Promise<EscrowRef> { /* ... */ }
  async verifyAndPayout(bountyId: BountyId, proofBytes: ProofBytes, publicSignals: PublicSignals): Promise<TxRef> { /* ... */ }
  async getBountyStatus(bountyId: BountyId): Promise<BountyStatus> { /* ... */ }
  async getNullifierStatus(nullifierHash: string): Promise<boolean> { /* ... */ }
}
```

### 2. Register in the factory

`packages/zk-settlement/src/adapter-registry.ts` — add a case:

```typescript
case "solana":
  return new SolanaAdapter(/* ... */);
```

### 3. Add the chain's settlement contract

Deploy a contract on the target chain that can:
- Store reward commitments as hashes (not plaintext amounts)
- Verify Groth16 proofs (using the chain's native BN254 support, precompiles, or host functions)
- Maintain a `nullifierHash -> bool` map for double-claim prevention

The reference implementation is `contracts/claimr-verifier/` (Soroban).

### 4. Wire the env var

Set `NEXT_PUBLIC_SETTLEMENT_CHAIN=solana` in `.env.local`.

**That's it.** No other code in the frontend, circuits, or proof service changes.

## Development

```bash
# Install frontend deps
cd apps/frontend && npm install

# Run frontend dev server
npm run dev

# Compile Soroban contract
cd contracts/claimr-verifier
cargo build --target wasm32-unknown-unknown --release

# Run Soroban tests
cargo test

# Prove with Noir
cd circuits/claimr-eligibility
nargo prove
```

## Non-Goals (for now)

- AI evaluator on-chain — it stays off-chain as a server action.
- Generic multi-chain router/bridge — just the adapter interface.
- KYC — sybil resistance is via nullifier, not identity verification.
