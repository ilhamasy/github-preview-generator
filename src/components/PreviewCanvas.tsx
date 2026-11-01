"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, Info, Loader2, User } from "lucide-react";
import { CardConfig } from "@/types/preview";
import { formatCompactNumber } from "@/lib/formatters";
import { GitHubIcon, StarIcon, ForkIcon, UsersIcon, PackageIcon } from "@/lib/svgIcons";

interface PreviewCanvasProps {
  config: CardConfig;
  onRefreshMetadata?: () => void;
  isFetching?: boolean;
  onChangeConfig?: (updated: CardConfig) => void;
}

export function PreviewCanvas({ config, onRefreshMetadata, isFetching, onChangeConfig }: PreviewCanvasProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Responsive scaling container for 1280 × 640 px (2:1) without empty gap
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(640);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    ro.observe(containerRef.current);
    window.addEventListener("resize", updateWidth);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // Standard 1280 × 640 scaling
  const scale = containerWidth > 0 ? containerWidth / 1280 : 0.5;
  const exactHeight = Math.round(containerWidth * (640 / 1280));

  // Safe area of at least 6% on all sides (6% of 1280 = 76.8px; default to 84px = 6.56%)
  const marginX = config.safeZoneMargin || 84;
  const avatarPx = config.avatarSize || 120;
  const avatarBorderRadius =
    config.avatarShape === "circle" ? "50%" : `${Math.round(avatarPx * 0.22)}px`;

  const {
    displayTitle,
    subtitle,
    ownerRepoLabel,
    footerBranding,
    avatarUrl,
    accentColor,
    contributors,
    stars,
    forks,
    language,
    languageColor,
    showContributors,
    showStars,
    showForks,
    showLanguage,
    usedBy,
    showUsedBy,
  } = config;

  // Split owner and repo for differentiated typography
  const parts = ownerRepoLabel.split("/");
  const owner = parts[0] || "";
  const repo = parts.slice(1).join("/") || "";

  const handleDownloadPng = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, exportPreset: "1280x640" }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PNG image");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeFilename = ownerRepoLabel.replace(/[^a-zA-Z0-9_-]/g, "-") || "github-preview";
      link.href = url;
      link.download = `${safeFilename}-1280x640.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top action bar: Live preview badge & Single Download button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Live Preview (1280 × 640)
          </span>
        </div>

        {/* Single Download button for 1280 x 640 */}
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-black text-white shadow-md shadow-rose-900/25 disabled:opacity-50 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PNG (1280 × 640)</span>
            </>
          )}
        </button>
      </div>

      {/* Prominent Quick-Control Bar for Avatar & Photo Size */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-rose-600" />
            Photo Size:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
            {[
              { label: "Medium", px: 92 },
              { label: "Large", px: 120 },
              { label: "XL (Big)", px: 140 },
              { label: "XXL (Giant)", px: 160 },
            ].map((preset) => (
              <button
                key={preset.px}
                type="button"
                onClick={() => onChangeConfig?.({ ...config, avatarSize: preset.px })}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                  avatarPx === preset.px
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {preset.label} ({preset.px}px)
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Shape:</span>
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
            <button
              type="button"
              onClick={() => onChangeConfig?.({ ...config, avatarShape: "squircle" })}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                config.avatarShape !== "circle"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Squircle
            </button>
            <button
              type="button"
              onClick={() => onChangeConfig?.({ ...config, avatarShape: "circle" })}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                config.avatarShape === "circle"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Circle
            </button>
          </div>
        </div>
      </div>

      {/* Main Card Canvas Wrapper - Scaled strictly to 1280 × 640 without ANY gap */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 bg-white"
        style={{
          height: `${exactHeight}px`,
        }}
      >
        <div
          style={{
            width: "1280px",
            height: "640px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          className="flex flex-col select-none"
        >
          {/* Upper White Header Section (~48% height = ~308px) */}
          <div
            className="flex flex-col justify-between w-full bg-white"
            style={{
              height: "308px",
              padding: `48px ${marginX}px 28px ${marginX}px`,
            }}
          >
            {/* Top Row: Owner / Repo slug + Avatar */}
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-wrap items-baseline gap-2.5 max-w-[1020px]">
                {owner && (
                  <span className="text-[34px] font-medium text-slate-500 tracking-[-0.5px]">
                    {owner}
                  </span>
                )}
                {owner && repo && (
                  <span className="text-[32px] font-normal text-slate-300 mx-0.5">
                    /
                  </span>
                )}
                <span className="text-[36px] font-extrabold text-slate-900 tracking-[-0.8px]">
                  {repo || ownerRepoLabel}
                </span>
              </div>

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Developer Avatar"
                  style={{
                    width: `${avatarPx}px`,
                    height: `${avatarPx}px`,
                    borderRadius: avatarBorderRadius,
                  }}
                  className="border-2 border-slate-200 object-cover shadow-xl shrink-0"
                  crossOrigin="anonymous"
                />
              ) : (
                <div
                  style={{
                    width: `${avatarPx}px`,
                    height: `${avatarPx}px`,
                    borderRadius: avatarBorderRadius,
                  }}
                  className="bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-600 font-bold text-3xl shrink-0 shadow-sm"
                >
                  {owner ? owner[0]?.toUpperCase() : "G"}
                </div>
              )}
            </div>

            {/* Bottom Row: Aligned Repository Metrics */}
            <div className="flex items-center gap-9">
              {showContributors && (
                <div className="flex items-center gap-2.5">
                  <UsersIcon size={22} color="#64748B" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold text-slate-900">
                      {formatCompactNumber(contributors)}
                    </span>
                    <span className="text-[16px] font-medium text-slate-500">
                      Contributors
                    </span>
                  </div>
                </div>
              )}

              {showUsedBy && usedBy && (
                <div className="flex items-center gap-2.5">
                  <PackageIcon size={22} color="#64748B" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold text-slate-900">
                      {usedBy}
                    </span>
                    <span className="text-[16px] font-medium text-slate-500">
                      Used by
                    </span>
                  </div>
                </div>
              )}

              {showStars && (
                <div className="flex items-center gap-2.5">
                  <StarIcon size={22} color="#64748B" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold text-slate-900">
                      {formatCompactNumber(stars)}
                    </span>
                    <span className="text-[16px] font-medium text-slate-500">
                      Stars
                    </span>
                  </div>
                </div>
              )}

              {showForks && (
                <div className="flex items-center gap-2.5">
                  <ForkIcon size={22} color="#64748B" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-bold text-slate-900">
                      {formatCompactNumber(forks)}
                    </span>
                    <span className="text-[16px] font-medium text-slate-500">
                      Forks
                    </span>
                  </div>
                </div>
              )}

              {showLanguage && language && (
                <div className="flex items-center gap-2 ml-auto bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: languageColor || "#58A6FF" }}
                  />
                  <span className="text-[16px] font-semibold text-slate-700">
                    {language}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thin Multicolor Divider (6px) */}
          <div
            className="w-full h-[6px]"
            style={{
              background:
                "linear-gradient(90deg, #38BDF8 0%, #818CF8 20%, #C084FC 40%, #F472B6 60%, #FB7185 80%, #FBBF24 100%)",
            }}
          />

          {/* Burgundy Content Panel (~52% height = ~326px) */}
          <div
            className="flex flex-col justify-between w-full transition-colors duration-200"
            style={{
              height: "326px",
              backgroundColor: accentColor || "#650F25",
              padding: `38px ${marginX}px 40px ${marginX}px`,
            }}
          >
            {/* Title & Description */}
            <div className="flex flex-col gap-3 max-w-[1100px]">
              <h1 className="text-[48px] font-extrabold text-white tracking-[-1px] leading-[1.15] line-clamp-2">
                {displayTitle || repo || "Repository Title"}
              </h1>
              <p className="text-[21px] font-normal text-rose-100/95 leading-[1.5] line-clamp-2">
                {subtitle || "No description provided for this repository."}
              </p>
            </div>

            {/* Footer Branding Bar */}
            <div className="flex justify-between items-center w-full border-t border-white/15 pt-3.5">
              <div className="flex items-center gap-3">
                <GitHubIcon size={24} color="#FFFFFF" />
                <span className="text-[18px] font-semibold text-white tracking-[-0.2px]">
                  {footerBranding || `github.com/${ownerRepoLabel}`}
                </span>
              </div>

              <span className="text-[14px] font-medium text-white/60 tracking-wider uppercase">
                GitHub Social Preview
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Information & Guidance */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>GitHub Recommended 1280 × 640 px:</strong> High-resolution 2:1 social card format with safe margins ensures all repository metrics, description, and developer photo display clearly without clipping.
        </p>
      </div>
    </div>
  );
}
