'use client';

import { ReactNode, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';

const queryClient = new QueryClient();

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Suppress MetaMask SDK analytics and expected errors
    // These are harmless and don't affect wallet functionality
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args: unknown[]) => {
      const message = String(args[0]);
      
      // Suppress MetaMask SDK errors that don't affect functionality
      if (
        message.includes('Failed to send batch') ||
        message.includes('ERR_BLOCKED_BY_CLIENT') ||
        message.includes('Sender: Failed to send batch') ||
        message.includes('metamask')
      ) {
        return; // Silently ignore
      }
      
      originalError(...args);
    };

    console.warn = (...args: unknown[]) => {
      const message = String(args[0]);
      
      // Suppress porto and other wagmi-related warnings
      if (
        message.includes('porto') ||
        message.includes('MetaMask')
      ) {
        return; // Silently ignore
      }
      
      originalWarn(...args);
    };

    // Intercept fetch to prevent MetaMask analytics requests
    const originalFetch = window.fetch;
    window.fetch = function(...args: Parameters<typeof fetch>) {
      const resource = args[0];
      const url = typeof resource === 'string' ? resource : (resource instanceof Request ? resource.url : '');
      
      // Block MetaMask analytics requests at the network level
      if (typeof url === 'string' && url.includes('mm-sdk-analytics')) {
        // Return a fake successful response so MetaMask SDK doesn't retry
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), { 
            status: 200,
            statusText: 'OK'
          })
        );
      }
      
      return originalFetch.apply(this, args as Parameters<typeof fetch>);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
