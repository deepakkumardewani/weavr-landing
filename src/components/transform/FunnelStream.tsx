import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { demoSession } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { isSmallScreen, prefersReducedMotion, registerMotion } from "../../lib/motion";

/** Times the JSONL is repeated to fill the spanning wall height. */
const WALL_REPEAT = 6;

/**
 * Shared JSONL stream layer spanning the hero (S1) and weave morph (S2) sections.
 * Positioned absolutely inside a wrapper div in App.tsx that covers both.
 *
 * Animated path (motion OK, ≥768px): slow upward drift, later phases add
 * scroll-linked condense (B1), copy fade (B2), through-flow (C1), cutoff (C2).
 *
 * Fallback (reduced-motion OR small screen): static dim wall confined to the
 * hero viewport only — no funnel, no flow, no scroll trap.
 */
export function FunnelStream() {
  const [reduced] = useState(() => prefersReducedMotion() || isSmallScreen());

  const lines = useMemo(() => {
    const raw = toJsonl(demoSession).split("\n");
    return Array.from({ length: WALL_REPEAT }, () => raw).flat();
  }, []);

  const wallRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (reduced) return;
    const wall = wallRef.current;
    if (!wall) return;

    return registerMotion({
      animate: () => {
        const ctx = gsap.context(() => {
          // Slow upward drift — endless log firehose scrolling past.
          gsap.to(wall, {
            yPercent: -50,
            duration: 90,
            ease: "none",
            repeat: -1,
          });
        }, wall);
        return () => ctx.revert();
      },
      static: () => {},
    });
  }, [reduced]);

  const wallClass =
    "pointer-events-none select-none whitespace-pre px-6 py-8 font-mono text-[12px] leading-5 text-muted/20";

  if (reduced) {
    // Confine to hero viewport; no animation, no scroll pin.
    return (
      <pre
        ref={wallRef}
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-dvh overflow-hidden ${wallClass}`}
      >
        {lines.map((line, index) => (
          <div key={index} className="truncate">
            {line}
          </div>
        ))}
      </pre>
    );
  }

  return (
    <pre
      ref={wallRef}
      aria-hidden="true"
      className={`absolute inset-0 ${wallClass}`}
    >
      {lines.map((line, index) => (
        <div key={index} className="truncate">
          {line}
        </div>
      ))}
    </pre>
  );
}
