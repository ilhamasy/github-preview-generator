"use client";

import React, { useState } from "react";
import {
  Type,
  Palette,
  Sliders,
  RotateCcw,
  Sparkles,
  User,
  Hash,
  Star,
  GitFork,
  Users,
  Package,
  Layers,
} from "lucide-react";
import { CardConfig, RepoMetadata } from "@/types/preview";

interface EditorFormProps {
  config: CardConfig;
  onChange: (updated: CardConfig) => void;
  originalMetadata?: RepoMetadata | null;
  onReset: () => void;
}

const COLOR_PRESETS = [
  { name: "Burgundy (Default)", hex: "#650F25" },
  { name: "Deep Ruby", hex: "#4C0519" },
  { name: "Midnight Slate", hex: "#0F172A" },
  { name: "Emerald Pine", hex: "#064E3B" },
  { name: "Royal Indigo", hex: "#1E1B4B" },
  { name: "Dark Purple", hex: "#3B0764" },
  { name: "Rich Chocolate", hex: "#3E1F17" },
  { name: "Graphite", hex: "#18181B" },
];

export function EditorForm({ config, onChange, originalMetadata, onReset }: EditorFormProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style" | "metrics">("content");

  const updateField = <K extends keyof CardConfig>(field: K, value: CardConfig[K]) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header with tabs and reset button */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 pt-4 pb-2 bg-slate-50/50 dark:bg-slate-900/50 gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "content"
                ? "bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Content</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "style"
                ? "bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Style & Color</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("metrics")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "metrics"
                ? "bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Metrics & Stats</span>
          </button>
        </div>

        {originalMetadata && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors py-1 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Reset fields back to repository values"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Source</span>
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Tab 1: Content Fields */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Display Headline / Title
              </label>
              <input
                type="text"
                value={config.displayTitle}
                onChange={(e) => updateField("displayTitle", e.target.value)}
                placeholder="e.g. CleanYourTV - PS5 Theme"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                The bold, oversized editorial title in the lower burgundy section.
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Project Description / Subtitle
                </label>
                <span className="text-[11px] text-slate-400">
                  {config.subtitle.length} chars
                </span>
              </div>
              <textarea
                rows={3}
                value={config.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="e.g. A sleek, minimal user interface theme inspired by PlayStation 5 console visuals."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Owner / Repo Slug
                </label>
                <input
                  type="text"
                  value={config.ownerRepoLabel}
                  onChange={(e) => updateField("ownerRepoLabel", e.target.value)}
                  placeholder="ilhamasy/cleanyourtv-ps5-theme"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Footer Branding
                </label>
                <input
                  type="text"
                  value={config.footerBranding}
                  onChange={(e) => updateField("footerBranding", e.target.value)}
                  placeholder="github.com/ilhamasy/cleanyourtv-ps5-theme"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Developer Avatar URL (Optional)
              </label>
              <input
                type="text"
                value={config.avatarUrl}
                onChange={(e) => updateField("avatarUrl", e.target.value)}
                placeholder="https://avatars.githubusercontent.com/u/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Developer Avatar Size
                </label>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  {config.avatarSize || 116}px
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="range"
                  min="80"
                  max="140"
                  step="4"
                  value={config.avatarSize || 116}
                  onChange={(e) => updateField("avatarSize", parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  {[
                    { label: "Medium (88px)", size: 88 },
                    { label: "Large (116px)", size: 116 },
                    { label: "Extra Large (136px)", size: 136 },
                  ].map((preset) => (
                    <button
                      key={preset.size}
                      type="button"
                      onClick={() => updateField("avatarSize", preset.size)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                        (config.avatarSize || 116) === preset.size
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Style & Color */}
        {activeTab === "style" && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Bottom Panel Accent Color
              </label>

              {/* Color picker + hex input */}
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="color"
                  value={config.accentColor.startsWith("#") ? config.accentColor : "#650F25"}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="w-11 h-11 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800"
                />
                <input
                  type="text"
                  value={config.accentColor}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  placeholder="#650F25"
                  className="w-32 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono uppercase text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
                <span className="text-xs text-slate-400">
                  (Default: #650F25 Burgundy)
                </span>
              </div>

              {/* Curated color palette presets */}
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                Editorial Curated Palettes:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => updateField("accentColor", preset.hex)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      config.accentColor.toLowerCase() === preset.hex.toLowerCase()
                        ? "border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-lg shrink-0 shadow-inner"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Social & WhatsApp Safe Zone Margin */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Social &amp; WhatsApp Safe Margin
                </label>
                <span className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400">
                  {config.safeZoneMargin || 96}px
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                GitHub recommends at least 40pt (80px) to prevent WhatsApp, Discord &amp; Twitter bubble cards from cropping the profile photo and corner details.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "WhatsApp Safe", px: 96, desc: "Recommended (96px)" },
                  { label: "GitHub 40pt", px: 80, desc: "Standard (80px)" },
                  { label: "Wide Safe", px: 112, desc: "Ultra Safe (112px)" },
                ].map((item) => (
                  <button
                    key={item.px}
                    type="button"
                    onClick={() => updateField("safeZoneMargin", item.px)}
                    className={`flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      (config.safeZoneMargin || 96) === item.px
                        ? "border-rose-600 ring-2 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Metrics & Stats */}
        {activeTab === "metrics" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Toggle and customize repository metrics displayed in the upper white section.
            </p>

            {/* Contributors */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Contributors
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  value={config.contributors}
                  onChange={(e) => updateField("contributors", Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={!config.showContributors}
                  className="w-24 px-2.5 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-right disabled:opacity-40"
                />
                <input
                  type="checkbox"
                  checked={config.showContributors}
                  onChange={(e) => updateField("showContributors", e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded cursor-pointer accent-rose-600"
                />
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Stars
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  value={config.stars}
                  onChange={(e) => updateField("stars", Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={!config.showStars}
                  className="w-24 px-2.5 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-right disabled:opacity-40"
                />
                <input
                  type="checkbox"
                  checked={config.showStars}
                  onChange={(e) => updateField("showStars", e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded cursor-pointer accent-rose-600"
                />
              </div>
            </div>

            {/* Forks */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <GitFork className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Forks
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  value={config.forks}
                  onChange={(e) => updateField("forks", Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={!config.showForks}
                  className="w-24 px-2.5 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-right disabled:opacity-40"
                />
                <input
                  type="checkbox"
                  checked={config.showForks}
                  onChange={(e) => updateField("showForks", e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded cursor-pointer accent-rose-600"
                />
              </div>
            </div>

            {/* Primary Language */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.languageColor || "#58A6FF" }}
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Primary Language
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={config.language || ""}
                  onChange={(e) => updateField("language", e.target.value || null)}
                  disabled={!config.showLanguage}
                  placeholder="e.g. CSS, TypeScript"
                  className="w-28 px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-40"
                />
                <input
                  type="checkbox"
                  checked={config.showLanguage}
                  onChange={(e) => updateField("showLanguage", e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded cursor-pointer accent-rose-600"
                />
              </div>
            </div>

            {/* Optional "Used by" metric */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                      Used by Metric (Optional)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Hidden by default unless explicitly specified.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.showUsedBy}
                  onChange={(e) => updateField("showUsedBy", e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded cursor-pointer accent-rose-600"
                />
              </div>

              {config.showUsedBy && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Display value:
                  </span>
                  <input
                    type="text"
                    value={config.usedBy || ""}
                    onChange={(e) => updateField("usedBy", e.target.value)}
                    placeholder="e.g. 1.2k or 500"
                    className="w-28 px-2.5 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-right"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
