import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DemoEvent } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { isSmallScreen, prefersReducedMotion } from "../../lib/motion";
import { toWeaveBubbles, type WeaveBubble } from "./weave-data";

/** Raw JSONL lines surfaced in the "before" layer of the morph. */
const RAW_LINE_COUNT = 8;
/** Scroll distance (px) the section stays pinned across the full morph. */
const PIN_DISTANCE = 1500;
/** Mechanism captions that surface, in order, as the morph advances. */
const MECHANISM = ["parse", "session DAG", "render"] as const;

/**
 * S2 transformation (R2): replaces the old static "How it works" cards. The
 * *same* hero JSONL is dimmed and collapses while the woven conversation
 * reflows in beneath it — one continuous raw -> woven motion, scrubbed to
 * scroll, with `parse · session DAG · render` captions surfacing as each beat
 * happens. Under reduced motion / on small screens it degrades to a static
 * before -> after diagram with the mechanism words labeled (F4).
 */
export function WeaveMorph({ events }: { events: DemoEvent[] }) {
  const rawLines = useMemo(() => toJsonl(events).split("\n").slice(0, RAW_LINE_COUNT), [events]);
  const bubbles = useMemo(() => toWeaveBubbles(events), [events]);

  const sectionRef = useRef<HTMLElement>(null);
  const [reduced] = useState(() => prefersReducedMotion() || isSmallScreen());

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const rawRows = gsap.utils.toArray<HTMLElement>("[data-raw-line]", section);
      const bubbleRows = gsap.utils.toArray<HTMLElement>("[data-bubble]", section);
      const captions = gsap.utils.toArray<HTMLElement>("[data-caption]", section);

      gsap.set(bubbleRows, { opacity: 0, y: 28 });
      gsap.set(captions, { opacity: 0.25 });
      gsap.set(captions[0], { opacity: 1 });

      // One normalized timeline scrubbed across the pin: raw collapses (beats
      // 0-4), woven reflows in (beats 3-9), captions cross-fade at the thirds.
      const tl = gsap.timeline();
      tl.to(rawRows, { opacity: 0, y: -24, stagger: 0.4, ease: "power1.in", duration: 4 }, 0);
      tl.to(bubbleRows, { opacity: 1, y: 0, stagger: 0.6, ease: "power2.out", duration: 6 }, 3);
      // caption: parse (on) -> session DAG -> render
      tl.to(captions[0], { opacity: 0.25, duration: 1 }, 3);
      tl.to(captions[1], { opacity: 1, duration: 1 }, 3);
      tl.to(captions[1], { opacity: 0.25, duration: 1 }, 6);
      tl.to(captions[2], { opacity: 1, duration: 1 }, 6);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${PIN_DISTANCE}`,
        pin: true,
        scrub: 1,
        animation: tl,
        invalidateOnRefresh: true,
      });
    }, section);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section
        ref={sectionRef}
        aria-label="How weavr weaves raw JSONL into a readable conversation"
        className="grid min-h-dvh place-items-center bg-bg px-6 py-24 text-fg"
      >
        <StaticDiagram rawLines={rawLines} bubbles={bubbles} />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="How weavr weaves raw JSONL into a readable conversation"
      className="grid min-h-dvh place-items-center overflow-hidden bg-bg px-6 text-fg"
    >
      <div className="w-full max-w-2xl">
        {/* The morph stage: raw and woven layers occupy the same box so the
            transformation reads as happening in place. */}
        <div className="relative h-[58vh]">
          <pre
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none space-y-1 overflow-hidden whitespace-pre font-mono text-[11px] leading-5 text-muted/45"
          >
            {rawLines.map((line, index) => (
              <div key={index} data-raw-line className="truncate">
                {line}
              </div>
            ))}
          </pre>

          <div className="absolute inset-0 flex flex-col justify-center gap-3">
            {bubbles.map((bubble) => (
              <BubbleRow key={bubble.id} bubble={bubble} />
            ))}
          </div>
        </div>

        <Captions />
      </div>
    </section>
  );
}

/** The cross-fading mechanism captions shown during the morph. */
function Captions() {
  return (
    <div className="mt-8 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
      {MECHANISM.map((word, index) => (
        <span key={word} className="flex items-center gap-3">
          {index > 0 && (
            <span className="text-muted/40" aria-hidden>
              ·
            </span>
          )}
          <span data-caption className="text-accent-strong">
            {word}
          </span>
        </span>
      ))}
    </div>
  );
}

/** A single woven conversation row: colored dot, speaker label, snippet. */
function BubbleRow({ bubble }: { bubble: WeaveBubble }) {
  return (
    <div
      data-bubble
      className="flex items-start gap-3 rounded-xl border border-border bg-surface/70 p-4"
    >
      <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${bubble.dotClass}`} aria-hidden />
      <div className="min-w-0">
        <div className="font-mono text-xs text-muted">{bubble.label}</div>
        <p className="truncate text-sm text-fg">{bubble.text}</p>
      </div>
    </div>
  );
}

/**
 * Reduced-motion / small-screen fallback (F4): a static before -> after diagram
 * — the raw JSONL block, the mechanism words, then the rendered conversation —
 * so the same story reads without any scrub.
 */
function StaticDiagram({ rawLines, bubbles }: { rawLines: string[]; bubbles: WeaveBubble[] }) {
  return (
    <div className="grid w-full max-w-5xl items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
      <figure className="rounded-xl border border-border bg-surface/50 p-5">
        <figcaption className="mb-3 font-mono text-xs text-muted">Raw JSONL</figcaption>
        <pre className="space-y-1 overflow-hidden whitespace-pre font-mono text-[11px] leading-5 text-muted/60">
          {rawLines.map((line, index) => (
            <div key={index} className="truncate">
              {line}
            </div>
          ))}
        </pre>
      </figure>

      <div
        className="flex flex-row items-center justify-center gap-2 md:flex-col"
        aria-label="weavr parses, builds a session DAG, and renders"
      >
        {MECHANISM.map((word, index) => (
          <span key={word} className="flex items-center gap-2 md:flex-col">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-strong">
              {word}
            </span>
            {index < MECHANISM.length - 1 && (
              <span className="text-muted/50" aria-hidden>
                →
              </span>
            )}
          </span>
        ))}
      </div>

      <figure className="rounded-xl border border-border bg-surface/50 p-5">
        <figcaption className="mb-3 font-mono text-xs text-muted">Rendered</figcaption>
        <div className="space-y-3">
          {bubbles.map((bubble) => (
            <BubbleRow key={bubble.id} bubble={bubble} />
          ))}
        </div>
      </figure>
    </div>
  );
}
