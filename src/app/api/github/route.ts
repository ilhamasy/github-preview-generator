import { NextRequest, NextResponse } from "next/server";
import { parseGitHubRepo } from "@/lib/parseRepo";
import { fetchGitHubRepoData } from "@/lib/github";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("repo");

  if (!input) {
    return NextResponse.json(
      { success: false, error: "Missing 'repo' query parameter" },
      { status: 400 }
    );
  }

  const parsed = parseGitHubRepo(input);
  if (!parsed) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid repository format. Please enter 'owner/repo' or a GitHub repository URL (e.g., https://github.com/ilhamasy/cleanyourtv-ps5-theme).",
      },
      { status: 400 }
    );
  }

  const result = await fetchGitHubRepoData(parsed.owner, parsed.repo);

  if (result.error || !result.data) {
    return NextResponse.json(
      {
        success: false,
        error: result.error || "Failed to fetch repository data",
        rateLimitRemaining: result.rateLimitRemaining,
        rateLimitReset: result.rateLimitReset,
      },
      { status: result.error?.includes("not found") ? 404 : 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: result.data,
    rateLimitRemaining: result.rateLimitRemaining,
    rateLimitReset: result.rateLimitReset,
  });
}
