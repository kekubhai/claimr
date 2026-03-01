import { auth0 } from "@/lib/auth0";
import Navbar from "@/components/Navbar";
import LeaderboardClient from "./LeaderboardClient";

export default async function LeaderboardPage() {
  let session = null;

  try {
    session = await auth0.getSession();
  } catch (error) {
    session = null;
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Navbar user={user} />

      {/* ── MAIN CONTENT ── */}
      <main className="mx-auto max-w-5xl px-6 py-12 md:px-12">
        <LeaderboardClient />
      </main>
    </div>
  );
}