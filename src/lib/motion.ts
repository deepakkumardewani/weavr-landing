/**
 * Reduced-motion harness + shared GSAP defaults.
 *
 * Every scroll-scrubbed animation in the app routes through `registerMotion`,
 * which runs the animated path only when the user has not asked for reduced
 * motion — otherwise it applies a static, legible end-state. This keeps the
 * fallback co-located with the animation rather than bolted on later.
 */
import gsap from "gsap";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Shared GSAP tween defaults — calm, premium, transform/opacity only. */
export const MOTION_DEFAULTS = {
  ease: "power2.out",
  duration: 0.6,
} as const;

gsap.defaults(MOTION_DEFAULTS);

/** True when the user (or OS) requests reduced motion. SSR-safe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Subscribe to reduced-motion preference changes; returns an unsubscribe fn. */
export function onReducedMotionChange(callback: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  const handler = (event: MediaQueryListEvent) => callback(event.matches);
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}

/**
 * Register a piece of motion with a static fallback.
 * - Motion allowed: runs `animate` and returns its cleanup (if any).
 * - Reduced motion: runs `static` to apply the legible end-state.
 */
export function registerMotion(handlers: {
  animate: () => (() => void) | void;
  static: () => void;
}): () => void {
  if (prefersReducedMotion()) {
    handlers.static();
    return () => {};
  }
  const cleanup = handlers.animate();
  return cleanup ?? (() => {});
}
