import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import UpliftBountyModal from "./UpliftBountyModal";
import BountyListClient from "./BountyListClient";
import BountyFilters from "./BountyFilters";

const HARDCODED_BOUNTIES = [
  // ── Web3 ──
  {
    id: "hc-1",
    title: "Build a Cross-Chain Token Bridge UI",
    company: "BridgeDAO",
    category: "Web3",
    difficulty: "Expert",
    reward: "2.0 ETH",
    tags: ["Solidity", "React", "Ethers.js", "LayerZero"],
  },
  {
    id: "hc-2",
    title: "ERC-4337 Account Abstraction Wallet Plugin",
    company: "SmartWallet Labs",
    category: "Web3",
    difficulty: "Advanced",
    reward: "1,800 USDC",
    tags: ["ERC-4337", "Solidity", "TypeScript"],
  },
  {
    id: "hc-3",
    title: "Write an ERC-20 Token Faucet Smart Contract",
    company: "TestnetFun",
    category: "Web3",
    difficulty: "Beginner",
    reward: "120 USDC",
    tags: ["Solidity", "Hardhat", "ERC-20"],
  },
  {
    id: "hc-4",
    title: "DAO Governance Voting dApp",
    company: "GovX Protocol",
    category: "Web3",
    difficulty: "Intermediate",
    reward: "0.6 ETH",
    tags: ["Solidity", "Next.js", "IPFS", "TheGraph"],
  },
  // ── Frontend ──
  {
    id: "hc-5",
    title: "Responsive Landing Page for SaaS Product",
    company: "LaunchKit",
    category: "Frontend",
    difficulty: "Beginner",
    reward: "80 USDC",
    tags: ["HTML", "Tailwind CSS", "Responsive"],
  },
  {
    id: "hc-6",
    title: "Interactive Data Visualization Dashboard",
    company: "ChartFlow",
    category: "Frontend",
    difficulty: "Intermediate",
    reward: "450 USDC",
    tags: ["React", "D3.js", "TypeScript", "Recharts"],
  },
  {
    id: "hc-7",
    title: "Build a Drag-and-Drop Kanban Board",
    company: "TaskForge",
    category: "Frontend",
    difficulty: "Intermediate",
    reward: "350 USDC",
    tags: ["React", "DnD Kit", "Zustand"],
  },
  {
    id: "hc-8",
    title: "Micro-Frontend Architecture Migration",
    company: "ScaleFront Inc",
    category: "Frontend",
    difficulty: "Expert",
    reward: "2,200 USDC",
    tags: ["Module Federation", "Webpack", "React", "CI/CD"],
  },
  // ── Backend ──
  {
    id: "hc-9",
    title: "REST API for Inventory Management System",
    company: "StockSync",
    category: "Backend",
    difficulty: "Beginner",
    reward: "150 USDC",
    tags: ["Node.js", "Express", "PostgreSQL"],
  },
  {
    id: "hc-10",
    title: "Real-Time WebSocket Notification Service",
    company: "PingHQ",
    category: "Backend",
    difficulty: "Intermediate",
    reward: "500 USDC",
    tags: ["Node.js", "Socket.io", "Redis", "Docker"],
  },
  {
    id: "hc-11",
    title: "GraphQL API Gateway with Rate Limiting",
    company: "APIForge",
    category: "Backend",
    difficulty: "Advanced",
    reward: "900 USDC",
    tags: ["GraphQL", "Apollo", "Redis", "Kubernetes"],
  },
  {
    id: "hc-12",
    title: "Distributed Task Queue with Dead Letter Handling",
    company: "QueueLabs",
    category: "Backend",
    difficulty: "Expert",
    reward: "1.2 ETH",
    tags: ["Rust", "RabbitMQ", "PostgreSQL", "gRPC"],
  },
  // ── AI / ML ──
  {
    id: "hc-13",
    title: "Sentiment Analysis API Using HuggingFace",
    company: "MoodMetrics",
    category: "AI / ML",
    difficulty: "Beginner",
    reward: "200 USDC",
    tags: ["Python", "HuggingFace", "FastAPI"],
  },
  {
    id: "hc-14",
    title: "Custom RAG Pipeline for Legal Documents",
    company: "LexAI",
    category: "AI / ML",
    difficulty: "Advanced",
    reward: "1,500 USDC",
    tags: ["LangChain", "Pinecone", "OpenAI", "Python"],
  },
  {
    id: "hc-15",
    title: "Train Image Classifier on Custom Dataset",
    company: "VisionLab",
    category: "AI / ML",
    difficulty: "Intermediate",
    reward: "0.4 ETH",
    tags: ["PyTorch", "CNN", "Python", "Weights & Biases"],
  },
  {
    id: "hc-16",
    title: "Multi-Agent LLM Orchestration System",
    company: "AgentStack",
    category: "AI / ML",
    difficulty: "Expert",
    reward: "3,000 USDC",
    tags: ["CrewAI", "LangGraph", "GPT-4", "Python"],
  },
  // ── Design ──
  {
    id: "hc-17",
    title: "Mobile App UI Kit for Fintech Product",
    company: "PayFlow",
    category: "Design",
    difficulty: "Intermediate",
    reward: "400 USDC",
    tags: ["Figma", "UI/UX", "Mobile", "Design System"],
  },
  {
    id: "hc-18",
    title: "Redesign Developer Portal UX",
    company: "DevGateHQ",
    category: "Design",
    difficulty: "Advanced",
    reward: "800 USDC",
    tags: ["Figma", "UX Research", "Information Architecture"],
  },
  {
    id: "hc-19",
    title: "Icon Set for Blockchain Explorer",
    company: "ChainScan",
    category: "Design",
    difficulty: "Beginner",
    reward: "100 USDC",
    tags: ["Illustration", "SVG", "Icon Design"],
  },
  // ── Writing ──
  {
    id: "hc-20",
    title: "Technical Documentation for SDK v2",
    company: "DevTools.io",
    category: "Writing",
    difficulty: "Intermediate",
    reward: "300 USDC",
    tags: ["Technical Writing", "Markdown", "API Docs"],
  },
  {
    id: "hc-21",
    title: "Write Beginner Tutorial Series for Solidity",
    company: "Web3Academy",
    category: "Writing",
    difficulty: "Beginner",
    reward: "150 USDC",
    tags: ["Tutorial", "Solidity", "Education"],
  },
  {
    id: "hc-22",
    title: "Security Audit Report Template & Guide",
    company: "AuditShield",
    category: "Writing",
    difficulty: "Advanced",
    reward: "600 USDC",
    tags: ["Security", "Technical Writing", "Smart Contracts"],
  },
  // ── More mixed difficulty ──
  {
    id: "hc-23",
    title: "Build a Telegram Bot for Bounty Notifications",
    company: "BountyPing",
    category: "Backend",
    difficulty: "Beginner",
    reward: "100 USDC",
    tags: ["Node.js", "Telegram API", "Webhooks"],
  },
  {
    id: "hc-24",
    title: "Zero-Knowledge Proof Verifier in Circom",
    company: "zkLabs",
    category: "Web3",
    difficulty: "Expert",
    reward: "3.5 ETH",
    tags: ["Circom", "ZK-SNARKs", "Solidity", "Rust"],
  },
  {
    id: "hc-25",
    title: "Animated Onboarding Flow with Framer Motion",
    company: "OnboardX",
    category: "Frontend",
    difficulty: "Advanced",
    reward: "700 USDC",
    tags: ["React", "Framer Motion", "TypeScript", "Lottie"],
  },
];

export default async function BountiesPage() {
  let session = null;

  try {
    session = await auth0.getSession();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Invalid Compact JWE")) {
      session = null;
    } else {
      throw error;
    }
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Navbar user={user} />

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <header className="mb-16 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-4">
              Active <span className="text-[#22C55E]">Targets</span>
            </h1>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              Browse open bounties, claim tasks, and submit your proof. Assignments are 
              scored and payouts are settled automatically on-chain. 
            </p>
          </div>
          <div>
            <UpliftBountyModal email={user?.email || ""} />
          </div>
        </header>

        {/* ── ALL BOUNTIES LIST INJECTED HERE ── */}
        <section>
          <div className="mb-8 border-b border-[#1E1E2E] pb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-widest text-white/80">
              // Open Network Bounties
            </h2>
          </div>
          
          <BountyListClient />
        </section>

        {/* ── COMMUNITY BOUNTY BOARD ── */}
        <section className="mt-20">
          <BountyFilters bounties={HARDCODED_BOUNTIES} />
        </section>

      </main>
    </div>
  );
}