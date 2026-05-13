import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    profiles: {
      default: {
        version: "0.8.24",
        settings: {
          evmVersion: "cancun",
          viaIR: true,
          optimizer: { enabled: true, runs: 200 },
        },
      },
    },
  },
  networks: {
    hardhat: { type: "edr-simulated", chainId: 31337 },
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC_URL ?? "https://rpc.ankr.com/eth_sepolia",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: { sepolia: process.env.ETHERSCAN_API_KEY ?? "" },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
