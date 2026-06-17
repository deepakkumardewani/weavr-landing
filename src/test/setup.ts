import "@testing-library/jest-dom";

/**
 * jsdom has no matchMedia. Provide a controllable stub so reduced-motion paths
 * are testable. Tests can override `window.__reducedMotion` before asserting.
 */
declare global {
  // eslint-disable-next-line no-var
  var __reducedMotion: boolean;
}

globalThis.__reducedMotion = false;

// jsdom does not load tokens.css. Seed the light/dark theme channels so
// createThemeScroller can read them, mirroring the stylesheet defaults.
const THEME_SEED: Record<string, [string, string]> = {
  bg: ["250 248 245", "26 24 21"],
  fg: ["28 26 23", "236 230 219"],
  surface: ["242 239 234", "35 32 25"],
  "surface-2": ["232 228 221", "45 41 32"],
  border: ["216 210 200", "58 53 43"],
  muted: ["107 100 89", "163 154 138"],
  accent: ["234 122 77", "240 145 95"],
  "accent-fg": ["28 18 12", "26 16 10"],
};
for (const [name, [light, dark]] of Object.entries(THEME_SEED)) {
  document.documentElement.style.setProperty(`--light-${name}`, light);
  document.documentElement.style.setProperty(`--dark-${name}`, dark);
}

// jsdom has no ResizeObserver; Lenis constructs one on init.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => {
    const matches = query.includes("prefers-reduced-motion") && globalThis.__reducedMotion;
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}
