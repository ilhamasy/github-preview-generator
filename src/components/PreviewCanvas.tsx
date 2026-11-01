"use client";

import React, { useState } from "react";
import { Download, Copy, Check, Info, Loader2, Sparkles, ExternalLink, Crop } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const [showSafeZoneGuide, setShowSafeZoneGuide] = useState(false);

  const marginX = config.safeZoneMargin || 96;
  const avatarPx = config.avatarSize || 120;
  const avatarBorderRadius = config.avatarShape === "circle" ? "50%" : `${Math.round(avatarPx * 0.22)}px`;

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
        body: JSON.stringify(config),
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

  const handleCopyApiUrl = () => {
    const safeRepo = encodeURIComponent(ownerRepoLabel);
    const safeTitle = encodeURIComponent(displayTitle);
    const safeSubtitle = encodeURIComponent(subtitle);
    const safeColor = encodeURIComponent(accentColor);
    const fullUrl = `${window.location.origin}/api/generate-image?repo=${safeRepo}&title=${safeTitle}&subtitle=${safeSubtitle}&color=${safeColor}`;

    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Live Preview
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
            1280 × 640 px
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSafeZoneGuide(!showSafeZoneGuide)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              showSafeZoneGuide
                ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800 ring-2 ring-red-500/20 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            title="Toggle 40pt GitHub / WhatsApp crop safe zone guide"
          >
            <Crop className="w-3.5 h-3.5 text-red-500" />
            <span>40pt Safe Zone {showSafeZoneGuide ? "ON" : "OFF"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyApiUrl}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Copy direct PNG endpoint link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied URL!" : "Copy URL"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-black text-white shadow-md shadow-rose-900/20 disabled:opacity-50 transition-all cursor-pointer active:scale-95"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG (1280×640)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prominent Quick-Control Bar for Avatar & Photo Size */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
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

      {/* Main Card Canvas (Scaled proportionally via aspect-[2/1] container) */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950">
        {/* Scale container preserving 1280 x 640 aspect ratio */}
        <div className="relative w-full" style={{ paddingBottom: "50%" }}>
          <div
            className="absolute inset-0 flex flex-col select-none relative"
            style={{
              width: "1280px",
              height: "640px",
              transformOrigin: "top left",
            }}
            id="card-scaled-inner"
          >
            {/* Visual Safe Zone Guide Overlay (Matching GitHub Repo Card Template) */}
            {showSafeZoneGuide && (
              <div
                className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between"
                style={{
                  border: "80px solid rgba(239, 68, 68, 0.15)",
                  boxSizing: "border-box",
                }}
              >
                <div className="w-full h-full border-2 border-dashed border-red-500/80 flex flex-col justify-between p-4 bg-red-500/[0.02]">
                  <div className="flex justify-between items-center">
                    <span className="bg-red-600 text-white text-[12px] font-bold px-3 py-1 rounded-md shadow-md tracking-wider uppercase">
                      40pt / 80px Safe Border (GitHub Standard)
                    </span>
                    <span className="text-red-700 text-[12px] font-bold bg-white/95 px-3 py-1 rounded-md shadow-sm border border-red-200">
                      ✓ Avatar &amp; text fully protected from WhatsApp cropping
                    </span>
                  </div>
                  <div className="text-center text-red-600 text-[12px] font-semibold bg-white/80 py-1 px-4 rounded-md mx-auto shadow-sm">
                    Keep avatar &amp; metrics inside this dashed line so WhatsApp bubble cards don&apos;t clip them
                  </div>
                </div>
              </div>
            )}

            {/* Upper White Header Section (~48% height = 308px) */}
            <div
              className="flex flex-col justify-between w-full bg-white"
              style={{
                height: "308px",
                padding: `52px ${marginX}px 32px ${marginX}px`,
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

            {/* Burgundy Content Panel (~52% height = 326px) */}
            <div
              className="flex flex-col justify-between w-full transition-colors duration-200"
              style={{
                height: "326px",
                backgroundColor: accentColor || "#650F25",
                padding: `42px ${marginX}px 36px ${marginX}px`,
              }}
            >
              {/* Title & Description */}
              <div className="flex flex-col gap-3.5 max-w-[1150px]">
                <h1 className="text-[48px] font-extrabold text-white tracking-[-1px] leading-[1.15] line-clamp-2">
                  {displayTitle || repo || "Repository Title"}
                </h1>
                <p className="text-[21px] font-normal text-rose-100/95 leading-[1.5] line-clamp-2">
                  {subtitle || "No description provided for this repository."}
                </p>
              </div>

              {/* Footer Branding Bar */}
              <div className="flex justify-between items-center w-full border-t border-white/15 pt-4">
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
      </div>

      {/* Responsive Scaler Hook via CSS Container query / transform */}
      <style jsx global>{`
        #card-scaled-inner {
          transform: scale(calc(var(--preview-scale, 1)));
        }
      `}</style>
      <ScalerListener />

      {/* Snapshot Information & Guidance */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Snapshot Notice:</strong> Downloaded images and preview cards are static snapshots of repository metrics at the time of creation. As stars, forks, or contributors grow, you can return here and click <strong>Fetch Metadata</strong> to generate an updated preview.
        </p>
      </div>
    </div>
  );
}

function ScalerListener() {
  React.useEffect(() => {
    function updateScale() {
      const el = document.getElementById("card-scaled-inner");
      if (el && el.parentElement) {
        const parentWidth = el.parentElement.clientWidth;
        const scale = parentWidth / 1280;
        el.style.transform = `scale(${scale})`;
      }
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return null;
}
