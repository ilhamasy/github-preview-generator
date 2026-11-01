/**
 * Formats a number into compact representation (e.g., 1.2k, 15k, 1.4M).
 */
export function formatCompactNumber(num: number): string {
  if (typeof num !== "number" || isNaN(num) || num < 0) {
    return "0";
  }

  if (num < 1000) {
    return num.toString();
  }

  if (num < 10000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.endsWith(".0") ? `${Math.floor(num / 1000)}k` : `${formatted}k`;
  }

  if (num < 1000000) {
    return `${Math.round(num / 1000)}k`;
  }

  const millions = (num / 1000000).toFixed(1);
  return millions.endsWith(".0") ? `${Math.floor(num / 1000000)}M` : `${millions}M`;
}

/**
 * Truncates text cleanly at word boundaries if possible.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text || "";
  }

  const sub = text.slice(0, maxLength);
  const lastSpace = sub.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.7) {
    return `${sub.slice(0, lastSpace)}...`;
  }

  return `${sub}...`;
}
