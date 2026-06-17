import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createThemeScroller } from "../lib/theme-scroll";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Drives the light -> dark palette from global scroll progress. The transition
 * runs from the top of the page to the bottom of `endRef` (the output section),
 * so the theme is fully dark by the time the centerpiece is on screen. Under
 * reduced motion it settles straight to the dark palette.
 */
export function useThemeScroll(endRef?: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const apply = createThemeScroller();

    if (prefersReducedMotion()) {
      apply(1);
      return;
    }

    apply(0);
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => {
        const el = endRef?.current;
        return el ? el.offsetTop + el.offsetHeight : ScrollTrigger.maxScroll(window);
      },
      onUpdate: (self) => apply(self.progress),
      invalidateOnRefresh: true,
    });

    return () => trigger.kill();
  }, [endRef]);
}
