import hre from "hardhat";
import { writeFileSync } from "node:fs";
import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;
  const [deployer] = await ethers.getSigners();

  console.log("════════════════════════════════════════");
  console.log("  ProofOfWork — Deployment Script");
  console.log("════════════════════════════════════════");
  console.log("Deployer :", deployer.address);
  console.log("Network  :", connection.networkName);
  console.log("Balance  :", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // ── 1. Deploy ProofOfWorkNFT ──────────────────
  console.log("1/3  Deploying ProofOfWorkNFT...");
  const NFT = await ethers.getContractFactory("ProofOfWorkNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("     ✅ ProofOfWorkNFT:", await nft.getAddress());

  // ── 2. Deploy BountyEscrow ────────────────────
  console.log("2/3  Deploying BountyEscrow...");
  const Escrow = await ethers.getContractFactory("BountyEscrow");
  const escrow = await Escrow.deploy(deployer.address); // deployer = fee recipient for now
  await escrow.waitForDeployment();
  console.log("     ✅ BountyEscrow:", await escrow.getAddress());

  // ── 3. Deploy AIOracle ────────────────────────
  console.log("3/3  Deploying AIOracle...");
  const Oracle = await ethers.getContractFactory("AIOracle");
  const oracle = await Oracle.deploy(await escrow.getAddress());
  await oracle.waitForDeployment();
  console.log("     ✅ AIOracle:", await oracle.getAddress());

  // ── Wire contracts together ───────────────────
  console.log("\nWiring contracts...");

  // Tell NFT which escrow can mint
  let tx = await nft.setBountyEscrow(await escrow.getAddress());
  await tx.wait();
  console.log("  ✅ NFT.setBountyEscrow()");

  // Tell escrow about the NFT
  tx = await escrow.setNFTContract(await nft.getAddress());
  await tx.wait();
  console.log("  ✅ Escrow.setNFTContract()");

  // Register AIOracle as an authorised oracle in BountyEscrow
  tx = await escrow.setOracle(await oracle.getAddress(), true);
  await tx.wait();
  console.log("  ✅ Escrow.setOracle(AIOracle)");

  // ── Summary ───────────────────────────────────
  console.log("\n════════════════════════════════════════");
  console.log("  ✅  All contracts deployed & wired!");
  console.log("════════════════════════════════════════");
  console.log("ProofOfWorkNFT :", await nft.getAddress());
  console.log("BountyEscrow   :", await escrow.getAddress());
  console.log("AIOracle       :", await oracle.getAddress());

  // Save addresses for frontend / backend
  const addresses = {
    network: connection.networkName,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    ProofOfWorkNFT: await nft.getAddress(),
    BountyEscrow: await escrow.getAddress(),
    AIOracle: await oracle.getAddress(),
    deployedAt: new Date().toISOString(),
  };
  writeFileSync("deployed-addresses.json", JSON.stringify(addresses, null, 2));
  console.log("\nAddresses saved → deployed-addresses.json");

  // Verify on Etherscan (only on live networks)
  if (connection.networkName !== "hardhat" && connection.networkName !== "localhost") {
    console.log("\nWaiting 10s then verifying on Etherscan...");
    await new Promise(r => setTimeout(r, 10_000));

    await verifyDeployedContract(await nft.getAddress(), []);
    await verifyDeployedContract(await escrow.getAddress(), [deployer.address]);
    await verifyDeployedContract(await oracle.getAddress(), [await escrow.getAddress()]);
  }
}

async function verifyDeployedContract(address: string, constructorArgs: unknown[]) {
  try {
    await verifyContract({
      address,
      constructorArgs,
      provider: "etherscan",
    }, hre);
    console.log("  ✅ Verified:", address);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Already Verified")) {
      console.log("  ℹ️  Already verified:", address);
    } else {
      console.log("  ⚠️  Verification failed:", message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});