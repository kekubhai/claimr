// src/app/bounties/[bountyId]/page.tsx
import { auth0 } from "@/lib/auth0";
import Navbar from "@/components/Navbar";
import BountyDetailsClient from "./BountyDetailsClient";

export default async function BountyDetailsPage({ 
  params 
}: { 
  params: Promise<{ bountyId: string }> 
}) {
  const resolvedParams = await params;
  
  // Grab the user session to pass down
  let session = null;
  try {
    session = await auth0.getSession();
  } catch (e) {
    session = null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Navbar user={session?.user} />

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        <BountyDetailsClient 
          bountyId={resolvedParams.bountyId} 
          userEmail={session?.user?.email} 
        />
      </main>
    </div>
  );
}