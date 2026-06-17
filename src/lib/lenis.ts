/**
 * Smooth-scroll + ScrollTrigger bridge.
 *
 * One Lenis instance owns inertial scrolling; a single RAF loop drives both
 * Lenis and GSAP's ScrollTrigger so there is exactly one scroll source of
 * truth (no competing listeners). Section animations register their own
 * ScrollTriggers elsewhere — they all read from this bridge.
 *
 * Under reduced motion we skip Lenis entirely and let native scrolling drive
 * ScrollTrigger via its own ticker.
 */
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./motion";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollBridge {
  lenis: Lenis | null;
  destroy: () => void;
}

/**
 * Initialize the scroll bridge. Call once on mount; call `destroy()` on unmount.
 */
export function initScrollBridge(): ScrollBridge {
  if (prefersReducedMotion()) {
    // Native scroll; ScrollTrigger uses its default ticker.
    ScrollTrigger.refresh();
    return { lenis: null, destroy: () => ScrollTrigger.killAll() };
  }

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
  lenis.on("scroll", () => ScrollTrigger.update());

  // Single RAF loop: drive Lenis from GSAP's ticker (lag-smoothing off so the
  // two clocks never drift).
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const destroy = () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    ScrollTrigger.killAll();
  };

  return { lenis, destroy };
}
