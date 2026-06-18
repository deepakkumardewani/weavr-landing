import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerMotion } from "../../lib/motion";

/**
 * A subtle "see it weave" invitation at the foot of the hero: a label above a
 * chevron that bobs gently downward to signal there's more below. Purely
 * decorative (no link/button — the hero stays CTA-free); under reduced motion
 * the chevron sits still, so the cue is always visible but never animated.
 */
export function ScrollCue() {
  const chevronRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const chevron = chevronRef.current;
    if (!chevron) return;

    return registerMotion({
      animate: () => {
        const tween = gsap.to(chevron, {
          y: 8,
          duration: 1.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        return () => tween.kill();
      },
      static: () => {},
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-muted"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.25em]">see it weave</span>
      <span ref={chevronRef} className="block text-xl leading-none">
        ↓
      </span>
    </div>
  );
}
