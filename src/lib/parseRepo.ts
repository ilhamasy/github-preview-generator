/**
 * Parses a GitHub repository URL or slug into owner and repository name.
 * 
 * Supports:
 * - "owner/repo"
 * - "github.com/owner/repo"
 * - "https://github.com/owner/repo"
 * - "https://github.com/owner/repo.git"
 * - "https://github.com/owner/repo/tree/main" (extracts owner & repo)
 * - Trailing slashes, whitespace, and query parameters
 */
export function parseGitHubRepo(input: string): { owner: string; repo: string } | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  const cleaned = input.trim();
  if (!cleaned) {
    return null;
  }

  // Remove potential markdown link syntax e.g. [text](url)
  const mdMatch = cleaned.match(/\((https?:\/\/[^\)]+)\)/);
  const target = mdMatch ? mdMatch[1] : cleaned;

  // Normalize protocol
  let path = target;
  try {
    if (target.startsWith("http://") || target.startsWith("https://")) {
      const url = new URL(target);
      if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
        return null;
      }
      path = url.pathname;
    } else if (target.startsWith("github.com/")) {
      path = target.replace(/^github\.com\//, "");
    }
  } catch {
    return null;
  }

  // Remove leading and trailing slashes, and .git suffix
  path = path.replace(/^\/+/, "").replace(/\/+$/, "").replace(/\.git$/, "");

  const isUrl = target.startsWith("http://") || target.startsWith("https://") || target.startsWith("github.com/");

  // Split path into segments
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  // If not a URL, it must have exactly 2 segments (owner/repo)
  if (!isUrl && segments.length !== 2) {
    return null;
  }

  const owner = segments[0];
  const repo = segments[1];

  // GitHub username: 1-39 alphanumeric or single hyphens, cannot begin/end with hyphen
  // Repo name: alphanumeric, hyphens, underscores, dots (max 100 chars)
  const ownerRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  const repoRegex = /^[a-zA-Z0-9_.-]{1,100}$/;

  if (!ownerRegex.test(owner) || !repoRegex.test(repo)) {
    return null;
  }

  return { owner, repo };
}
