import Navbar from "@/components/Navbar";
import { auth0 } from "@/lib/auth0";
import {
  getGitHubProjectsForCurrentUser,
  type GitHubRepo,
} from "@/lib/github";

/**
 * Repository data is per-user and derived from the session cookie, so this page
 * must never be statically rendered or shared between users.
 */
export const dynamic = "force-dynamic";

const langColor: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3572A5",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Solidity: "#AA6746",
  "Jupyter Notebook": "#DA5B0B",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// ── SHARED SHELL ──
function Shell({
  user,
  children,
}: {
  user?: unknown;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Navbar user={user} />
      <main className="mx-auto max-w-6xl px-6 py-12 md:px-12">{children}</main>
    </div>
  );
}

function Notice({
  label,
  title,
  body,
  action,
}: {
  label: string;
  title: string;
  body: string;
  action?: { href: string; text: string };
}) {
  return (
    <section className="border border-[#1E1E2E] bg-[#0A0A0F] p-12 text-center">
      <p className="mb-3 text-xs uppercase tracking-widest text-white/40">{label}</p>
      <h1 className="mb-4 text-2xl md:text-3xl font-bold uppercase tracking-widest text-white">
        {title}
      </h1>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-white/60">{body}</p>
      {action && (
        <a
          href={action.href}
          className="mt-8 inline-block border border-[#22C55E] bg-[#22C55E]/10 px-6 py-3 text-xs uppercase tracking-widest text-[#22C55E] transition-colors hover:bg-[#22C55E] hover:text-black"
        >
          {action.text}
        </a>
      )}
    </section>
  );
}

