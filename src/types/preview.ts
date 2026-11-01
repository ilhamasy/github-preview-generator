export interface RepoMetadata {
  owner: string;
  repo: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  contributors: number;
  language: string | null;
  languageColor: string;
  avatarUrl: string;
  usedBy?: number | null;
  openIssues?: number;
  homepage?: string | null;
}

export interface CardConfig {
  displayTitle: string;
  subtitle: string;
  ownerRepoLabel: string;
  footerBranding: string;
  avatarUrl: string;
  accentColor: string;
  contributors: number;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string;
  showContributors: boolean;
  showStars: boolean;
  showForks: boolean;
  showLanguage: boolean;
  usedBy?: string;
  showUsedBy: boolean;
  avatarSize?: number;
  avatarShape?: "squircle" | "circle";
  safeZoneMargin?: number;
  exportPreset?: "1280x640" | "640x320";
}

export interface GitHubApiResponse {
  success: boolean;
  data?: RepoMetadata;
  error?: string;
  rateLimitRemaining?: number;
  rateLimitReset?: number;
}
