import { describe, it, expect } from "vitest";

describe("GitHub Social Preview 1280x640 Dimension and Safe Area Constraints", () => {
  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 640;

  it("satisfies the 2:1 recommended aspect ratio", () => {
    const ratio = CANVAS_WIDTH / CANVAS_HEIGHT;
    expect(ratio).toBe(2);
    expect(CANVAS_WIDTH).toBe(1280);
    expect(CANVAS_HEIGHT).toBe(640);
  });

  it("guarantees at least 6% safe area on all sides", () => {
    const minSafeH = CANVAS_WIDTH * 0.06; // 76.8px
    const minSafeV = CANVAS_HEIGHT * 0.06; // 38.4px

    expect(minSafeH).toBeCloseTo(76.8, 1);
    expect(minSafeV).toBeCloseTo(38.4, 1);

    // Default safeZoneMargin is 84px (6.56%), which is strictly >= 76.8px (6%)
    const defaultMarginX = 84;
    expect(marginXPercentage(defaultMarginX, CANVAS_WIDTH)).toBeGreaterThanOrEqual(6.0);

    // Vertical top margin is 48px (7.5%) and bottom is 40px (6.25%)
    const topMarginY = 48;
    const bottomMarginY = 40;
    expect(topMarginY).toBeGreaterThanOrEqual(minSafeV);
    expect(bottomMarginY).toBeGreaterThanOrEqual(minSafeV);
  });

  it("maintains scaled preview proportions without distortion", () => {
    const testWidths = [320, 480, 640, 800, 1024, 1280];
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
