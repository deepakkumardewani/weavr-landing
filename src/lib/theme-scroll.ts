/**
 * Light -> dark theme interpolation driven by global scroll progress.
 *
 * tokens.css defines each semantic color twice as RGB channel triplets
 * (--light-<name> / --dark-<name>). `createThemeScroller` reads those once and
 * returns an `apply(progress)` that writes the interpolated --color-<name> onto
 * :root. This is pure compositor work — no React re-render churn.
 *
 * The contrast helpers let the theme audit assert AA holds across the scroll.
 */

export const THEME_TOKENS = [
  "bg",
  "fg",
  "surface",
  "surface-2",
  "border",
  "muted",
  "accent",
  "accent-fg",
] as const;

export type Rgb = [number, number, number];

export function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smoothstep — eases in and out of a 0..1 ramp. */
export function smoothstep(t: number): number {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/**
 * Scroll progress -> theme progress. The palette holds light through the hero
 * and most of the process section, then ramps to dark so the low-contrast
 * mid-gray crossover lands in the process->output gap (off text) and the panel
 * is fully dark by the time it pins.
 */
const THEME_HOLD = 0.72;
export function themeEase(progress: number): number {
  const t = (clamp01(progress) - THEME_HOLD) / (1 - THEME_HOLD);
  return smoothstep(t);
}

export function parseTriplet(value: string): Rgb {
  const parts = value.trim().split(/\s+/).map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid RGB triplet: "${value}"`);
  }
  return [parts[0], parts[1], parts[2]];
}

export function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

/** WCAG relative luminance for an sRGB triplet (0-255 channels). */
export function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two sRGB triplets (1..21). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

interface TokenPair {
  name: string;
  light: Rgb;
  dark: Rgb;
}

/**
 * Read the light/dark token pairs from `root` once and return an apply fn.
 * Calling `apply(progress)` interpolates every token and writes it to :root.
 */
export function createThemeScroller(
  root: HTMLElement = document.documentElement,
): (progress: number) => void {
  const style = getComputedStyle(root);
  const pairs: TokenPair[] = THEME_TOKENS.map((name) => ({
    name,
    light: parseTriplet(style.getPropertyValue(`--light-${name}`)),
    dark: parseTriplet(style.getPropertyValue(`--dark-${name}`)),
  }));

  return function apply(progress: number): void {
    const t = clamp01(progress);
    for (const pair of pairs) {
      const [r, g, b] = lerpRgb(pair.light, pair.dark, t);
      root.style.setProperty(`--color-${pair.name}`, `${r} ${g} ${b}`);
    }
  };
}
