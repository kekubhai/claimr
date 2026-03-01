"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect } from 'react';

interface ConnectWalletButtonProps {
  onWalletConnected?: (address: string) => void;
  onWalletDisconnected?: () => void;
  className?: string;
}

export default function ConnectWalletButton({
  onWalletConnected,
  onWalletDisconnected,
  className = "border border-[#22C55E] text-[#22C55E] px-4 py-3 text-xs uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors",
}: ConnectWalletButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  // Auto-trigger MetaMask connection when component mounts
  useEffect(() => {
    if (isConnected && address && onWalletConnected) {
      onWalletConnected(address);
    }
  }, [isConnected, address, onWalletConnected]);

  // Get MetaMask connector
  const metaMaskConnector = connectors.find(c => c.name === 'MetaMask');

  const handleConnectMetaMask = () => {
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 border border-[#22C55E] bg-[#22C55E]/10">
        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
        <span className="text-xs text-[#22C55E] uppercase tracking-wider font-semibold">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={() => { disconnect(); onWalletDisconnected?.(); }}
          className="text-xs text-[#22C55E] hover:text-red-400 transition-colors uppercase tracking-wider font-semibold ml-auto"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnectMetaMask}
        disabled={isPending || !metaMaskConnector}
        className={className}
        style={{ width: '100%' }}
      >
        {isPending ? "Connecting to MetaMask..." : "[ Connect Wallet ]"}
      </button>

      {!metaMaskConnector && (
        <p className="text-xs text-red-400 mt-1">MetaMask not detected. Please install MetaMask extension.</p>
      )}

      {connectError && (
        <p className="text-xs text-red-400 mt-1">{connectError.message}</p>
      )}
    </div>
  );
}