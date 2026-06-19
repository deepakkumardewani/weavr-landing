import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { demoSession } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { isSmallScreen, prefersReducedMotion, registerMotion } from "../../lib/motion";
import { PIN_DISTANCE } from "./WeaveMorph";

gsap.registerPlugin(ScrollTrigger);

/** Times the JSONL is repeated to fill the spanning wall height. */
const WALL_REPEAT = 6;
/** Wall opacity at rest (dim texture). Controlled via element opacity so GSAP can animate it. */
const OPACITY_DIM = 0.15;
/** Wall opacity when fully condensed into the column at the weave entry. */
const OPACITY_BRIGHT = 0.5;
/** Fraction of viewport width the wall narrows to as the center column (B1). */
const COLUMN_SCALE = 0.38;
/** Wall opacity at the minimum before the render cutoff (C1 end-state). */
const OPACITY_THIN = 0.05;

/**
 * Shared JSONL stream layer spanning the hero (S1) and weave morph (S2) sections.
 * Positioned absolutely inside a wrapper div in App.tsx that covers both.
 *
 * Animated path:
 *   – Continuous upward drift (time-based, scroll-independent).
 *   – B1: scroll-linked condense + brighten over hero range
 *         (full-width dim wall → center column bright wall).
 *   – C1: column flows + thins during parse + DAG beats.
 *   – C2: cut opacity to 0 exactly at the render beat (future phase).
 *
 * Fallback (reduced-motion OR small screen): static dim wall confined to
 * the hero viewport only — no funnel, no flow, no scroll trap.
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
          // Initial state: full-width, dim.
          gsap.set(wall, { opacity: OPACITY_DIM, scaleX: 1 });

          // Continuous upward drift — endless log firehose, scroll-independent.
          gsap.to(wall, {
            yPercent: -50,
            duration: 90,
            ease: "none",
            repeat: -1,
          });

          // B1: Condense + brighten over the hero scroll range.
          // Trigger on the wrapper (parentElement); end = one viewport height down.
          const wrapper = wall.parentElement;
          if (wrapper) {
            const condenseTl = gsap.timeline();
            condenseTl.fromTo(
              wall,
              { scaleX: 1, opacity: OPACITY_DIM },
              { scaleX: COLUMN_SCALE, opacity: OPACITY_BRIGHT, ease: "power1.inOut" },
            );

            ScrollTrigger.create({
              trigger: wrapper,
              start: "top top",
              end: () => "+=" + window.innerHeight,
              scrub: 1.5,
              animation: condenseTl,
              invalidateOnRefresh: true,
            });
          }

          // C1: Column flows + thins during parse and session DAG beats.
          // Opacity drifts from OPACITY_BRIGHT down to OPACITY_THIN across the
          // full weave pin so the stream feels like it's being consumed.
          const weaveSection = document.querySelector("[data-weave-section]") as HTMLElement | null;
          if (weaveSection) {
            ScrollTrigger.create({
              trigger: weaveSection,
              start: "top top",
              end: `+=${PIN_DISTANCE}`,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const opacity = OPACITY_BRIGHT - (OPACITY_BRIGHT - OPACITY_THIN) * self.progress;
                gsap.set(wall, { opacity });
              },
            });
          }
        }, wall);
        return () => ctx.revert();
      },
      static: () => {},
    });
  }, [reduced]);

  // text-muted at full color — dimness is controlled via element opacity (GSAP or inline style).
  const wallClass =
    "pointer-events-none select-none whitespace-pre px-6 py-8 font-mono text-[12px] leading-5 text-muted";

  if (reduced) {
    return (
      <pre
        ref={wallRef}
        aria-hidden="true"
        style={{ opacity: OPACITY_DIM }}
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
    <pre ref={wallRef} aria-hidden="true" className={`absolute inset-0 ${wallClass}`}>
      {lines.map((line, index) => (
        <div key={index} className="truncate">
          {line}
        </div>
      ))}
    </pre>
  );
}
