# GitHub Preview Generator

A web application that generates custom GitHub repository social preview images (1280 × 640) inspired by editorial-style GitHub repository cards.

![GitHub Preview Generator](https://raw.githubusercontent.com/ilhamasy/github-preview-generator/main/public/preview.png)

## Overview

GitHub Preview Generator creates custom, high-resolution social preview images designed for GitHub repository cards, open-graph banners, and documentation.

### Visual Architecture (1280 × 640 Canvas)
- **Upper Section (~48% height)**:
  - Crisp white background (`#FFFFFF`).
  - Differentiated typography: owner name in muted slate (`#64748B`), slash separator, bold high-contrast repository name (`#0F172A`).
  - Developer avatar positioned in the upper-right corner.
  - Aligned repository metrics: **Contributors** (real count via GitHub pagination), **Stars**, **Forks**, and **Primary Language** indicator.
  - Optional **Used by** metric (hidden by default unless explicitly specified to avoid fabricated metrics).
- **Divider (~6px)**:
  - Multi-color horizontal stripe inspired by GitHub's language spectrum (sky, indigo, purple, pink, rose, amber).
- **Lower Content Panel (~52% height)**:
  - Deep burgundy background (default `#650F25`, fully customizable with curated editorial presets).
  - Oversized headline title and project description with controlled line wrapping.
  - GitHub Octocat branding and repository slug in the footer.

---

## Features

1. **Repository Input & Live Metadata**:
   - Accepts full GitHub URLs (`https://github.com/owner/repo`), markdown links, or simple `owner/repo` slugs.
   - Fetches real repository metadata from the public GitHub REST API:
     - Full repository name & slug
     - Owner avatar URL
     - Description & project summary
     - Star count
     - Fork count
     - Total contributors using GitHub `Link` header pagination
     - Primary programming language and color indicator
2. **Interactive Live Preview**:
   - Real-time 2:1 canvas scaled responsively to any screen width.
   - Immediate feedback as you edit titles, descriptions, slugs, or colors.
3. **Custom Content Editor**:
   - **Content**: Edit Display Headline, Project Description / Subtitle, Owner/Repo slug, Footer branding, and Avatar URL.
   - **Style & Color**: Color picker and curated palettes (Burgundy `#650F25`, Midnight Slate, Emerald Pine, Royal Indigo, etc.).
   - **Metrics & Stats**: Toggle or adjust Contributors, Stars, Forks, Language, and optional Used by.
   - **Reset**: Instantly restore fields back to GitHub source data.
4. **Server-Side PNG Export (1280 × 640)**:
   - Server-side rendering using **Satori** (HTML/JSX to SVG) and **@resvg/resvg-js** (SVG to PNG buffer).
   - Instant downloadable PNG file named `{owner}-{repo}-1280x640.png`.
   - Direct image link via `GET /api/generate-image?repo=owner/repo` for embedding in READMEs or external services.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Image Generation**: [Satori](https://github.com/vercel/satori) & [@resvg/resvg-js](https://github.com/yisibl/resvg-js)
- **Icons**: [Lucide React](https://lucide.dev/) & native SVGs
- **Testing**: [Vitest](https://vitest.dev/)

---

## Getting Started

### Prerequisites
- Node.js 18.17+ (tested on Node v20 - v26)
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ilhamasy/github-preview-generator.git
cd github-preview-generator
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure GitHub Token for higher rate limits:
Create a `.env.local` file:
```env
GITHUB_TOKEN=ghp_yourPersonalAccessTokenHere
```
> *Note: Unauthenticated requests to GitHub's public API are limited to 60 requests per hour per IP. Adding a personal access token increases the limit to 5,000 requests per hour.*

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

### 1. `GET /api/github?repo={owner/repo}`
Fetches sanitized public metadata and contributor count.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "owner": "ilhamasy",
    "repo": "cleanyourtv-ps5-theme",
    "fullName": "ilhamasy/cleanyourtv-ps5-theme",
    "description": "Debloat any Android or Google TV over Wi-Fi and get an Apple TV-style home.",
    "stars": 11,
    "forks": 2,
    "contributors": 228,
    "language": "Java",
    "languageColor": "#b07219",
    "avatarUrl": "https://avatars.githubusercontent.com/u/28057742?v=4"
  },
  "rateLimitRemaining": 59,
  "rateLimitReset": 1793512397
}
```

### 2. `POST /api/generate-image`
Generates a downloadable 1280 × 640 PNG image from a JSON configuration payload.

**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "displayTitle": "CleanYourTV - PS5 Theme",
  "subtitle": "Debloat any Android or Google TV over Wi-Fi and get an Apple TV-style home.",
  "ownerRepoLabel": "ilhamasy/cleanyourtv-ps5-theme",
  "footerBranding": "github.com/ilhamasy/cleanyourtv-ps5-theme",
  "avatarUrl": "https://avatars.githubusercontent.com/u/28057742?v=4",
  "accentColor": "#650F25",
  "contributors": 228,
  "stars": 11,
  "forks": 2,
  "language": "Java",
  "languageColor": "#b07219",
  "showContributors": true,
  "showStars": true,
  "showForks": true,
  "showLanguage": true,
  "showUsedBy": false
}
```

### 3. `GET /api/generate-image?repo={owner/repo}&color=%23650F25`
Direct URL rendering endpoint suitable for README `<img>` tags or Open Graph meta previews.

---

## Testing

Run unit tests for URL parsing and number formatting:
```bash
npm test
```

Run TypeScript verification:
```bash
npx tsc --noEmit
```

Build production bundle:
```bash
npm run build
```

---

## Snapshot Semantics & Limitations

- **Snapshot Nature**: Generated and downloaded PNG cards reflect metrics at the exact moment of creation. If your repository gains stars or contributors, click **Fetch Metadata** to capture an updated snapshot.
- **Used by Metric**: GitHub does not provide a public REST API for the "Used by" dependent package counter. To avoid fabricating data, this metric is omitted by default and can be manually enabled if desired.
- **Rate Limits**: If you encounter a `403 Rate Limit` error when fetching metadata, supply a GitHub token in `.env.local` or wait for the hourly reset period indicated in the top banner.

---

## License

MIT © [ilhamasy](https://github.com/ilhamasy)
