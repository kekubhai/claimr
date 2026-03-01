'use client';

import React from 'react';

interface Dot {
  id: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  size: number;
}

const generateDots = (count: number): Dot[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    size: 4 + Math.random() * 16,
  }));
};

export const FloatingDots = () => {
  const [dots] = React.useState<Dot[]>(generateDots(50));

  return (
    <>
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? 100 : -100}px);
            opacity: 0;
          }
        }

        .floating-dot {
          position: fixed;
          pointer-events: none;
          border-radius: 500%;
          background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.8), rgba(34, 197, 94, 0.2));
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(34, 197, 94, 0.2);
          z-index: 1;
        }
      `}</style>

      {dots.map((dot) => (
        <div
          key={dot.id}
          className="floating-dot"
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size + 'px',
            height: dot.size + 'px',
            animation: `float-up ${dot.duration}s ease-in infinite`,
            animationDelay: dot.delay + 's',
          }}
        />
      ))}
    </>
  );
};
