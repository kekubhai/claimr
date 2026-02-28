'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dot = ({ id }: { id: number }) => {
    const [initialConfig] = useState(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1, // smaller dots for elegancy
        duration: Math.random() * 20 + 20, // slower for beauty
        delay: Math.random() * -20,
        color: Math.random() > 0.5 ? '#22C55E' : '#10B981', // green vs emerald
    }));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.2, 1],
                x: [
                    `${initialConfig.x}%`,
                    `${initialConfig.x + (Math.random() * 15 - 7.5)}%`,
                    `${initialConfig.x}%`
                ],
                y: [
                    `${initialConfig.y}%`,
                    `${initialConfig.y + (Math.random() * 15 - 7.5)}%`,
                    `${initialConfig.y}%`
                ],
            }}
            transition={{
                duration: initialConfig.duration,
                repeat: Infinity,
                delay: initialConfig.delay,
                ease: "easeInOut",
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
                width: initialConfig.size,
                height: initialConfig.size,
                left: 0,
                top: 0,
                backgroundColor: initialConfig.color,
                boxShadow: `0 0 ${initialConfig.size * 3}px ${initialConfig.color}`,
                filter: 'blur(0.5px)',
            }}
        />
    );
};

export default function FloatingDots() {
    const [dots, setDots] = useState<number[]>([]);

    useEffect(() => {
        setDots(Array.from({ length: 50 }, (_, i) => i));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-transparent">
            <AnimatePresence>
                {dots.map((id) => (
                    <Dot key={id} id={id} />
                ))}
            </AnimatePresence>
            {/* Add a subtle radial gradient to the center to pull everything together */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20 pointer-events-none" />
        </div>
    );
}
