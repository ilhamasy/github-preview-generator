import { NextRequest, NextResponse } from "next/server";
import { renderCardPng } from "@/lib/renderPng";
import { CardConfig } from "@/types/preview";
import { fetchGitHubRepoData } from "@/lib/github";
import { parseGitHubRepo } from "@/lib/parseRepo";


export async function POST(request: NextRequest) {
  try {
    const config: CardConfig = await request.json();

    if (!config || !config.ownerRepoLabel) {
      return NextResponse.json(
        { error: "Invalid card configuration" },
        { status: 400 }
      );
    }

    const pngBuffer = await renderCardPng(config);

    const safeFilename = config.ownerRepoLabel.replace(/[^a-zA-Z0-9_-]/g, "-");

    return new NextResponse(pngBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${safeFilename}-preview.png"`,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error: unknown) {
    console.error("Error generating image:", error);
    const message = error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const repoInput = searchParams.get("repo");

    if (!repoInput) {
      return NextResponse.json({ error: "Missing 'repo' parameter" }, { status: 400 });
    }

    const parsed = parseGitHubRepo(repoInput);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid repository format" }, { status: 400 });
    }

    const repoDataResult = await fetchGitHubRepoData(parsed.owner, parsed.repo);
    if (!repoDataResult.data) {
      return NextResponse.json({ error: repoDataResult.error || "Repository not found" }, { status: 404 });
    }

    const data = repoDataResult.data;
    const config: CardConfig = {
      displayTitle: searchParams.get("title") || data.repo,
      subtitle: searchParams.get("subtitle") || data.description || "",
      ownerRepoLabel: `${data.owner}/${data.repo}`,
      footerBranding: `github.com/${data.owner}/${data.repo}`,
      avatarUrl: data.avatarUrl,
      accentColor: searchParams.get("color") || "#650F25",
      contributors: data.contributors,
      stars: data.stars,
      forks: data.forks,
      language: data.language,
      languageColor: data.languageColor,
      showContributors: true,
      showStars: true,
      showForks: true,
      showLanguage: true,
      showUsedBy: false,
    };

    const pngBuffer = await renderCardPng(config);
    const safeFilename = `${data.owner}-${data.repo}`;

    return new NextResponse(pngBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${safeFilename}-preview.png"`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/generate-image:", error);
    const message = error instanceof Error ? error.message : "Failed to generate preview";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
