import { BrowserProvider, Contract } from "ethers";
import { PROOF_OF_WORK_NFT_ADDRESS } from "@/config/evm-contracts";

// 1. Define the ABI for the read functions we need
const proofOfWorkNftABI = [
  // Fetch array of token IDs owned by a specific wallet
  "function getWalletTokens(address wallet) external view returns (uint256[])",
  
  // Fetch the raw Achievement struct data
  "function getAchievement(uint256 tokenId) external view returns (tuple(uint256 bountyId, string category, uint256 score, uint256 timestamp, string submissionIpfsHash))",
  
  // Fetch the base64 encoded JSON metadata (Inherited from ERC721)
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

const NFT_CONTRACT_ADDRESS = PROOF_OF_WORK_NFT_ADDRESS;

export async function fetchUserAchievements(userAddress: string) {
  try {
    // 2. Setup a read-only provider 
  // (You don't strictly need window.ethereum for read-only calls if you use an RPC URL, 
  // but we'll use it here assuming the user is connected)
  // @ts-expect-error - window.ethereum is injected by the wallet at runtime
    if (!window.ethereum) {
      throw new Error("No crypto wallet found.");
    }
    // @ts-expect-error - window.ethereum is injected by the wallet at runtime
    const provider = new BrowserProvider(window.ethereum);
    
    // Note: We don't need a signer here because we are only reading data, not sending transactions.
    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS,
      proofOfWorkNftABI,
      provider
    );

    console.log(`Fetching tokens for wallet: ${userAddress}...`);

    // 3. Get all token IDs for the user
    const tokenIds: bigint[] = await nftContract.getWalletTokens(userAddress);
    
    if (tokenIds.length === 0) {
      console.log("No achievements found for this wallet.");
      return [];
    }

    const achievements = [];

    // 4. Loop through each token ID to get its data and metadata
    for (const id of tokenIds) {
      // Fetch the raw struct data
      const achievementData = await nftContract.getAchievement(id);
      
      // Fetch the base64 metadata URI
      const tokenUri = await nftContract.tokenURI(id);

      // 5. Decode the on-chain base64 JSON metadata
      // The URI looks like: data:application/json;base64,eyJuYW1lIjoiUHJvb2ZPZldvcm...
      const base64Json = tokenUri.split(",")[1];
      const decodedJsonString = atob(base64Json); // Decode base64 to string
      const metadata = JSON.parse(decodedJsonString); // Parse string to JSON object

      achievements.push({
        tokenId: id.toString(),
        bountyId: achievementData.bountyId.toString(),
        category: achievementData.category,
        score: achievementData.score.toString(),
        timestamp: new Date(Number(achievementData.timestamp) * 1000).toLocaleString(),
        ipfsHash: achievementData.submissionIpfsHash,
        metadata: metadata // This contains the name, description, attributes, and image (SVG)
      });
    }

    console.log("Fetched Achievements:", achievements);
    return achievements;

  } catch (error) {
    console.error("Error fetching NFT data:", error);
    throw error;
  }
}