import { afterEach, expect, test } from "vite-plus/test";
import {
  clamp01,
  contrastRatio,
  createThemeScroller,
  lerp,
  lerpRgb,
  parseTriplet,
  relativeLuminance,
  smoothstep,
  themeEase,
  type Rgb,
} from "./theme-scroll";

const LIGHT_BG: Rgb = [250, 248, 245];
const LIGHT_FG: Rgb = [28, 26, 23];
const DARK_BG: Rgb = [26, 24, 21];
const DARK_FG: Rgb = [236, 230, 219];

afterEach(() => {
  document.documentElement.removeAttribute("style");
});

test("clamp01 clamps below, within, and above range", () => {
  expect(clamp01(-0.5)).toBe(0);
  expect(clamp01(0.42)).toBe(0.42);
  expect(clamp01(1.7)).toBe(1);
});

test("lerp and lerpRgb interpolate endpoints and midpoints", () => {
  expect(lerp(0, 10, 0.5)).toBe(5);
  expect(lerpRgb([0, 0, 0], [10, 20, 30], 0)).toEqual([0, 0, 0]);
  expect(lerpRgb([0, 0, 0], [10, 20, 30], 1)).toEqual([10, 20, 30]);
  expect(lerpRgb([0, 0, 0], [10, 20, 30], 0.5)).toEqual([5, 10, 15]);
});

test("parseTriplet accepts valid triplets and rejects malformed input", () => {
  expect(parseTriplet(" 250 248 245 ")).toEqual([250, 248, 245]);
  expect(() => parseTriplet("250 248")).toThrow();
  expect(() => parseTriplet("250 x 245")).toThrow();
});

test("createThemeScroller writes light at 0 and dark at 1", () => {
  const root = document.documentElement;
  root.style.setProperty("--light-bg", "250 248 245");
  root.style.setProperty("--dark-bg", "26 24 21");
  // The other tokens must exist or the scroller throws on read.
  for (const name of ["fg", "surface", "surface-2", "border", "muted", "accent", "accent-fg"]) {
    root.style.setProperty(`--light-${name}`, "10 10 10");
    root.style.setProperty(`--dark-${name}`, "200 200 200");
  }

  const apply = createThemeScroller(root);
  apply(0);
  expect(root.style.getPropertyValue("--color-bg")).toBe("250 248 245");
  apply(1);
  expect(root.style.getPropertyValue("--color-bg")).toBe("26 24 21");
  apply(0.5);
  expect(root.style.getPropertyValue("--color-bg")).toBe("138 136 133");
});

test("smoothstep eases endpoints and is symmetric at the middle", () => {
  expect(smoothstep(0)).toBe(0);
  expect(smoothstep(1)).toBe(1);
  expect(smoothstep(0.5)).toBeCloseTo(0.5, 5);
  expect(smoothstep(-1)).toBe(0);
  expect(smoothstep(2)).toBe(1);
});

test("themeEase holds light through the hold window, then ramps to dark", () => {
  expect(themeEase(0)).toBe(0);
  expect(themeEase(0.4)).toBe(0); // still within the hold -> light
  expect(themeEase(1)).toBe(1);
  expect(themeEase(0.85)).toBeGreaterThan(0);
  expect(themeEase(0.85)).toBeLessThan(1);
});

test("both phase endpoints clear AA contrast for body text", () => {
  // relativeLuminance sanity: white brighter than black.
  expect(relativeLuminance([255, 255, 255])).toBeGreaterThan(relativeLuminance([0, 0, 0]));
  expect(contrastRatio(LIGHT_FG, LIGHT_BG)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(DARK_FG, DARK_BG)).toBeGreaterThanOrEqual(4.5);
});
