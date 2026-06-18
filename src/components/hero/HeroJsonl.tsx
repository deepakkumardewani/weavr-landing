import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { demoSession } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { registerMotion } from "../../lib/motion";
import { ScrollCue } from "./ScrollCue";

/** Times the JSONL is repeated to overflow the viewport into an endless wall. */
const WALL_REPEAT = 6;

const HEADLINE = "Make your Claude Code transcripts readable.";
const SUBLINE =
  "weavr turns raw JSONL session logs into beautiful, shareable HTML — 100% local, no AI.";

/**
 * S1 hero (R2): the raw JSONL of the demo session is dimmed to a low-opacity
 * background texture behind a vignette, with a slow upward drift so it reads as
 * a live log firehose — the villain, not content to read. Framing copy sits on
 * top as the focal layer so a first-time visitor grasps the promise in ~3s
 * without scrolling. No CTA, no modal — the GitHub icon lives in the header.
 */
export function HeroJsonl() {
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
          // Slow upward drift — the wall is an endless log firehose scrolling past.
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
    <section
      aria-label="weavr — make your Claude Code transcripts readable"
      className="relative grid h-dvh place-items-center overflow-hidden bg-bg"
    >
      {/* Raw JSONL, dimmed to a texture. aria-hidden: it's decoration behind the
          real copy, not content for assistive tech to read. */}
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

      {/* Vignette: fade the texture into the page edges so it reads as endless. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 30%, rgb(var(--color-bg)) 95%)",
        }}
      />

      {/* Soft glow directly behind the copy to lift it off the texture for AA. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgb(var(--color-bg) / 0.92), transparent 80%)",
        }}
      />

      {/* Focal layer: the framing copy. */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl md:text-6xl">
          {HEADLINE}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted sm:text-lg">
          {SUBLINE}
        </p>
      </div>

      <ScrollCue />
    </section>
  );
}
