import { expect } from "chai";
import { network } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/types";

const { ethers, networkHelpers } = await network.create();
const { time } = networkHelpers;

describe("ProofOfWork — Full Test Suite", function () {
  let escrow: any;
  let nft: any;
  let oracle: any;
  let owner: HardhatEthersSigner;
  let poster: HardhatEthersSigner;
  let student1: HardhatEthersSigner;
  let student2: HardhatEthersSigner;
  let feeRecipient: HardhatEthersSigner;

  const ONE_ETH = ethers.parseEther("1");
  const ONE_DAY = 86_400;

  beforeEach(async () => {
    [owner, poster, student1, student2, feeRecipient] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("ProofOfWorkNFT");
    nft = await NFT.deploy();

    const Escrow = await ethers.getContractFactory("BountyEscrow");
    escrow = await Escrow.deploy(feeRecipient.address);

    const Oracle = await ethers.getContractFactory("AIOracle");
    oracle = await Oracle.deploy(await escrow.getAddress());

    // Wire up
    await nft.setBountyEscrow(await escrow.getAddress());
    await escrow.setNFTContract(await nft.getAddress());
    await escrow.setOracle(await oracle.getAddress(), true);
  });

  // ── BountyEscrow ──────────────────────────────

  describe("BountyEscrow", () => {
    it("should post ETH bounty and lock funds", async () => {
      const deadline = (await time.latest()) + ONE_DAY;

      await expect(
        escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH })
      ).to.emit(escrow, "BountyPosted");

      const bounty = await escrow.getBounty(0);
      expect(bounty.reward).to.equal(ONE_ETH);
      expect(bounty.poster).to.equal(poster.address);
      expect(Number(bounty.status)).to.equal(0); // Open
    });

    it("should accept a solution submission", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });

      await expect(
        escrow.connect(student1).submitSolution(0, "ipfs://sol1")
      ).to.emit(escrow, "SolutionSubmitted");

      const subs = await escrow.getSubmissions(0);
      expect(subs.length).to.equal(1);
      expect(subs[0].submitter).to.equal(student1.address);
    });

    it("should prevent double submission", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });
      await escrow.connect(student1).submitSolution(0, "ipfs://sol1");

      await expect(
        escrow.connect(student1).submitSolution(0, "ipfs://sol2")
      ).to.be.revertedWith("Already submitted");
    });

    it("should prevent poster from submitting", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });

      await expect(
        escrow.connect(poster).submitSolution(0, "ipfs://cheat")
      ).to.be.revertedWith("Poster cannot submit");
    });

    it("should declare winner, pay out, and mint NFT", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });
      await escrow.connect(student1).submitSolution(0, "ipfs://sol1");

      const before = await ethers.provider.getBalance(student1.address);

      await expect(
        escrow.connect(owner).declareWinner(0, student1.address, 88)
      ).to.emit(escrow, "WinnerDeclared");

      const after = await ethers.provider.getBalance(student1.address);
      expect(after).to.be.gt(before);

      // Soulbound NFT should be minted
      expect(await nft.balanceOf(student1.address)).to.equal(1);
      const achievement = await nft.getAchievement(0);
      expect(achievement.score).to.equal(88n);
      expect(achievement.category).to.equal("Code");
    });

    it("should collect 2.5% platform fee on win", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });
      await escrow.connect(student1).submitSolution(0, "ipfs://sol1");

      const feeBefore = await ethers.provider.getBalance(feeRecipient.address);
      await escrow.connect(owner).declareWinner(0, student1.address, 95);
      const feeAfter = await ethers.provider.getBalance(feeRecipient.address);

      const expectedFee = (ONE_ETH * 250n) / 10_000n;
      expect(feeAfter - feeBefore).to.equal(expectedFee);
    });

    it("should refund poster after deadline with no winner", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });

      await time.increase(ONE_DAY + 1);

      const before = await ethers.provider.getBalance(poster.address);
      await escrow.connect(poster).refundPoster(0);
      const after = await ethers.provider.getBalance(poster.address);
      expect(after).to.be.gt(before);
    });
  });

  // ── ProofOfWorkNFT ────────────────────────────

  describe("ProofOfWorkNFT — Soulbound", () => {
    async function mintNFT() {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });
      await escrow.connect(student1).submitSolution(0, "ipfs://sol1");
      await escrow.connect(owner).declareWinner(0, student1.address, 90);
    }

    it("should block transferFrom (soulbound)", async () => {
      await mintNFT();
      await expect(
        nft.connect(student1).transferFrom(student1.address, student2.address, 0)
      ).to.be.revertedWith("Soulbound: non-transferable");
    });

    it("should have on-chain base64 metadata", async () => {
      await mintNFT();
      const uri = await nft.tokenURI(0);
      expect(uri).to.include("data:application/json;base64,");
    });

    it("should track tokens per wallet", async () => {
      await mintNFT();
      const tokens = await nft.getWalletTokens(student1.address);
      expect(tokens.length).to.equal(1);
    });
  });

  // ── AIOracle ──────────────────────────────────

  describe("AIOracle", () => {
    it("should submit result via oracle wallet", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });
      await escrow.connect(student1).submitSolution(0, "ipfs://sol1");

      await expect(
        oracle.connect(owner).submitResult(0, student1.address, 85)
      ).to.emit(escrow, "WinnerDeclared");
    });

    it("should accept ECDSA-signed result", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });
      await escrow.connect(student2).submitSolution(0, "ipfs://sol2");

      const messageHash = ethers.solidityPackedKeccak256(
        ["uint256", "address", "uint256"],
        [0, student2.address, 92]
      );
      const signature = await owner.signMessage(ethers.getBytes(messageHash));

      await expect(
        oracle.connect(student2).submitResultSigned(0, student2.address, 92, signature)
      ).to.emit(escrow, "WinnerDeclared");
    });

    it("should reject signatures from non-oracle wallets", async () => {
      const deadline = (await time.latest()) + ONE_DAY;
      await escrow.connect(poster).postBounty("ipfs://brief", deadline, 0, { value: ONE_ETH });
      await escrow.connect(student1).submitSolution(0, "ipfs://sol1");

      const messageHash = ethers.solidityPackedKeccak256(
        ["uint256", "address", "uint256"],
        [0, student1.address, 99]
      );
      // student1 signs instead of oracle — should fail
      const fakeSignature = await student1.signMessage(ethers.getBytes(messageHash));

      await expect(
        oracle.connect(student1).submitResultSigned(0, student1.address, 99, fakeSignature)
      ).to.be.revertedWith("AIOracle: invalid oracle signature");
    });
  });
});