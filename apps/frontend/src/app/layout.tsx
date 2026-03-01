import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import { ConvexClientProvider } from "./convexClientProvider";
import { WagmiProviderWrapper } from "@/components/WagmiProviderWrapper";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "CLAIMR",
  description: "Claim bounties. Ship proof. Get paid.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        suppressHydrationWarning
        className={`${mono.variable} font-[family-name:var(--font-mono)] bg-black text-white antialiased`}
      >
        <WagmiProviderWrapper>
          <ConvexClientProvider>
            <Auth0Provider>
              {children}
            </Auth0Provider>
          </ConvexClientProvider>
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}
