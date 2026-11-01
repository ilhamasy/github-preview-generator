"use client";

import React, { useState } from "react";
import { Search, Loader2, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { parseGitHubRepo } from "@/lib/parseRepo";

interface RepoSearchBarProps {
  onFetchRepo: (input: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  rateLimitRemaining?: number;
  currentRepoSlug?: string;
}

const PRESET_REPOS = [
  { label: "ilhamasy/cleanyourtv-ps5-theme", slug: "https://github.com/ilhamasy/cleanyourtv-ps5-theme" },
  { label: "vercel/next.js", slug: "vercel/next.js" },
  { label: "tailwindlabs/tailwindcss", slug: "tailwindlabs/tailwindcss" },
  { label: "facebook/react", slug: "facebook/react" },
];

export function RepoSearchBar({
  onFetchRepo,
  isLoading,
  error,
  rateLimitRemaining,
  currentRepoSlug,
}: RepoSearchBarProps) {
  const [inputValue, setInputValue] = useState(
    currentRepoSlug || "https://github.com/ilhamasy/cleanyourtv-ps5-theme"
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsed = parseGitHubRepo(inputValue);
    if (!parsed) {
      setValidationError("Please enter a valid GitHub repository URL or 'owner/repo' slug.");
      return;
    }

    onFetchRepo(inputValue);
  };

  const handleSelectPreset = (slug: string) => {
    setInputValue(slug);
    setValidationError(null);
    onFetchRepo(slug);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            GitHub Repository Source
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enter any public GitHub URL or <code className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">owner/repo</code> slug to fetch live metadata.
          </p>
        </div>

        {rateLimitRemaining !== undefined && (
          <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start md:self-auto">
            <span
              className={`w-2 h-2 rounded-full ${
                rateLimitRemaining > 10 ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`}
            />
            <span>API Remaining: {rateLimitRemaining}/60</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g. https://github.com/ilhamasy/cleanyourtv-ps5-theme or owner/repo"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all font-mono"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-black text-white font-semibold text-sm shadow-md shadow-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Fetch Metadata</span>
            </>
          )}
        </button>
      </form>

      {/* Validation or API Error Alert */}
      {(validationError || error) && (
        <div className="mt-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          <span>{validationError || error}</span>
        </div>
      )}

      {/* Quick preset chips */}
      <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Try presets:
        </span>
        {PRESET_REPOS.map((preset) => (
          <button
            key={preset.slug}
            type="button"
            onClick={() => handleSelectPreset(preset.slug)}
            disabled={isLoading}
            className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50 dark:hover:text-rose-300 text-slate-600 dark:text-slate-300 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
