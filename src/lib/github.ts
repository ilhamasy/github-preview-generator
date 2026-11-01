import { RepoMetadata } from "@/types/preview";
import { getLanguageColor } from "./languages";

export interface FetchRepoResult {
  data?: RepoMetadata;
  error?: string;
  rateLimitRemaining?: number;
  rateLimitReset?: number;
}

/**
 * Fetches repository metadata and contributors from GitHub REST API.
 */
export async function fetchGitHubRepoData(
  owner: string,
  repo: string,
  token?: string
): Promise<FetchRepoResult> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitHub-Preview-Generator-App",
  };

  const authToken = token || process.env.GITHUB_TOKEN;
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    // 1. Fetch repository general metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 60 }, // Cache on server for 60 seconds
    });

    const rateLimitRemaining = Number(repoRes.headers.get("x-ratelimit-remaining") || 60);
    const rateLimitReset = Number(repoRes.headers.get("x-ratelimit-reset") || 0);

    if (repoRes.status === 404) {
      return {
        error: `Repository "${owner}/${repo}" was not found or is private.`,
        rateLimitRemaining,
        rateLimitReset,
      };
    }

    if (repoRes.status === 403) {
      const resetDate = rateLimitReset ? new Date(rateLimitReset * 1000).toLocaleTimeString() : "soon";
      return {
        error: `GitHub API rate limit reached. Resets at ${resetDate}. You can configure a GITHUB_TOKEN in .env.local to increase limit.`,
        rateLimitRemaining,
        rateLimitReset,
      };
    }

    if (!repoRes.ok) {
      return {
        error: `GitHub API error: ${repoRes.status} ${repoRes.statusText}`,
        rateLimitRemaining,
        rateLimitReset,
      };
    }

    const repoJson = await repoRes.json();

    // 2. Fetch contributor count accurately using Link header pagination
    let contributorsCount = 1;
    try {
      const contribRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1&anon=true`,
        { headers, next: { revalidate: 60 } }
      );

      if (contribRes.ok) {
        const linkHeader = contribRes.headers.get("link");
        if (linkHeader) {
          // Look for rel="last" page number
          const match = linkHeader.match(/<[^>]+[?&]page=(\d+)[^>]*>;\s*rel="last"/);
          if (match && match[1]) {
            contributorsCount = parseInt(match[1], 10);
          } else {
            const data = await contribRes.json();
            contributorsCount = Array.isArray(data) ? data.length : 1;
          }
        } else {
          const data = await contribRes.json();
          contributorsCount = Array.isArray(data) ? data.length : 1;
        }
      }
    } catch {
      // Graceful fallback if contributors call fails
      contributorsCount = 1;
    }

    const metadata: RepoMetadata = {
      owner: repoJson.owner?.login || owner,
      repo: repoJson.name || repo,
      fullName: repoJson.full_name || `${owner}/${repo}`,
      description: repoJson.description || "",
      stars: repoJson.stargazers_count ?? 0,
      forks: repoJson.forks_count ?? 0,
      contributors: contributorsCount,
      language: repoJson.language || null,
      languageColor: getLanguageColor(repoJson.language),
      avatarUrl: repoJson.owner?.avatar_url || `https://github.com/${owner}.png`,
      openIssues: repoJson.open_issues_count ?? 0,
      homepage: repoJson.homepage || null,
      usedBy: null, // As specified: hide by default; do not invent fake metrics
    };

    return {
      data: metadata,
      rateLimitRemaining,
      rateLimitReset,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error fetching GitHub repository";
    return {
      error: message,
    };
  }
}
