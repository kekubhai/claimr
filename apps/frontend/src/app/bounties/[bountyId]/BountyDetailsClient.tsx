// src/app/bounties/[bountyId]/BountyDetailsClient.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import SubmitSolutionModal from "./SubmitSolutionModal";
import BountyQA from "./BountyQA";

// ── Local mock & hardcoded bounty data for non-Convex IDs ──
const LOCAL_BOUNTIES: Record<string, {
  _id: string;
  title: string;
  description: string;
  amount: number | string;
  unit: string;
  endDate: number;
  amountStatus: string;
  bountyStatus: string;
  bountySetter: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
}> = {
  // Mock bounties (from BountyListClient)
  "mock-1": {
    _id: "mock-1",
    title: "DeFi Liquidity Dashboard Alerts",
    description: "Build a real-time dashboard to monitor liquidity pools and send WebSocket alerts based on specific threshold triggers.",
    amount: 1200,
    unit: "USDC",
    endDate: new Date("2026-05-01").getTime(),
    amountStatus: "ESCROWED",
    bountyStatus: "OPEN",
    bountySetter: "user_mock1",
  },
  "mock-2": {
    _id: "mock-2",
    title: "P2P Lending Smart Contract Security Audit",
    description: "Perform a comprehensive security audit on our v2 lending contracts. Focus on reentrancy and oracle manipulation.",
    amount: 2.5,
    unit: "ETH",
    endDate: new Date("2026-06-15").getTime(),
    amountStatus: "FUNDED",
    bountyStatus: "IN_PROGRESS",
    bountySetter: "user_mock2",
  },
  "mock-3": {
    _id: "mock-3",
    title: "Rust-based MEV Bot Indexer",
    description: "Create a highly optimized Rust indexer to track and categorize MEV extraction across multiple L2s.",
    amount: 3000,
    unit: "USDC",
    endDate: new Date("2026-04-20").getTime(),
    amountStatus: "ESCROWED",
    bountyStatus: "OPEN",
    bountySetter: "user_mock3",
  },
  // Hardcoded bounties (from page.tsx)
  "hc-1": { _id: "hc-1", title: "Build a Cross-Chain Token Bridge UI", description: "Design and implement a full cross-chain token bridge interface supporting multiple L1/L2 networks with real-time transaction status tracking, fee estimation, and wallet connect integration.", amount: "2.0", unit: "ETH", endDate: new Date("2026-06-01").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "BridgeDAO", category: "Web3", difficulty: "Expert", tags: ["Solidity", "React", "Ethers.js", "LayerZero"] },
  "hc-2": { _id: "hc-2", title: "ERC-4337 Account Abstraction Wallet Plugin", description: "Build a browser wallet plugin implementing ERC-4337 account abstraction, supporting gasless transactions, social recovery, and batched operations.", amount: 1800, unit: "USDC", endDate: new Date("2026-05-20").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "SmartWallet Labs", category: "Web3", difficulty: "Advanced", tags: ["ERC-4337", "Solidity", "TypeScript"] },
  "hc-3": { _id: "hc-3", title: "Write an ERC-20 Token Faucet Smart Contract", description: "Create a simple ERC-20 token faucet contract with rate limiting, admin controls, and a minimal frontend for testnet distribution.", amount: 120, unit: "USDC", endDate: new Date("2026-04-15").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "TestnetFun", category: "Web3", difficulty: "Beginner", tags: ["Solidity", "Hardhat", "ERC-20"] },
  "hc-4": { _id: "hc-4", title: "DAO Governance Voting dApp", description: "Build a full-featured DAO governance dApp with proposal creation, token-weighted voting, delegation, and on-chain execution via a timelock controller.", amount: "0.6", unit: "ETH", endDate: new Date("2026-05-30").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "GovX Protocol", category: "Web3", difficulty: "Intermediate", tags: ["Solidity", "Next.js", "IPFS", "TheGraph"] },
  "hc-5": { _id: "hc-5", title: "Responsive Landing Page for SaaS Product", description: "Create a pixel-perfect, responsive landing page from a provided Figma design. Must include hero section, features grid, pricing table, and contact form.", amount: 80, unit: "USDC", endDate: new Date("2026-04-10").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "LaunchKit", category: "Frontend", difficulty: "Beginner", tags: ["HTML", "Tailwind CSS", "Responsive"] },
  "hc-6": { _id: "hc-6", title: "Interactive Data Visualization Dashboard", description: "Build an interactive analytics dashboard with real-time charts, filterable data tables, and exportable reports using D3.js and React.", amount: 450, unit: "USDC", endDate: new Date("2026-05-15").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "ChartFlow", category: "Frontend", difficulty: "Intermediate", tags: ["React", "D3.js", "TypeScript", "Recharts"] },
  "hc-7": { _id: "hc-7", title: "Build a Drag-and-Drop Kanban Board", description: "Implement a fully functional Kanban board with drag-and-drop columns, card management, labels, and persistent state using Zustand.", amount: 350, unit: "USDC", endDate: new Date("2026-05-10").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "TaskForge", category: "Frontend", difficulty: "Intermediate", tags: ["React", "DnD Kit", "Zustand"] },
  "hc-8": { _id: "hc-8", title: "Micro-Frontend Architecture Migration", description: "Migrate a monolithic React app to a micro-frontend architecture using Module Federation. Includes CI/CD pipeline setup and shared component library.", amount: 2200, unit: "USDC", endDate: new Date("2026-06-20").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "ScaleFront Inc", category: "Frontend", difficulty: "Expert", tags: ["Module Federation", "Webpack", "React", "CI/CD"] },
  "hc-9": { _id: "hc-9", title: "REST API for Inventory Management System", description: "Build a REST API with CRUD operations for products, categories, and stock levels. Include authentication, validation, and Swagger docs.", amount: 150, unit: "USDC", endDate: new Date("2026-04-20").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "StockSync", category: "Backend", difficulty: "Beginner", tags: ["Node.js", "Express", "PostgreSQL"] },
  "hc-10": { _id: "hc-10", title: "Real-Time WebSocket Notification Service", description: "Build a scalable real-time notification service using WebSockets with Redis pub/sub, connection management, and delivery guarantees.", amount: 500, unit: "USDC", endDate: new Date("2026-05-25").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "PingHQ", category: "Backend", difficulty: "Intermediate", tags: ["Node.js", "Socket.io", "Redis", "Docker"] },
  "hc-11": { _id: "hc-11", title: "GraphQL API Gateway with Rate Limiting", description: "Design and implement a GraphQL API gateway that aggregates multiple microservices, with built-in rate limiting, caching, and authentication.", amount: 900, unit: "USDC", endDate: new Date("2026-06-05").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "APIForge", category: "Backend", difficulty: "Advanced", tags: ["GraphQL", "Apollo", "Redis", "Kubernetes"] },
  "hc-12": { _id: "hc-12", title: "Distributed Task Queue with Dead Letter Handling", description: "Build a high-throughput distributed task queue in Rust with RabbitMQ, dead letter handling, retry policies, and gRPC health checks.", amount: "1.2", unit: "ETH", endDate: new Date("2026-06-15").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "QueueLabs", category: "Backend", difficulty: "Expert", tags: ["Rust", "RabbitMQ", "PostgreSQL", "gRPC"] },
  "hc-13": { _id: "hc-13", title: "Sentiment Analysis API Using HuggingFace", description: "Build a REST API that performs sentiment analysis on text input using a pre-trained HuggingFace transformer model, deployed with FastAPI.", amount: 200, unit: "USDC", endDate: new Date("2026-04-25").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "MoodMetrics", category: "AI / ML", difficulty: "Beginner", tags: ["Python", "HuggingFace", "FastAPI"] },
  "hc-14": { _id: "hc-14", title: "Custom RAG Pipeline for Legal Documents", description: "Build a retrieval-augmented generation pipeline for legal document Q&A using LangChain, Pinecone vector store, and OpenAI embeddings.", amount: 1500, unit: "USDC", endDate: new Date("2026-06-10").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "LexAI", category: "AI / ML", difficulty: "Advanced", tags: ["LangChain", "Pinecone", "OpenAI", "Python"] },
  "hc-15": { _id: "hc-15", title: "Train Image Classifier on Custom Dataset", description: "Train a CNN image classifier on a provided custom dataset using PyTorch, with experiment tracking via Weights & Biases and model export to ONNX.", amount: "0.4", unit: "ETH", endDate: new Date("2026-05-20").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "VisionLab", category: "AI / ML", difficulty: "Intermediate", tags: ["PyTorch", "CNN", "Python", "Weights & Biases"] },
  "hc-16": { _id: "hc-16", title: "Multi-Agent LLM Orchestration System", description: "Design and implement a multi-agent LLM orchestration system where specialized agents collaborate to solve complex tasks using CrewAI and LangGraph.", amount: 3000, unit: "USDC", endDate: new Date("2026-06-25").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "AgentStack", category: "AI / ML", difficulty: "Expert", tags: ["CrewAI", "LangGraph", "GPT-4", "Python"] },
  "hc-17": { _id: "hc-17", title: "Mobile App UI Kit for Fintech Product", description: "Design a complete mobile UI kit for a fintech app including onboarding, dashboard, transaction history, and settings screens in Figma.", amount: 400, unit: "USDC", endDate: new Date("2026-05-15").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "PayFlow", category: "Design", difficulty: "Intermediate", tags: ["Figma", "UI/UX", "Mobile", "Design System"] },
  "hc-18": { _id: "hc-18", title: "Redesign Developer Portal UX", description: "Conduct UX research and redesign the developer portal with improved information architecture, navigation patterns, and interactive API docs.", amount: 800, unit: "USDC", endDate: new Date("2026-06-01").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "DevGateHQ", category: "Design", difficulty: "Advanced", tags: ["Figma", "UX Research", "Information Architecture"] },
  "hc-19": { _id: "hc-19", title: "Icon Set for Blockchain Explorer", description: "Create a cohesive set of 40+ custom icons for a blockchain explorer covering transactions, blocks, contracts, tokens, and network status.", amount: 100, unit: "USDC", endDate: new Date("2026-04-15").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "ChainScan", category: "Design", difficulty: "Beginner", tags: ["Illustration", "SVG", "Icon Design"] },
  "hc-20": { _id: "hc-20", title: "Technical Documentation for SDK v2", description: "Write comprehensive technical documentation for our SDK v2, including API reference, getting started guide, code examples, and migration guide from v1.", amount: 300, unit: "USDC", endDate: new Date("2026-05-10").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "DevTools.io", category: "Writing", difficulty: "Intermediate", tags: ["Technical Writing", "Markdown", "API Docs"] },
  "hc-21": { _id: "hc-21", title: "Write Beginner Tutorial Series for Solidity", description: "Create a 5-part beginner tutorial series covering Solidity fundamentals, smart contract deployment, testing, and frontend integration.", amount: 150, unit: "USDC", endDate: new Date("2026-04-25").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "Web3Academy", category: "Writing", difficulty: "Beginner", tags: ["Tutorial", "Solidity", "Education"] },
  "hc-22": { _id: "hc-22", title: "Security Audit Report Template & Guide", description: "Create a professional security audit report template with methodology guide, vulnerability classification system, and example findings.", amount: 600, unit: "USDC", endDate: new Date("2026-05-30").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "AuditShield", category: "Writing", difficulty: "Advanced", tags: ["Security", "Technical Writing", "Smart Contracts"] },
  "hc-23": { _id: "hc-23", title: "Build a Telegram Bot for Bounty Notifications", description: "Create a Telegram bot that sends real-time notifications when new bounties are posted, with filtering by category and minimum reward amount.", amount: 100, unit: "USDC", endDate: new Date("2026-04-10").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "BountyPing", category: "Backend", difficulty: "Beginner", tags: ["Node.js", "Telegram API", "Webhooks"] },
  "hc-24": { _id: "hc-24", title: "Zero-Knowledge Proof Verifier in Circom", description: "Implement a zero-knowledge proof circuit in Circom with a Solidity verifier contract, including proof generation scripts and gas-optimized on-chain verification.", amount: "3.5", unit: "ETH", endDate: new Date("2026-07-01").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "zkLabs", category: "Web3", difficulty: "Expert", tags: ["Circom", "ZK-SNARKs", "Solidity", "Rust"] },
  "hc-25": { _id: "hc-25", title: "Animated Onboarding Flow with Framer Motion", description: "Build a multi-step animated onboarding flow with page transitions, micro-interactions, and Lottie animations using Framer Motion and React.", amount: 700, unit: "USDC", endDate: new Date("2026-05-25").getTime(), amountStatus: "ESCROWED", bountyStatus: "OPEN", bountySetter: "OnboardX", category: "Frontend", difficulty: "Advanced", tags: ["React", "Framer Motion", "TypeScript", "Lottie"] },
};

