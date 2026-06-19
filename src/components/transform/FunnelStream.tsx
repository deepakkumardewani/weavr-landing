import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { demoSession } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { registerMotion } from "../../lib/motion";

/** Times the JSONL is repeated to fill the spanning wall height. */
const WALL_REPEAT = 6;

/**
 * Shared JSONL stream layer spanning the hero (S1) and weave morph (S2) sections.
 * Positioned absolutely inside a wrapper div in App.tsx that covers both.
 *
 * A1: pure render + slow upward drift (same motion the hero wall had).
 * B1 adds scroll-linked condense, B2 copy fade, C1 through-flow, C2 render cutoff.
 */
export function FunnelStream() {
  const lines = useMemo(() => {
    const raw = toJsonl(demoSession).split("\n");
    return Array.from({ length: WALL_REPEAT }, () => raw).flat();
  }, []);

  const wallRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <pre
      ref={wallRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none whitespace-pre px-6 py-8 font-mono text-[12px] leading-5 text-muted/20"
    >
      {lines.map((line, index) => (
        <div key={index} className="truncate">
          {line}
        </div>
      ))}
    </pre>
  );
}
