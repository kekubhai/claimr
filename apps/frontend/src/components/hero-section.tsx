import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import V0Icon from "@/components/icons/v0-icon";
import VercelWordmarkIcon from "@/components/icons/vercel-wordmark-icon";
import GlobantLogoIcon from "@/components/icons/globant-logo-icon";
import DecryptedText from "@/components/DecryptedText";
import { transitionVariants } from "@/lib/utils";
import LanyardWithControls from "@/components/lanyard-with-controls";

export default function HeroSection() {
    return (
        <main className="overflow-x-hidden">
            <section className='lg:h-screen'>
                <div
                    className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44 lg:grid lg:grid-cols-2 lg:grid-rows-1 grid-cols-1 grid-rows-2">
                    <div className="relative mx-auto flex max-w-xl flex-col px-6 lg:block">
                        <div className="mx-auto max-w-2xl text-center lg:ml-0 lg:text-left">
                            <div className='mt-8 lg:mt-16'>
                                <DecryptedText
                                    text="Live on Ethereum Sepolia"
                                    animateOn="hover"
                                    revealDirection="start"
                                    sequential
                                    useOriginalCharsOnly={false}
₹                                    speed={70}
                                    className='font-bold text-black bg-[#0A0A0A] px-3 py-1.5 rounded-none uppercase text-sm border border-white/20 shadow-lg tracking-wider font-semibold z-10 relative inline-block'
                                />
                            </div>
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="max-w-2xl text-balance text-5xl font-extrabold md:text-6xl xl:text-7xl">
                                Earn Crypto
                            </TextEffect>
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="max-w-2xl text-balance text-5xl font-extrabold md:text-6xl xl:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#22C55E] mt-2 pb-2">
                                Solving Real Problems
                            </TextEffect>
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={0.5}
                                as="p"
                                className="mt-8 max-w-2xl text-pretty text-lg text-white/70 p-1">
                                Companies post bounties. Students solve them. AI evaluates submissions. Winners get paid automatically on Ethereum.
                            </TextEffect>
                            <AnimatedGroup
                                variants={({
                                    container: {
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                delayChildren: 0.75,
                                            },
                                        },
                                    },
                                    ...transitionVariants,
                                } as any)}
                                className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start"
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    className="px-8 py-6 rounded-full bg-[#6366F1] text-white font-semibold hover:bg-[#6366F1]/90 transition-all text-base border-0">
                                    <Link href="/api/auth/login?returnTo=/dashboard">
                                        <span className="text-nowrap">Start Solving</span>
                                    </Link>
                                </Button>
                                <Button
                                    key={2}
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="px-8 py-6 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all text-base">
                                    <Link href="/dashboard">
                                        <span className="text-nowrap">Post a Bounty</span>
                                    </Link>
                                </Button>
                            </AnimatedGroup>
                            <p className="mt-6 text-sm text-[#E5E7EB]/50 font-medium">
                                Secure payouts powered by Ethereum Sepolia smart contracts
                            </p>
                        </div>
                    </div>
                    <LanyardWithControls
                        position={[0, 0, 20]}
                        containerClassName='lg:absolute lg:top-0 lg:right-0 lg:w-1/2 relative w-full h-screen bg-radial lg:from-transparent lg:to-transparent from-muted to-background select-none'
                        defaultName="" />
                </div>
            </section>
        </main>
    )
}