/** Returns true if the ID looks like a real Convex document ID (not mock/hc) */
function isConvexId(id: string): boolean {
  return !id.startsWith("mock-") && !id.startsWith("hc-");
}

export default function BountyDetailsClient({ 
  bountyId, 
  userEmail 
}: { 
  bountyId: string;
  userEmail?: string | null;
}){
  const isReal = isConvexId(bountyId);

  // Only query Convex for real IDs — pass "skip" for local bounties
  const bounty = useQuery(
    api.bountyFunctions.getBountyDetails,
    isReal ? { bountyId: bountyId as Id<"bounty"> } : "skip"
  );

  // For mock/hardcoded bounties, look up from local data
  const localBounty = !isReal ? LOCAL_BOUNTIES[bountyId] ?? null : null;
  const resolved = isReal ? bounty : localBounty;

  // Loading state (only applies to real Convex queries)
  if (resolved === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-8 w-8 animate-spin border-2 border-[#1E1E2E] border-t-[#22C55E] rounded-full" />
        <p className="text-sm text-white/50 uppercase tracking-widest">// DECRYPTING DATA...</p>
      </div>
    );
  }

  // Not found state
  if (resolved === null) {
    return (
      <div className="border border-red-500/30 bg-red-500/10 p-8 text-center">
        <p className="text-red-500 uppercase tracking-widest font-bold">Error: Bounty Not Found</p>
        <p className="text-sm text-white/50 mt-2">The record you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  // Render the bounty details
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E1E2E] pb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs uppercase tracking-widest px-3 py-1 border ${
              resolved.bountyStatus === "OPEN" 
                ? "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10" 
                : "border-white/20 text-white/50 bg-white/5"
            }`}>
              {resolved.bountyStatus}
            </span>
            <span className="text-xs text-white/40 uppercase tracking-wider">
              Target ID: {resolved._id.slice(-6)}
            </span>
            {!isReal && (resolved as typeof LOCAL_BOUNTIES[string]).category && (
              <>
                <span className="text-[10px] uppercase tracking-widest text-[#22C55E]/70 border border-[#22C55E]/20 px-2 py-0.5">
                  {(resolved as typeof LOCAL_BOUNTIES[string]).category}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${
                  (resolved as typeof LOCAL_BOUNTIES[string]).difficulty === 'Beginner' ? 'text-blue-400' : 
                  (resolved as typeof LOCAL_BOUNTIES[string]).difficulty === 'Intermediate' ? 'text-yellow-400' : 
                  (resolved as typeof LOCAL_BOUNTIES[string]).difficulty === 'Advanced' ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {(resolved as typeof LOCAL_BOUNTIES[string]).difficulty}
                </span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {resolved.title}
          </h1>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">// REWARD</p>
          <div className="flex items-baseline gap-2 justify-end">
            <span className="text-5xl font-bold text-[#22C55E] tabular-nums leading-none">
              {resolved.amount}
            </span>
            <span className="text-xl text-[#22C55E]/70 font-bold">
              {resolved.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="grid md:grid-cols-3 gap-8 pt-4">
        <div className="md:col-span-2 space-y-6">
          <div className="border border-[#1E1E2E] bg-[#0A0A0F] p-6">
            <h2 className="text-sm text-[#22C55E] uppercase tracking-widest mb-4">
              // Mission Briefing
            </h2>
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {resolved.description}
            </p>
          </div>

          {/* Tags for hardcoded bounties */}
          {!isReal && (resolved as typeof LOCAL_BOUNTIES[string]).tags && (
            <div className="flex flex-wrap gap-2">
              {(resolved as typeof LOCAL_BOUNTIES[string]).tags!.map((tag) => (
                <span key={tag} className="border border-[#1E1E2E] bg-black px-3 py-1 text-[10px] text-white/60 uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Data */}
        <div className="space-y-6">
          <div className="border border-[#1E1E2E] p-6">
            <h3 className="text-xs text-white/50 uppercase tracking-widest border-b border-[#1E1E2E] pb-3 mb-4">
              Metadata
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">End Date</p>
                <p className="text-sm">
                  {new Date(resolved.endDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Amount Status</p>
                <p className="text-sm text-white/80">{resolved.amountStatus}</p>
              </div>

              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Posted By</p>
                <p className="text-xs text-white/60 truncate" title={resolved.bountySetter}>
                  {resolved.bountySetter}
                </p>
              </div>
            </div>
          </div>

         <SubmitSolutionModal 
    bountyId={resolved._id}
    bountyTitle={resolved.title}
    bountyDescription={resolved.description}
    userEmail={userEmail}
  />
        </div>
      </div>

      {/* Q&A Section */}
      <BountyQA />
    </div>
  );
}