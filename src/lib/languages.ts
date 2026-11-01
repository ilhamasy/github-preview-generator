/**
 * GitHub language colors mapping.
 */
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Lua: "#000080",
  R: "#198CE7",
  Elixir: "#6e4a7e",
  Scala: "#c22d40",
  Zig: "#ec915c",
};

export function getLanguageColor(language: string | null | undefined): string {
  if (!language) return "#8B949E";
  return LANGUAGE_COLORS[language] || "#58A6FF";
}
