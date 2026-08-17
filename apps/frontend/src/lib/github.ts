/**
 * Server-only GitHub integration.
 *
 * Every repository lookup in this file is derived from the *authenticated Auth0
 * session*. Nothing here accepts a username from the client, and there is no
 * fallback to any hardcoded/developer account: if we cannot resolve a GitHub
 * identity for the current session we report "not-connected" instead.
 */
import { ConvexHttpClient } from "convex/browser";
import { auth0 } from "@/lib/auth0";
import { api } from "../../convex/_generated/api";

// ── TYPES ──
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  size: number;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  created_at: string;
  visibility: string;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  blog: string | null;
}

export type GitHubProjectsResult =
  /** No Auth0 session — nothing is fetched from GitHub at all. */
  | { status: "unauthenticated" }
  /** Signed in, but this account has no GitHub identity we can resolve. */
  | { status: "not-connected" }
  /** GitHub was reachable but refused/failed the request. */
  | { status: "error"; message: string }
  | {
      status: "ok";
      login: string;
      profile: GitHubUser | null;
      repos: GitHubRepo[];
      /** "token" = OAuth-authenticated (may include private repos). */
      source: "token" | "public";
    };

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
} as const;

/**
 * The Next.js fetch cache keys on URL + method + body — NOT on headers. Any
 * token-authenticated call therefore has to opt out of it, otherwise one user's
 * `GET /user/repos` response would be served to the next user. Public,
 * username-scoped URLs are safe to cache because the username is in the key.
 */
const NO_STORE = { cache: "no-store" } as const;
const PUBLIC_CACHE = { next: { revalidate: 300 } } as const;

// ── IDENTITY RESOLUTION ──

/**
 * Auth0 v4 exposes the upstream (federated) GitHub token through Token Vault.
 * It is typed structurally so this compiles whether or not the installed SDK
 * ships the method, and is feature-detected at runtime.
 */
type ConnectionTokenClient = {
  getAccessTokenForConnection?: (options: {
    connection: string;
  }) => Promise<{ token?: string } | null | undefined>;
};

async function getGitHubConnectionToken(): Promise<string | null> {
  const client = auth0 as unknown as ConnectionTokenClient;
  if (typeof client.getAccessTokenForConnection !== "function") return null;
  try {
    const result = await client.getAccessTokenForConnection({
      connection: "github",
    });
    return result?.token ?? null;
  } catch {
    // Token Vault not enabled, user did not log in with GitHub, or the grant
    // expired. Fall through to the non-token identity sources.
    return null;
  }
}

/**
 * Auth0 encodes social identities as `<connection>|<provider user id>`, so a
 * GitHub login yields e.g. `github|583231`. The numeric id is stable across
 * username changes, so we prefer it over the `nickname` claim.
 */
function githubIdFromSub(sub: unknown): string | null {
  if (typeof sub !== "string") return null;
  const match = /^github\|(\d+)$/.exec(sub);
  return match ? match[1] : null;
}

