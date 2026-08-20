"use client";

import { useEffect, useState } from 'react';
import { 
  isConnected, 
  getPublicKey, 
  signTransaction 
} from '@stellar/freighter-api';

interface FreighterConnectButtonProps {
  onWalletConnected?: (address: string) => void;
  onWalletDisconnected?: () => void;
  className?: string;
}

export default function FreighterConnectButton({
  onWalletConnected,
  onWalletDisconnected,
  className = "border border-[#22C55E] text-[#22C55E] px-4 py-3 text-xs uppercase tracking-wider hover:bg-[#22C55E] hover:text-black transition-colors",
}: FreighterConnectButtonProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);

  useEffect(() => {
    // Check if Freighter is available
    const checkFreighter = async () => {
      try {
        const isAvailable = await isConnected();
        setIsFreighterAvailable(isAvailable);
        
        if (isAvailable) {
          const walletAddress = await getPublicKey();
          if (walletAddress) {
            setAddress(walletAddress);
            setIsConnected(true);
            onWalletConnected?.(walletAddress);
          }
        }
      } catch (err) {
        console.error('Freighter check failed:', err);
        setIsFreighterAvailable(false);
      }
    };

    checkFreighter();
  }, [onWalletConnected]);

  const handleConnect = async () => {
    if (!isFreighterAvailable) {
      setError('Freighter wallet not detected. Please install Freighter extension.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const walletAddress = await getPublicKey();
      if (walletAddress) {
        setAddress(walletAddress);
        setIsConnected(true);
        onWalletConnected?.(walletAddress);
      }
    } catch (err) {
      setError('Failed to connect to Freighter wallet');
      console.error('Freighter connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setIsConnected(false);
    onWalletDisconnected?.();
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 border border-[#22C55E] bg-[#22C55E]/10">
        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
        <span className="text-xs text-[#22C55E] uppercase tracking-wider font-semibold">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={handleDisconnect}
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
        onClick={handleConnect}
        disabled={isConnecting || !isFreighterAvailable}
        className={className}
        style={{ width: '100%' }}
      >
        {isConnecting ? "Connecting to Freighter..." : "[ Connect Freighter ]"}
      </button>

      {!isFreighterAvailable && (
        <p className="text-xs text-red-400 mt-1">Freighter wallet not detected. Please install Freighter extension.</p>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}