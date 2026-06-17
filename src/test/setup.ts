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
