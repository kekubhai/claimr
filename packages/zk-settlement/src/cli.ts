/**
 * claimr-proof CLI — generate a ZK claim proof for a test bounty.
 *
 * Usage:
 *   npx tsx src/cli.ts <bountyId> <solverSecret> <evaluatorSig>
 *
 * Example:
 *   npx tsx src/cli.ts "bounty-1" "s0lv3r_s3cr3t_k3y" "ev4l_s1gn4tur3_hex"
 */

import { generateClaimProof } from "./proof-service.js";

async function main() {
  const [, , bountyId, solverSecret, evaluatorSig] = process.argv;

  if (!bountyId || !solverSecret || !evaluatorSig) {
    console.error("Usage: claimr-proof <bountyId> <solverSecret> <evaluatorSig>");
    process.exit(1);
  }

  console.log("");
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║     CLAIMR ZK PROOF GENERATOR                ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  const start = performance.now();

  const result = await generateClaimProof(bountyId, solverSecret, evaluatorSig);

  const elapsed = (performance.now() - start).toFixed(1);

  console.log(`  Bounty ID         : ${bountyId}`);
  console.log(`  Proof length      : ${result.proofBytes.length} bytes`);
  console.log(`  Public signals    : ${result.publicSignals.length}`);
  console.log(`  ├─ bountyId       : ${result.publicSignals[0]}`);
  console.log(`  ├─ nullifierHash  : ${result.publicSignals[1]}`);
  console.log(`  └─ sigHash        : ${result.publicSignals[2]}`);
  console.log(`  Time              : ${elapsed}ms`);
  console.log("");

  // Write artifacts to disk so the Soroban adapter can consume them.
  const fs = await import("fs/promises");
  const outDir = `./proofs/${bountyId}`;
  await fs.mkdir(outDir, { recursive: true });

  await fs.writeFile(`${outDir}/proof.bin`, result.proofBytes);
  await fs.writeFile(
    `${outDir}/public.json`,
    JSON.stringify(result.publicSignals, null, 2),
  );

  console.log(`  Artifacts written to ${outDir}/`);
  console.log("  ├── proof.bin");
  console.log("  └── public.json");
  console.log("");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
