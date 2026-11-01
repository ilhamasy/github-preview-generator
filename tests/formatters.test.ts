import { describe, it, expect } from "vitest";
import { formatCompactNumber, truncateText } from "../src/lib/formatters";

describe("formatCompactNumber", () => {
  it("formats numbers below 1000 verbatim", () => {
    expect(formatCompactNumber(0)).toBe("0");
    expect(formatCompactNumber(42)).toBe("42");
    expect(formatCompactNumber(999)).toBe("999");
  });

  it("formats thousands with k", () => {
    expect(formatCompactNumber(1000)).toBe("1k");
    expect(formatCompactNumber(1200)).toBe("1.2k");
    expect(formatCompactNumber(1250)).toBe("1.3k");
    expect(formatCompactNumber(15400)).toBe("15k");
    expect(formatCompactNumber(120400)).toBe("120k");
  });

  it("formats millions with M", () => {
    expect(formatCompactNumber(1000000)).toBe("1M");
    expect(formatCompactNumber(2500000)).toBe("2.5M");
  });

  it("handles negative or invalid values gracefully", () => {
    expect(formatCompactNumber(-5)).toBe("0");
    expect(formatCompactNumber(NaN)).toBe("0");
  });
});

describe("truncateText", () => {
  it("leaves short text unchanged", () => {
    expect(truncateText("Hello world", 20)).toBe("Hello world");
  });

  it("truncates long text cleanly", () => {
    const text = "A polished web application that generates custom GitHub repository social preview images";
    const truncated = truncateText(text, 40);
    expect(truncated.length).toBeLessThanOrEqual(43); // 40 + "..."
    expect(truncated.endsWith("...")).toBe(true);
  });
});
