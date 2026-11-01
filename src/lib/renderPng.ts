import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { CardConfig } from "@/types/preview";
import { getCardElement } from "./cardTemplate";

let fontRegularBuffer: Buffer | null = null;
let fontSemiBoldBuffer: Buffer | null = null;
let fontBoldBuffer: Buffer | null = null;

function loadFonts() {
  const fontsDir = path.join(process.cwd(), "public", "fonts");

  if (!fontRegularBuffer) {
    fontRegularBuffer = fs.readFileSync(path.join(fontsDir, "Inter-Regular.ttf"));
  }
  if (!fontSemiBoldBuffer) {
    fontSemiBoldBuffer = fs.readFileSync(path.join(fontsDir, "Inter-SemiBold.ttf"));
  }
  if (!fontBoldBuffer) {
    fontBoldBuffer = fs.readFileSync(path.join(fontsDir, "Inter-Bold.ttf"));
  }

  return [
    {
      name: "Inter",
      data: fontRegularBuffer,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: fontSemiBoldBuffer,
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: fontBoldBuffer,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: fontBoldBuffer,
      weight: 800 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * Fetches an external image URL and converts it to a base64 Data URL.
 */
async function getBase64Image(url: string): Promise<string> {
  if (!url || url.startsWith("data:")) {
    return url;
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "GitHub-Preview-Generator-App",
      },
    });

    if (!res.ok) return url;

    const contentType = res.headers.get("content-type") || "image/png";
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.warn("Could not fetch avatar for base64 conversion:", error);
    return url;
  }
}

export async function renderCardPng(config: CardConfig): Promise<Buffer> {
  const fonts = loadFonts();

  // Convert avatar to base64 for reliable Satori rendering
  let avatarUrl = config.avatarUrl;
  if (avatarUrl && avatarUrl.startsWith("http")) {
    avatarUrl = await getBase64Image(avatarUrl);
  }

  const finalConfig: CardConfig = {
    ...config,
    avatarUrl,
  };

  const element = getCardElement(finalConfig);

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts,
  });

  const targetWidth =
    config.exportPreset === "600x315" || config.exportPreset === "640x320"
      ? 600
      : config.exportPreset === "1280x640"
      ? 1280
      : 1200;

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: targetWidth,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}
