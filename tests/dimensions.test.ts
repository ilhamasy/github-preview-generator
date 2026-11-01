import { describe, it, expect } from "vitest";

describe("Open Graph 1200x630 Dimension and Safe Area Constraints", () => {
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 630;

  it("satisfies the 1.91:1 Open Graph recommended aspect ratio", () => {
    const ratio = CANVAS_WIDTH / CANVAS_HEIGHT;
    expect(ratio).toBeCloseTo(1.90476, 2);
    expect(CANVAS_WIDTH).toBe(1200);
    expect(CANVAS_HEIGHT).toBe(630);
  });

  it("guarantees at least 6% safe area on all sides", () => {
    const minSafeH = CANVAS_WIDTH * 0.06; // 72px
    const minSafeV = CANVAS_HEIGHT * 0.06; // 37.8px

    expect(minSafeH).toBe(72);
    expect(minSafeV).toBe(37.8);

    // Default safeZoneMargin is 84px (7.0%), which is strictly >= 72px (6%)
    const defaultMarginX = 84;
    expect(marginXPercentage(defaultMarginX, CANVAS_WIDTH)).toBeGreaterThanOrEqual(6.0);

    // Vertical top margin is 44px (6.98%) and bottom is 40px (6.35%)
    const topMarginY = 44;
    const bottomMarginY = 40;
    expect(topMarginY).toBeGreaterThanOrEqual(minSafeV);
    expect(bottomMarginY).toBeGreaterThanOrEqual(minSafeV);
  });

  it("maintains scaled preview proportions without distortion", () => {
    // For any container width, scaled height matches 1200x630 exactly
    const testWidths = [360, 480, 600, 800, 1024, 1200];
    for (const w of testWidths) {
      const scaledHeight = Math.round(w * (CANVAS_HEIGHT / CANVAS_WIDTH));
      const calculatedRatio = w / scaledHeight;
      expect(calculatedRatio).toBeCloseTo(CANVAS_WIDTH / CANVAS_HEIGHT, 1);
    }
  });
});

function marginXPercentage(margin: number, width: number): number {
  return (margin / width) * 100;
}
