'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dot = ({ id }: { id: number }) => {
    // Memoize config to prevent rerenders changing base values
    const config = useMemo(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1, // smaller and more elegant
        duration: Math.random() * 30 + 30, // even slower and more hypnotic
        delay: Math.random() * -40,
        // Mix of brand colors: Indigo, Green, Emerald
        color: ['#6366F1', '#22C55E', '#10B981'][Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.3 + 0.1,
    }), []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0, config.opacity, 0],
                x: [
                    `${config.x}%`,
                    `${config.x + (Math.random() * 10 - 5)}%`,
                    `${config.x}%`
                ],
                y: [
                    `${config.y}%`,
                    `${config.y + (Math.random() * 10 - 5)}%`,
                    `${config.y}%`
                ],
            }}
            transition={{
                duration: config.duration,
                repeat: Infinity,
                delay: config.delay,
                ease: "linear", // smooth continuous movement
            }}
            className="absolute rounded-none pointer-events-none" // NO ROUNDED CORNERS applied here too for consistency
            style={{
                width: config.size,
                height: config.size,
                left: 0,
                top: 0,
                backgroundColor: config.color,
                boxShadow: `0 0 ${config.size * 6}px ${config.color}`,
                filter: 'blur(0.2px)',
            }}
        />
    );
};

export default function FloatingDots() {
    const [mounted, setMounted] = useState(false);
    const dotCount = 80;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]"
            style={{
                background: 'transparent',
                // Subtle vignette to focus attention
                boxShadow: 'inset 0 0 150px rgba(0,0,0,0.5)'
            }}
        >
            <AnimatePresence>
                {Array.from({ length: dotCount }).map((_, i) => (
                    <Dot key={i} id={i} />
                ))}
            </AnimatePresence>

            {/* Ambient pulse layer */}
            <motion.div
                animate={{
                    opacity: [0.03, 0.08, 0.03]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 70%)'
                }}
            />
        </div>
    );
}