// ── MAIN COMPONENT ──
export default async function ProjectsPage() {
  // The GitHub identity comes from the authenticated session only — there is no
  // username query parameter and no developer-account fallback.
  const result = await getGitHubProjectsForCurrentUser();

  if (result.status === "unauthenticated") {
    return (
      <Shell>
        <Notice
          label="// access_denied"
          title="Sign in to see your work"
          body="Your GitHub repositories are loaded from your own account. Log in to continue."
          action={{ href: "/auth/login", text: "[ login ]" }}
        />
      </Shell>
    );
  }

  // Signed in from here on — the session is needed for the navbar avatar.
  const session = await auth0.getSession().catch(() => null);
  const user = session?.user ?? null;

  if (result.status === "not-connected") {
    return (
      <Shell user={user}>
        <Notice
          label="// github_not_linked"
          title="Connect your GitHub"
          body="No GitHub account is linked to this profile yet. Add your GitHub username from your dashboard profile, or log in with GitHub, and your repositories will show up here."
          action={{ href: "/", text: "[ link github account ]" }}
        />
      </Shell>
    );
  }

  if (result.status === "error") {
    return (
      <Shell user={user}>
        <Notice
          label="// github_api_error"
          title="Could not reach GitHub"
          body={`${result.message}. This is a temporary problem on the GitHub side — try again in a moment.`}
          action={{ href: "/projects", text: "[ retry ]" }}
        />
      </Shell>
    );
  }

  const { login, profile, repos: repoList } = result;

  return (
    <Shell user={user}>
      {/* ── HEADER ── */}
      <header className="mb-14">
        <p className="mb-3 text-xs uppercase tracking-widest text-white/50">
          // github.com/{login}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white mb-4">
          Open <span className="text-[#22C55E]">Source</span> Work
        </h1>
        <p className="text-white/60 max-w-xl leading-relaxed text-sm">
          Repositories from{" "}
          <a href={`https://github.com/${login}`} target="_blank" rel="noopener noreferrer" className="text-[#22C55E] hover:underline">
            @{login}
          </a>{" "}
          — fetched live from the GitHub API.
        </p>
      </header>

      {/* ── GITHUB PROFILE CARD ── */}
      {profile && (
        <section className="mb-14 border border-[#1E1E2E] bg-[#0A0A0F] p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatar_url} alt={profile.login} className="w-16 h-16 rounded-full border border-[#1E1E2E] grayscale" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span className="text-white font-bold text-lg">{profile.name ?? profile.login}</span>
              <span className="text-xs text-white/40 uppercase tracking-widest">@{profile.login}</span>
            </div>
            {profile.bio && <p className="text-white/60 text-sm leading-relaxed mb-3 max-w-xl">{profile.bio}</p>}
            <div className="flex flex-wrap gap-6 text-xs text-white/50">
              <span><span className="text-white font-bold">{profile.public_repos}</span> repos</span>
              <span><span className="text-white font-bold">{profile.followers}</span> followers</span>
              <span><span className="text-white font-bold">{profile.following}</span> following</span>
              {profile.location && <span>📍 {profile.location}</span>}
            </div>
          </div>
          <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="shrink-0 border border-[#22C55E] bg-[#22C55E]/10 px-5 py-2 text-xs text-[#22C55E] uppercase tracking-widest hover:bg-[#22C55E] hover:text-black transition-colors">
            [ view profile ]
          </a>
        </section>
      )}

      {/* ── STATS BAR ── */}
      <div className="mb-10 flex flex-wrap gap-6 text-xs text-white/50 border-b border-[#1E1E2E] pb-6">
        <span><span className="text-[#22C55E] font-bold">{repoList.length}</span> repositories shown</span>
        <span><span className="text-white font-bold">{repoList.reduce((a, r) => a + r.stargazers_count, 0)}</span> total stars</span>
        <span><span className="text-white font-bold">{repoList.reduce((a, r) => a + r.forks_count, 0)}</span> total forks</span>
        <span className="ml-auto text-white/30 text-[10px] uppercase tracking-wider">// ranked by quality score</span>
      </div>

      {/* ── REPO GRID ── */}
      {repoList.length === 0 ? (
        <div className="border border-[#1E1E2E] p-12 text-center text-white/40 text-sm">
          // no repositories found
        </div>
      ) : (
        <div className="grid gap-px border border-[#1E1E2E] md:grid-cols-2 lg:grid-cols-3">
          {repoList.map((repo: GitHubRepo) => {
            const tags = [...(repo.language ? [repo.language] : []), ...repo.topics.slice(0, 3)].slice(0, 4);

            return (
              <article key={repo.id} className="group relative flex flex-col gap-3 border border-[#1E1E2E] bg-black p-5 transition-colors hover:bg-[#0D0D0D]">
                <div className="flex items-start justify-between gap-2">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-wide text-white group-hover:text-[#22C55E] transition-colors leading-tight">
                    {repo.name}
                  </a>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[10px] border border-[#1E1E2E] px-2 py-0.5 text-white/40 hover:border-[#22C55E] hover:text-[#22C55E] transition-colors uppercase tracking-wider">
                      live ↗
                    </a>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-white/50 line-clamp-2 min-h-[2.5rem]">
                  {repo.description ?? "// no description"}
                </p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="border border-[#1E1E2E] px-2 py-0.5 text-[10px] uppercase tracking-wider" style={tag === repo.language && langColor[tag] ? { color: langColor[tag], borderColor: `${langColor[tag]}40` } : { color: "rgb(255 255 255 / 0.4)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between border-t border-[#1E1E2E] pt-3 text-[10px] text-white/30">
                  <div className="flex items-center gap-3">
                    {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
                    {repo.forks_count > 0 && <span>⑂ {repo.forks_count}</span>}
                    {repo.open_issues_count > 0 && <span className="text-[#EAB308]">● {repo.open_issues_count} issues</span>}
                  </div>
                  <span className="uppercase tracking-wider">{timeAgo(repo.updated_at)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <footer className="mt-16 border-t border-[#1E1E2E] pt-8 text-xs text-white/30 flex items-center justify-between">
        <p>// data fetched live from github.com/{login}</p>
        <a href={`https://github.com/${login}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="hover:text-[#22C55E] transition-colors uppercase tracking-wider">
          view all on github ↗
        </a>
      </footer>
    </Shell>
  );
}
