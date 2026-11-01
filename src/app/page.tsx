"use client";

import React, { useState, useEffect } from "react";
import { RepoSearchBar } from "@/components/RepoSearchBar";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { EditorForm } from "@/components/EditorForm";
import { CardConfig, RepoMetadata } from "@/types/preview";
import { Sparkles, Layers, ShieldCheck, Heart } from "lucide-react";
import { GitHubIcon } from "@/lib/svgIcons";

// Default initial config based on the user's example: ilhamasy/cleanyourtv-ps5-theme
const DEFAULT_CONFIG: CardConfig = {
  displayTitle: "CleanYourTV - PS5 Theme",
  subtitle: "A minimal and sleek user interface theme inspired by PlayStation 5 visuals.",
  ownerRepoLabel: "ilhamasy/cleanyourtv-ps5-theme",
  footerBranding: "github.com/ilhamasy/cleanyourtv-ps5-theme",
  avatarUrl: "https://github.com/ilhamasy.png",
  accentColor: "#650F25", // Editorial deep burgundy
  contributors: 1,
  stars: 12,
  forks: 2,
  language: "CSS",
  languageColor: "#563d7c",
  showContributors: true,
  showStars: true,
  showForks: true,
  showLanguage: true,
  usedBy: undefined,
  showUsedBy: false,
};

export default function Home() {
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const [metadata, setMetadata] = useState<RepoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<number | undefined>(undefined);

  const fetchRepo = async (input: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/github?repo=${encodeURIComponent(input)}`);
      const json = await res.json();

      if (json.rateLimitRemaining !== undefined) {
        setRateLimitRemaining(json.rateLimitRemaining);
      }

      if (!res.ok || !json.success) {
        setError(json.error || "Failed to fetch repository metadata.");
        return;
      }

      const data: RepoMetadata = json.data;
      setMetadata(data);

      // Auto-populate card configuration from fetched metadata
      setConfig({
        displayTitle: data.repo || data.fullName,
        subtitle: data.description || "Open-source project on GitHub.",
        ownerRepoLabel: `${data.owner}/${data.repo}`,
        footerBranding: `github.com/${data.owner}/${data.repo}`,
        avatarUrl: data.avatarUrl,
        accentColor: config.accentColor || "#650F25",
        contributors: data.contributors,
        stars: data.stars,
        forks: data.forks,
        language: data.language,
        languageColor: data.languageColor,
        showContributors: true,
        showStars: true,
        showForks: true,
        showLanguage: Boolean(data.language),
        usedBy: undefined,
        showUsedBy: false,
      });
    } catch (err: unknown) {
      console.error("Fetch error:", err);
      setError("An unexpected network error occurred while contacting the GitHub API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial live data on first load for ilhamasy/cleanyourtv-ps5-theme
  useEffect(() => {
    fetchRepo("ilhamasy/cleanyourtv-ps5-theme");
  }, []);

  const handleResetToSource = () => {
    if (!metadata) return;
    setConfig((prev) => ({
      ...prev,
      displayTitle: metadata.repo,
      subtitle: metadata.description || "",
      ownerRepoLabel: `${metadata.owner}/${metadata.repo}`,
      footerBranding: `github.com/${metadata.owner}/${metadata.repo}`,
      avatarUrl: metadata.avatarUrl,
      contributors: metadata.contributors,
      stars: metadata.stars,
      forks: metadata.forks,
      language: metadata.language,
      languageColor: metadata.languageColor,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 via-rose-900 to-black flex items-center justify-center text-white shadow-md shadow-rose-900/30">
              <GitHubIcon size={22} color="#FFFFFF" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent block leading-tight">
                GitHub Preview Generator
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Editorial 1280×640 Social Card Generator
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ilhamasy/github-preview-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <GitHubIcon size={16} color="currentColor" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Intro */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-800 dark:text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Editorial-style social cards for GitHub repositories</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Generate Custom Repository Social Previews
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Create high-resolution 1280 × 640 cards with real GitHub metrics, differentiated typography, custom editorial palettes, and server-side PNG rendering via Satori &amp; Resvg.
          </p>
        </div>

        {/* Repository Input Section */}
        <RepoSearchBar
          onFetchRepo={fetchRepo}
          isLoading={isLoading}
          error={error}
          rateLimitRemaining={rateLimitRemaining}
          currentRepoSlug={config.ownerRepoLabel}
        />

        {/* Main 2-Column Studio: Editor & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Custom Content & Controls (5 Cols) */}
          <div className="lg:col-span-5 w-full">
            <EditorForm
              config={config}
              onChange={setConfig}
              originalMetadata={metadata}
              onReset={handleResetToSource}
            />
          </div>

          {/* Right Column: Live 1280x640 Preview Canvas & Actions (7 Cols) */}
          <div className="lg:col-span-7 w-full sticky top-24">
            <PreviewCanvas
              config={config}
              onRefreshMetadata={() => fetchRepo(config.ownerRepoLabel)}
              isFetching={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Built with Next.js App Router, Tailwind CSS, Satori, and @resvg/resvg-js</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ilhamasy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose-600 transition-colors"
            >
              Created by @ilhamasy
            </a>
            <span>•</span>
            <span>1280 × 640 Social Canvas</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
