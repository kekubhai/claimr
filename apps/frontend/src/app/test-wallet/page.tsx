"use client";

import { useState } from 'react';
import ConnectWalletButton from '../../components/ConnectWalletButton';
import { SETTLEMENT_CHAIN } from '../../config/settlement';

export default function TestWalletPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Wallet Connection Test</h1>
        
        <div className="mb-6 p-4 border border-gray-700 rounded">
          <h2 className="text-xl font-semibold mb-2">Current Settlement Chain</h2>
          <p className="text-green-400 text-lg">{SETTLEMENT_CHAIN}</p>
          <p className="text-gray-400 text-sm mt-1">
            {SETTLEMENT_CHAIN === 'stellar' ? 'Using Freighter Wallet' : 'Using MetaMask'}
          </p>
        </div>

        <div className="mb-6 p-4 border border-gray-700 rounded">
          <h2 className="text-xl font-semibold mb-2">Wallet Connection</h2>
          <ConnectWalletButton 
            onWalletConnected={(address) => setWalletAddress(address)}
            onWalletDisconnected={() => setWalletAddress(null)}
          />
        </div>

        {walletAddress && (
          <div className="p-4 border border-green-500 rounded bg-green-500/10">
            <h2 className="text-xl font-semibold mb-2 text-green-400">Connected!</h2>
            <p className="text-green-400">Wallet Address: {walletAddress}</p>
          </div>
        )}

        <div className="mt-8 p-4 border border-gray-700 rounded">
          <h2 className="text-xl font-semibold mb-2">Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Ensure you have the appropriate wallet installed:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>For Stellar: Install Freighter Wallet extension</li>
                <li>For Ethereum: Install MetaMask extension</li>
              </ul>
            </li>
            <li>Set <code className="bg-gray-800 px-2 py-1 rounded">NEXT_PUBLIC_SETTLEMENT_CHAIN</code> in .env.local</li>
            <li>Click the connect button above</li>
            <li>Verify the wallet address appears after connection</li>
          </ol>
        </div>
      </div>
    </div>
  );
}