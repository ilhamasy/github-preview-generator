import React from "react";
import { CardConfig } from "@/types/preview";
import { formatCompactNumber } from "./formatters";
import { GitHubIcon, StarIcon, ForkIcon, UsersIcon, PackageIcon } from "./svgIcons";

export function getCardElement(config: CardConfig) {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1280px",
        height: "640px",
        backgroundColor: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Upper White Header Section (~48% height = ~308px) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "308px",
          width: "100%",
          padding: "44px 64px 34px 64px",
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Top Row: Owner / Repo slug + Developer Avatar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* Owner / Repo Typography */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "10px",
              maxWidth: "1020px",
            }}
          >
            {owner && (
              <span
                style={{
                  fontSize: "34px",
                  fontWeight: 500,
                  color: "#64748B",
                  letterSpacing: "-0.5px",
                }}
              >
                {owner}
              </span>
            )}
            {owner && repo && (
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: 400,
                  color: "#CBD5E1",
                  margin: "0 2px",
                }}
              >
                /
              </span>
            )}
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.8px",
              }}
            >
              {repo || ownerRepoLabel}
            </span>
          </div>

          {/* Developer Avatar (Larger & Prominent) */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Developer Avatar"
              width={String(config.avatarSize || 116)}
              height={String(config.avatarSize || 116)}
              style={{
                width: `${config.avatarSize || 116}px`,
                height: `${config.avatarSize || 116}px`,
                borderRadius: `${Math.round((config.avatarSize || 116) * 0.22)}px`,
                border: "2px solid #E2E8F0",
                objectFit: "cover",
                boxShadow: "0 14px 30px -6px rgba(0, 0, 0, 0.12)",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: `${config.avatarSize || 116}px`,
                height: `${config.avatarSize || 116}px`,
                borderRadius: `${Math.round((config.avatarSize || 116) * 0.22)}px`,
                backgroundColor: "#F1F5F9",
                border: "2px solid #E2E8F0",
                color: "#64748B",
                fontWeight: 700,
                fontSize: "36px",
              }}
            >
              {owner ? owner[0]?.toUpperCase() : "G"}
            </div>
          )}
        </div>

        {/* Bottom Row: Aligned Repository Metrics */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "36px",
          }}
        >
          {showContributors && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <UsersIcon size={22} color="#64748B" />
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>
                  {formatCompactNumber(contributors)}
                </span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "#64748B" }}>
                  Contributors
                </span>
              </div>
            </div>
          )}

          {showUsedBy && usedBy && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <PackageIcon size={22} color="#64748B" />
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>
                  {usedBy}
                </span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "#64748B" }}>
                  Used by
                </span>
              </div>
            </div>
          )}

          {showStars && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <StarIcon size={22} color="#64748B" />
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>
                  {formatCompactNumber(stars)}
                </span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "#64748B" }}>
                  Stars
                </span>
              </div>
            </div>
          )}

          {showForks && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <ForkIcon size={22} color="#64748B" />
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>
                  {formatCompactNumber(forks)}
                </span>
                <span style={{ fontSize: "16px", fontWeight: 500, color: "#64748B" }}>
                  Forks
                </span>
              </div>
            </div>
          )}

          {showLanguage && language && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "auto",
                backgroundColor: "#F8FAFC",
                padding: "6px 14px",
                borderRadius: "9999px",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: languageColor || "#58A6FF",
                }}
              />
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#334155" }}>
                {language}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thin Multicolor Divider (6px) */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "6px",
          background:
            "linear-gradient(90deg, #38BDF8 0%, #818CF8 20%, #C084FC 40%, #F472B6 60%, #FB7185 80%, #FBBF24 100%)",
        }}
      />

      {/* Burgundy Content Panel (~52% height = ~326px) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "326px",
          width: "100%",
          backgroundColor: accentColor || "#650F25",
          padding: "40px 64px 34px 64px",
        }}
      >
        {/* Title and Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            maxWidth: "1150px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-1px",
              lineHeight: 1.15,
            }}
          >
            {displayTitle || repo || "Repository Title"}
          </div>

          <div
            style={{
              fontSize: "21px",
              fontWeight: 400,
              color: "#F3E8EB",
              lineHeight: 1.5,
              opacity: 0.95,
            }}
          >
            {subtitle || "No description provided for this repository."}
          </div>
        </div>

        {/* Footer Branding Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.14)",
            paddingTop: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <GitHubIcon size={24} color="#FFFFFF" />
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: "-0.2px",
              }}
            >
              {footerBranding || `github.com/${ownerRepoLabel}`}
            </span>
          </div>

          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.6)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            GitHub Social Preview
          </span>
        </div>
      </div>
    </div>
  );
}
