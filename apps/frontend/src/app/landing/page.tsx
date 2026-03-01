'use client';

import React, { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import DecryptedText from "@/components/DecryptedText";
import { transitionVariants } from "@/lib/utils";
import Dither from "@/components/Dither";
import {
    Menu, X, Code, Layout, BrainCircuit, ArrowRight, Shield, MessageSquare, Briefcase, Zap, Bot, Upload, Wallet
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Web3Logo = () => (
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#22C55E]">
        <span className="text-white font-mono text-xs font-bold">PW</span>
    </div>
);


const GlowButton = ({
    href,
    children,
    className = "",
    onClick,
}: {
    href?: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) => {
    const Component = href ? Link : 'button';
    const props = href ? { href, className: `bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block ${className}` } : { onClick, className: `bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block ${className}` };

    return (
        <Component {...props as any}>
            <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative flex space-x-2 flex-nowrap items-center justify-center z-10 rounded-full bg-zinc-950 py-1.5 px-4 ring-1 ring-white/10 h-full">
                <span>{children}</span>
                <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.75 8.75L14.25 12L10.75 15.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </Component>
    );
};

const Navbar = () => {
    const [menuState, setMenuState] = React.useState(false);
    return (
        <nav data-state={menuState && 'active'} className="bg-background/50 fixed z-50 w-full p-7 mb-8 top-0">
            <div className="mx-auto max-w-7xl px-6 transition-all duration-300">
                <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                    <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                        <Link href="/" className="flex items-center space-x-3">
                            <Web3Logo />
                            <span className="font-mono text-lg font-bold text-foreground">ClaimR</span>
                        </Link>
                        <button
                            onClick={() => setMenuState(!menuState)}
                            aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                            className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-foreground">
                            <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                            <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                        </button>
                    </div>
                    <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-8 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                        <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-6 sm:space-y-0 md:w-fit font-medium text-sm text-muted-foreground">
                            <Link href="#how-it-works" className="hover:text-foreground font-bold transition-colors">How it Works</Link>
                            <Link href="#bounties" className="hover:text-foreground font-bold transition-colors">Bounties</Link>
                            <Link href="#leaderboard" className="hover:text-foreground font-bold transition-colors">Leaderboard</Link>
                            <Link href="#docs" className="hover:text-foreground font-bold transition-colors">Docs</Link>
                        </div>
                        <a
                href="/auth/login"
              >
                <GlowButton >
                            Sign in
                </GlowButton>
              </a>
                        
                    </div>
                </div>
            </div>
        </nav>
    );
};

const HeroSection = () => {
    return (
        <section className="lg:h-[90vh] flex grayscale items-center relative py-24 sm:py-32 border-b border-white/5">
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6366F1] opacity-20 blur-[120px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 relative z-10 w-full items-center">
                <div className="max-w-2xl text-left">
                    <div className="mt-8 lg:mt-0 mb-6 inline-block">
                        <DecryptedText
                            text="Live on Ethereum Sepolia"
                            animateOn="view"
                            revealDirection="start"
                            sequential
                            useOriginalCharsOnly={false}
                            speed={70}
                            className="font-mono text-white bg-black/40 border border-[#22C55E]/20 px-3 py-1.5 rounded-full uppercase text-xs tracking-wider font-semibold"
                        />
                    </div>
                    <TextEffect preset="fade-in-blur" speedSegment={0.3} as="h1" className="text-balance text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
                        Earn Crypto by
                    </TextEffect>
                    <TextEffect preset="fade-in-blur" speedSegment={0.3} as="h1" className="text-balance text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#22C55E] mt-2 pb-2">
                        Solving Real Hustles
                    </TextEffect>
                    <TextEffect per="line" preset="fade-in-blur" speedSegment={0.3} delay={0.5} as="p" className="mt-8 max-w-lg text-pretty text-lg text-muted-foreground leading-relaxed">
                        Companies post bounties. Students solve them. AI evaluates submissions. Winners get paid automatically on Ethereum.
                    </TextEffect>
                    <AnimatedGroup variants={({ container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } }, ...(transitionVariants as any) })} className="mt-10 flex flex-col sm:flex-row gap-4 lg:justify-start">
                      <a
                href="/auth/login"
              >
                <GlowButton > 
                            Start Solving
                 </GlowButton>
              </a>
                        <a
                href="/auth/login"
              ></a>
                        <GlowButton href="/dashboard">
                            Post a Bounty
                        </GlowButton>
                    </AnimatedGroup>
                    <p className="mt-6 text-xs text-muted-foreground/80 font-mono tracking-wide">
                        <Shield className="inline-block w-3 h-3 mr-1 -mt-0.5" />
                        Secure payouts powered by Ethereum Sepolia smart contracts
                    </p>
                </div>

                {/* Hero Right Box (Live Bounties) */}
                {/* <div className="relative w-full max-w-md mx-auto lg:ml-auto lg:mr-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 to-[#22C55E]/10 rounded-[2rem] blur-xl opacity-50" />
                    <div className="relative border border-white/10 rounded-[2rem] bg-[#0A0A0A]/80 backdrop-blur-2xl p-6 md:p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h3 className="font-semibold text-xl tracking-tight flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22C55E]"></span>
                                </span>
                                Live Bounties
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Python Web Scraper', desc: 'Scrape product prices from Amazon and export to CSV.', reward: '0.02 ETH', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                { title: 'Landing Page Design', desc: 'Design a clean landing page for a fintech startup.', reward: '75 USDC', color: 'text-pink-400', bg: 'bg-pink-400/10' },
                                { title: 'ML Classification Task', desc: 'Train a classification model with 90%+ accuracy.', reward: '0.05 ETH', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                            ].map((job, idx) => (
                                <div key={idx} className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-sm text-foreground group-hover:text-[#6366F1] transition-colors">{job.title}</h4>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E]">Open</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-snug mb-3 line-clamp-2">{job.desc}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Reward</span>
                                        <span className={`font-mono font-semibold text-xs ${job.color}`}>{job.reward}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}
                <div>
                    <div className="relative w-full max-w-2xl mx-auto lg:ml-auto lg:mr-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 to-[#22C55E]/10 rounded-[3rem] blur-xl opacity-50" />
                        <div className="relative rounded-[3rem] w-96 h-96 mx-auto border-2 border-white/10 bg-[#0A0A0A]/80 backdrop-blur-2xl p-8 shadow-2xl overflow-hidden flex items-center justify-center">
                            <img
                                src="/hero.gif"
                                alt="ClaimR Platform Demo"
                                className="w-80 h-80 rounded-[2.5rem] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-24 duration-200 [--color-border:color-mix(in_oklab,var(--color-white)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border border-white/10 rounded-xl">{children}</div>
    </div>
);

const HowItWorksSection = () => (
    <section id="how-it-works" className="py-24 sm:py-32 relative border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
                <TextEffect triggerOnView preset="fade-in-blur" speedSegment={0.3} as="h2" className="text-3xl font-bold tracking-tight md:text-5xl">
                    How ClaimR Works
                </TextEffect>
            </div>
            <AnimatedGroup triggerOnView variants={({ container: { visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }, ...(transitionVariants as any) })} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: <Wallet className="text-[#6366F1]" />, title: 'Post a Bounty', desc: 'Companies and developers post tasks and lock crypto rewards in smart contracts.' },
                    { icon: <Upload className="text-[#22C55E]" />, title: 'Submit Solutions', desc: 'Students submit their work using their wallet address. No resumes needed.' },
                    { icon: <Bot className="text-orange-400" />, title: 'AI Evaluation', desc: 'AI automatically evaluates submissions and scores them fairly.' },
                    { icon: <Zap className="text-yellow-400" />, title: 'Automatic Payout', desc: 'Winning solutions get paid instantly through Ethereum smart contracts.' },
                ].map((item, idx) => (
                    <div key={idx} className="group p-8 rounded-[2rem] bg-black/50 border border-white/5 text-center hover:bg-white/[0.04] transition-colors relative overflow-hidden">
                        <CardDecorator>{item.icon}</CardDecorator>
                        <h3 className="mt-8 font-semibold text-lg">{item.title}</h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </AnimatedGroup>
        </div>
    </section>
);

const WhyProofOfWorkSection = () => (
    <section className="py-24 sm:py-32 border-b border-white/5 bg-foreground/[0.01]">
        <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
                <TextEffect triggerOnView preset="fade-in-blur" speedSegment={0.3} as="h2" className="text-3xl font-bold tracking-tight md:text-5xl">
                    Why ClaimR
                </TextEffect>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <Shield className="w-8 h-8 text-[#6366F1]" />, title: 'Trustless Payments', desc: 'Rewards are locked in smart contracts before work begins. No ghosting. Guaranteed payouts.' },
                    { icon: <MessageSquare className="w-8 h-8 text-[#22C55E]" />, title: 'AI Feedback', desc: 'Every submission gets feedback so you can improve and win future bounties.' },
                    { icon: <Briefcase className="w-8 h-8 text-orange-400" />, title: 'Skill-Based Hiring', desc: 'Companies discover talent through real work instead of resumes.' }
                ].map((item, idx) => (
                    <div key={idx} className="p-10 rounded-[2.5rem] bg-background border border-white/5 shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const SleepyYama = () => (
    <section className="py-24 sm:py-32 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Content */}
                <div className="max-w-xl">
                    <TextEffect preset="fade-in-blur" speedSegment={0.3} as="h2" className="text-4xl font-bold tracking-tight md:text-5xl mb-6">
                        Meet Your AI Evaluator
                    </TextEffect>
                    <TextEffect per="line" preset="fade-in-blur" speedSegment={0.3} delay={0.3} as="p" className="text-lg text-muted-foreground leading-relaxed mb-8">
                        Sleepy Yama is our intelligent AI system that fairly evaluates every submission. No bias. No delays. Just pure skill-based assessment powered by machine learning.
                    </TextEffect>
                    <AnimatedGroup variants={({ container: { visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } } }, ...(transitionVariants as any) })} className="space-y-4">
                        {[
                            { icon: <BrainCircuit className="w-5 h-5 text-[#6366F1]" />, text: "Smart evaluation with deep learning" },
                            { icon: <Shield className="w-5 h-5 text-[#22C55E]" />, text: "100% transparent scoring criteria" },
                            { icon: <Zap className="w-5 h-5 text-yellow-400" />, text: "Instant feedback on submissions" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                {item.icon}
                                <span className="text-sm text-foreground">{item.text}</span>
                            </div>
                        ))}
                    </AnimatedGroup>
                </div>

                {/* Right Image with Animation */}
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/30 to-[#22C55E]/20 rounded-3xl blur-2xl opacity-60 animate-pulse" />
                    <div className="relative border-2 border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-[#6366F1]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                        <img 
                            src="/sleepy-yama.jpg" 
                            alt="Sleepy Yama AI Evaluator" 
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        {/* Floating Badge */}
                        <div className="absolute top-6 right-6 bg-[#22C55E]/10 backdrop-blur-xl border border-[#22C55E]/30 rounded-full px-4 py-2 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                            </span>
                            <span className="text-xs font-semibold text-[#22C55E]">Live & Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FeaturedBountiesSection = () => (
    <section id="bounties" className="py-24 sm:py-32 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Featured Bounties</h2>
                    <p className="mt-4 text-muted-foreground text-lg">Pick up a side quest today.</p>
                </div>
                <GlowButton href="/dashboard">
                    View All Bounties
                </GlowButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#6366F1]/30 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center border border-[#6366F1]/20">
                            <Code className="w-6 h-6 text-[#6366F1]" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Build REST API in Node.js</h3>
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Create a REST API with authentication and CRUD endpoints.</p>
                    <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground uppercase font-mono">Reward</span>
                            <span className="font-semibold text-[#22C55E]">0.03 ETH</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground uppercase font-mono">Difficulty</span>
                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white/5">Intermediate</span>
                        </div>
                        <GlowButton href="/dashboard" className="w-full mt-4">
                            View Bounty
                        </GlowButton>
                    </div>
                </div>
                {/* Placeholder for design match, prompt said 'Card Top...' */}
                <div className="flex flex-col p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#6366F1]/30 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                            <Layout className="w-6 h-6 text-pink-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Figma UI Kit Design</h3>
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Design a dark mode UI kit for a decentralized exchange.</p>
                    <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground uppercase font-mono">Reward</span>
                            <span className="font-semibold text-white">100 USDC</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground uppercase font-mono">Difficulty</span>
                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white/5">Advanced</span>
                        </div>
                        <GlowButton href="/dashboard" className="w-full mt-4">
                            View Bounty
                        </GlowButton>
                    </div>
                </div>
                {/* Placeholder */}
                <div className="flex flex-col p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#6366F1]/30 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <BrainCircuit className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Solidity Smart Contract</h3>
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Write an escrow contract for freelancer payments.</p>
                    <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground uppercase font-mono">Reward</span>
                            <span className="font-semibold text-[#22C55E]">0.1 ETH</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground uppercase font-mono">Difficulty</span>
                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white/5">Advanced</span>
                        </div>
                        <GlowButton href="/dashboard" className="w-full mt-4">
                            View Bounty
                        </GlowButton>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const LeaderboardSection = () => (
    <section id="leaderboard" className="py-24 sm:py-32 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
                <TextEffect triggerOnView preset="fade-in-blur" speedSegment={0.3} as="h2" className="text-3xl font-bold tracking-tight md:text-5xl">
                    Top Solvers
                </TextEffect>
            </div>
            <div className="max-w-4xl mx-auto border border-white/10 rounded-[2rem] bg-white/[0.01] p-2 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-xs uppercase font-mono tracking-wider text-muted-foreground">
                                <th className="py-6 px-8 font-medium">Rank</th>
                                <th className="py-6 px-8 font-medium">Wallet</th>
                                <th className="py-6 px-8 font-medium text-center">Wins</th>
                                <th className="py-6 px-8 font-medium text-right">Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors rounded-xl">
                                <td className="py-6 px-8 font-bold text-[#6366F1]">1</td>
                                <td className="py-6 px-8 font-mono">0xA34...91F</td>
                                <td className="py-6 px-8 text-center">8</td>
                                <td className="py-6 px-8 text-right font-semibold text-[#22C55E]">0.35 ETH</td>
                            </tr>
                            <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="py-6 px-8 font-bold text-foreground">2</td>
                                <td className="py-6 px-8 font-mono">0xBB2...A11</td>
                                <td className="py-6 px-8 text-center">6</td>
                                <td className="py-6 px-8 text-right font-semibold text-[#22C55E]">0.28 ETH</td>
                            </tr>
                            <tr className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-6 px-8 font-bold text-muted-foreground">3</td>
                                <td className="py-6 px-8 font-mono">0xCC3...551</td>
                                <td className="py-6 px-8 text-center">5</td>
                                <td className="py-6 px-8 text-right font-semibold text-[#22C55E]">0.22 ETH</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
);

const DashboardBoxesPreview = () => (
    <section className="py-24 sm:py-32 border-b border-white/5 bg-[#6366F1]/[0.02] relative hidden md:block">
        {/* This section displays the Dashboard Boxes Important for App as requested by user to be in the landing layout */}
        <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
                <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">Platform Stats</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {[
                    { title: "Active Bounties", value: "24", icon: <Briefcase className="w-5 h-5 opacity-50" /> },
                    { title: "Total Rewards", value: "1.8 ETH", icon: <Wallet className="w-5 h-5 opacity-50" /> },
                    { title: "Your Submissions", value: "12", icon: <Upload className="w-5 h-5 opacity-50" /> },
                    { title: "Bounties Won", value: "3", icon: <Zap className="w-5 h-5 opacity-50 text-yellow-500" /> },
                ].map((box, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-background border border-border">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-muted-foreground">{box.title}</span>
                            {box.icon}
                        </div>
                        <p className="text-3xl font-bold font-mono text-foreground">{box.value}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CTASection = () => (
    <section className="py-24 sm:py-32 relative text-center">
        <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#6366F1] to-[#22C55E] opacity-[0.05] blur-[100px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-3xl px-6 relative z-10">
            <TextEffect triggerOnView preset="fade-in-blur" speedSegment={0.3} as="h2" className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
                Start Earning With Your Skills
            </TextEffect>
            <p className="text-lg text-muted-foreground mb-12">
                Join ProofOfWork and turn your skills into real crypto earnings.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <GlowButton href="/api/auth/login">
                    Connect Wallet
                </GlowButton>
                <GlowButton href="/dashboard">
                    Browse Bounties
                </GlowButton>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="border-t border-white/5 bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <Web3Logo />
                <div>
                    <span className="font-bold text-foreground block">ProofOfWork</span>
                    <span className="text-xs text-muted-foreground">Earn crypto by solving real problems.</span>
                </div>
            </div>

            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                <Link href="#docs" className="hover:text-foreground transition-colors">Docs</Link>
                <Link href="https://github.com" target="_blank" className="hover:text-foreground transition-colors">GitHub</Link>
                <Link href="https://twitter.com" target="_blank" className="hover:text-foreground transition-colors">Twitter</Link>
            </div>

            <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                Built on Ethereum Sepolia
            </div>
        </div>
    </footer>
);

export default function LandingPage() {
    return (
        <div className="dark font-sans text-foreground bg-background min-h-screen relative overflow-x-hidden selection:bg-[#6366F1] selection:text-white">
            {/* Background Effect */}
            <div className="absolute top-0 left-0 w-full h-[150vh] pointer-events-none z-0">
                <Dither
                    waveColor={[0.13, 0.77, 0.36]} // Hex #22C55E approx RGB
                    disableAnimation={false}
                    enableMouseInteraction
                    mouseRadius={0.3}
                    colorNum={4}
                    pixelSize={2}
                    waveAmplitude={0.3}
                    waveFrequency={3}
                    waveSpeed={0.05}
                />
            </div>

            <Navbar />

            <main className="relative z-10 w-full overflow-hidden">
                <HeroSection />
                <HowItWorksSection />
                <WhyProofOfWorkSection />
                <SleepyYama />
                <FeaturedBountiesSection />
                <LeaderboardSection />
                <DashboardBoxesPreview />
                <CTASection />
            </main>

            <Footer />
        </div>
    );
}
