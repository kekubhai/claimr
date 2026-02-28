import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import FloatingDots from "@/components/FloatingDots";
import "./globals.css";

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
      <body className={`${mono.variable} font-[family-name:var(--font-mono)] bg-black text-white antialiased relative`}>
        <FloatingDots />
        <Auth0Provider>
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
