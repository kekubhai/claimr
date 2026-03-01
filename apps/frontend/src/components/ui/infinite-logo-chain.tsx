'use client';

import React from 'react';

const logos = [
  '/web3 logo/ethereum-logo.png',
  '/web3 logo/polygon-logo.png',
  '/web3 logo/solana-logo.png',
  '/web3 logo/aave-logo.png',
  '/web3 logo/chainlink-logo.png',
  '/web3 logo/celo-logo.png',
  '/web3 logo/bitcoin-logo.png',
];

export const InfiniteLogoChain = () => {
  // Duplicate logos for seamless infinite loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-transparent via-black/10 to-transparent py-8">
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-${logos.length} * 120px));
          }
        }
        
        .logo-chain {
          display: flex;
          gap: 2rem;
          animation: scroll-left 30s linear infinite;
          width: fit-content;
        }
        
        .logo-chain:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="logo-chain">
        {duplicatedLogos.map((logo, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
          >
            <img
              src={logo}
              alt={`Web3 Logo ${idx}`}
              className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