async function loginFromGitHubId(id: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/user/${id}`, {
      headers: GH_HEADERS,
      ...PUBLIC_CACHE,
    });
    if (!res.ok) return null;
    const user = (await res.json()) as { login?: string };
    return user.login ?? null;
  } catch {
    return null;
  }
}

/**
 * Accounts that signed in with something other than GitHub can still link a
 * GitHub username from their profile (Convex `users.githubUsername`). It is
 * looked up by the *session* email, never by anything the client sends.
 */
async function linkedUsernameFromProfile(
  email: string | undefined
): Promise<string | null> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!email || !convexUrl) return null;
  try {
    const convex = new ConvexHttpClient(convexUrl);
    const details = await convex.query(api.userFunctions.getUserDetails, {
      email,
    });
    const username = details?.githubUsername?.trim();
    return username ? username : null;
  } catch {
    return null;
  }
}

// ── RANKING ──
function repoScore(r: GitHubRepo): number {
  let score = 0;
  score += Math.min(r.stargazers_count * 12, 36);
  score += Math.min(r.forks_count * 8, 24);
  score += Math.min(r.watchers_count * 4, 8);
  if (r.description && r.description.trim().length > 15) score += 15;
  if (r.language) score += 8;
  score += Math.min((r.topics?.length ?? 0) * 3, 12);
  if (r.homepage && r.homepage.trim()) score += 10;
  const daysSinceUpdate = (Date.now() - new Date(r.updated_at).getTime()) / 86400000;
  if (daysSinceUpdate < 90) score += 20;
  else if (daysSinceUpdate < 180) score += 14;
  else if (daysSinceUpdate < 365) score += 8;
  if (r.size >= 500) score += 10;
  else if (r.size >= 100) score += 6;
  else if (r.size >= 20) score += 3;
  if (r.open_issues_count > 0) score += 5;
  return score;
}

function rankRepos(repos: GitHubRepo[], login: string): GitHubRepo[] {
  return repos
    .filter((r) => !r.archived && !r.fork && r.name !== login)
    .map((r) => ({ ...r, topics: r.topics ?? [] }))
    .sort((a, b) => repoScore(b) - repoScore(a))
    .slice(0, 12);
}

// ── FETCHERS ──
async function fetchPublicProfile(login: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
      headers: GH_HEADERS,
      ...PUBLIC_CACHE,
    });
    if (!res.ok) return null;
    return (await res.json()) as GitHubUser;
  } catch {
    return null;
  }
}

/** Returns `null` when the token itself is rejected, so the caller can fall
 *  back to the (still user-scoped) public identity instead of dead-ending. */
async function fetchWithToken(token: string): Promise<GitHubProjectsResult | null> {
  const authHeaders = { ...GH_HEADERS, Authorization: `Bearer ${token}` };

  let profileRes: Response;
  let reposRes: Response;
  try {
    [profileRes, reposRes] = await Promise.all([
      // Who the token belongs to — the authenticated user, by definition.
      fetch("https://api.github.com/user", { headers: authHeaders, ...NO_STORE }),
      fetch(
        "https://api.github.com/user/repos?sort=pushed&per_page=100&affiliation=owner&visibility=all",
        { headers: authHeaders, ...NO_STORE }
      ),
    ]);
  } catch {
    return { status: "error", message: "could not reach the github api" };
  }

  if (profileRes.status === 401 || reposRes.status === 401) return null;

  if (!profileRes.ok || !reposRes.ok) {
    return {
      status: "error",
      message: `github api responded ${!profileRes.ok ? profileRes.status : reposRes.status}`,
    };
  }

  const profile = (await profileRes.json()) as GitHubUser;
  const repos = (await reposRes.json()) as GitHubRepo[];

  return {
    status: "ok",
    login: profile.login,
    profile,
    repos: rankRepos(repos, profile.login),
    source: "token",
  };
}

async function fetchPublic(login: string): Promise<GitHubProjectsResult> {
  let res: Response;
  try {
    res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(login)}/repos?sort=pushed&per_page=100&type=owner`,
      { headers: GH_HEADERS, ...PUBLIC_CACHE }
    );
  } catch {
    return { status: "error", message: "could not reach the github api" };
  }

  if (res.status === 404) {
    // The linked username does not exist (typo in the profile, renamed account).
    return { status: "not-connected" };
  }
  if (!res.ok) {
    return { status: "error", message: `github api responded ${res.status}` };
  }

  const repos = (await res.json()) as GitHubRepo[];
  const profile = await fetchPublicProfile(login);

  return {
    status: "ok",
    login,
    profile,
    repos: rankRepos(repos, login),
    source: "public",
  };
}

// ── PUBLIC ENTRY POINT ──

/**
 * Resolves the repositories of whoever is currently logged in.
 *
 * Order of preference:
 *   1. GitHub OAuth token from the Auth0 session (Token Vault) → GET /user + /user/repos
 *   2. GitHub identity on the Auth0 session (`sub` = `github|<id>`, else `nickname`)
 *   3. GitHub username the user linked on their own Claimr profile (Convex)
 */
export async function getGitHubProjectsForCurrentUser(): Promise<GitHubProjectsResult> {
  let session: Awaited<ReturnType<typeof auth0.getSession>> = null;
  try {
    session = await auth0.getSession();
  } catch {
    // A malformed/expired session cookie is treated as signed out.
    session = null;
  }

  const user = session?.user;
  if (!user) return { status: "unauthenticated" };

  // 1. Federated GitHub token — the only path that can see private repos.
  //    A rejected token falls through to the public, still user-scoped, paths.
  const token = await getGitHubConnectionToken();
  if (token) {
    const tokenResult = await fetchWithToken(token);
    if (tokenResult) return tokenResult;
  }

  // 2. GitHub identity carried on the Auth0 session itself.
  const githubId = githubIdFromSub(user.sub);
  let login = githubId ? await loginFromGitHubId(githubId) : null;

  if (!login && githubId && typeof user.nickname === "string" && user.nickname.trim()) {
    // Signed in with GitHub, but the id lookup failed (rate limit) — the
    // nickname claim holds the GitHub login for the github connection.
    login = user.nickname.trim();
  }

  // 3. Username the user linked on their Claimr profile.
  if (!login) {
    login = await linkedUsernameFromProfile(
      typeof user.email === "string" ? user.email : undefined
    );
  }

  if (!login) return { status: "not-connected" };

  return fetchPublic(login);
}
