import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DemoEvent } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { isSmallScreen, prefersReducedMotion } from "../../lib/motion";
import { SectionHeading } from "../ui/SectionHeading";
import { toParseFields, toWeaveBubbles, type ParseField, type WeaveBubble } from "./weave-data";

/** Raw JSONL lines surfaced in the "parse" stage as the before-texture. */
const RAW_LINE_COUNT = 3;
/** Scroll distance (px) the section stays pinned across all three stages. */
export const PIN_DISTANCE = 2200;
/**
 * Scroll offset (px from weave start) where the render beat begins.
 * Derived from the timeline: render starts at position 6 of 7.6 total units.
 */
export const RENDER_SCROLL_OFFSET = Math.round(PIN_DISTANCE * (6 / 7.6));
/** Mechanism words shown, in order, as the morph advances. */
const MECHANISM = ["parse", "session DAG", "render"] as const;
/** Plain-English gloss under each mechanism word (same index as MECHANISM). */
const GLOSS = [
  "read each raw line into typed fields",
  "link the messages into one thread",
  "style the thread for humans",
] as const;

/**
 * S2 transformation (R2): the *same* hero JSONL learns to read itself across
 * three legible beats — `parse` lifts fields out of a raw record, `session DAG`
 * links those records into a branching thread, `render` resolves the thread
 * into the woven conversation. One pinned scrub drives all three so the steps
 * are *shown*, not just named. Under reduced motion / on small screens it
 * degrades to a static before -> after diagram with each step labeled (F4).
 */
export function WeaveMorph({ events }: { events: DemoEvent[] }) {
  const rawLines = useMemo(() => toJsonl(events).split("\n").slice(0, RAW_LINE_COUNT), [events]);
  const parseFields = useMemo(() => toParseFields(events), [events]);
  const bubbles = useMemo(() => toWeaveBubbles(events), [events]);

  const sectionRef = useRef<HTMLElement>(null);
  const [reduced] = useState(() => prefersReducedMotion() || isSmallScreen());

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const parseLayer = q("[data-layer='parse']");
      const dagLayer = q("[data-layer='dag']");
      const renderLayer = q("[data-layer='render']");
      const chips = q("[data-parse-chip]");
      const spine = q("[data-dag-spine]");
      const nodes = q("[data-dag-node]");
      const renderRows = q("[data-render-row]");
      const progressRail = q("[data-progress-rail]");
      const captions = q<HTMLElement>("[data-caption]");
      const glosses = q<HTMLElement>("[data-gloss]");

      // Initial states: only the parse stage and its caption are live.
      gsap.set(dagLayer, { opacity: 0 });
      gsap.set(renderLayer, { opacity: 0 });
      gsap.set(chips, { opacity: 0, y: 10 });
      gsap.set(spine, { scaleY: 0 });
      gsap.set(nodes, { opacity: 0, scale: 0.85 });
      gsap.set(renderRows, { opacity: 0, y: 24 });
      gsap.set(progressRail, { scaleX: 0 });
      gsap.set(captions, { opacity: 0.3 });
      gsap.set(captions[0], { opacity: 1 });
      gsap.set(glosses, { opacity: 0 });
      gsap.set(glosses[0], { opacity: 1 });

      // One normalized timeline (~9 units) scrubbed across the pin. Beats:
      // parse 0-3, session DAG 3-6, render 6-9.
      const tl = gsap.timeline();

      // 1. parse — fields lift out of the raw record.
      tl.to(chips, { opacity: 1, y: 0, stagger: 0.45, duration: 1.4, ease: "power2.out" }, 0.3);
      tl.to(parseLayer, { opacity: 0, y: -20, duration: 1, ease: "power1.in" }, 2.6);

      // 2. session DAG — records connect into a branching thread.
      tl.to(dagLayer, { opacity: 1, duration: 0.6 }, 3);
      tl.to(spine, { scaleY: 1, duration: 1, ease: "power2.out" }, 3.2);
      tl.to(
        nodes,
        { opacity: 1, scale: 1, stagger: 0.32, duration: 0.9, ease: "back.out(1.4)" },
        3.4,
      );
      tl.to(dagLayer, { opacity: 0, y: -20, duration: 1, ease: "power1.in" }, 5.8);

      // 3. render — the thread becomes the woven conversation.
      tl.to(renderLayer, { opacity: 1, duration: 0.6 }, 6);
      tl.to(renderRows, { opacity: 1, y: 0, stagger: 0.5, duration: 1.4, ease: "power2.out" }, 6.2);

      // Progress rail tracks scroll through the pinned section, near-linear.
      tl.to(progressRail, { scaleX: 1, ease: "none", duration: 7.6 }, 0);

      // Captions + glosses cross-fade at each beat boundary.
      crossfadeCaption(tl, captions, glosses, 0, 1, 3);
      crossfadeCaption(tl, captions, glosses, 1, 2, 6);

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
      data-weave-section
      aria-label="How weavr weaves raw JSONL into a readable conversation"
      className="relative z-10 grid min-h-dvh place-items-center overflow-hidden px-6 text-fg"
    >
      {/* Frosted-glass panel: the fixed ribbon falls behind this panel (z-10
          on the section keeps it above the fixed stream), so backdrop-blur
          softens the ribbon under the content while beats stay crisp on top. */}
      <div className="w-full max-w-2xl rounded-2xl border border-border/40 bg-bg/75 px-6 py-8 backdrop-blur-md">
        {/* Persistent frame: orients the viewer while only the stage morphs. */}
        <SectionHeading
          align="left"
          eyebrow="The weave"
          title="Three passes turn a raw log into one readable thread."
        />

        {/* The morph stage: the three beats share one box and left edge, so each
            step reads as the previous one transforming in place. */}
        <div className="relative h-[clamp(23rem,42vh,25rem)]">
          <ParseLayer rawLines={rawLines} fields={parseFields} />
          <DagLayer bubbles={bubbles} />
          <RenderLayer bubbles={bubbles} />
        </div>

        <Stepper />
      </div>
    </section>
  );
}

/** Cross-fade word `from` -> `to` (and their glosses) at timeline position. */
function crossfadeCaption(
  tl: gsap.core.Timeline,
  captions: HTMLElement[],
  glosses: HTMLElement[],
  from: number,
  to: number,
  at: number,
) {
  tl.to(captions[from], { opacity: 0.3, duration: 0.8 }, at);
  tl.to(captions[to], { opacity: 1, duration: 0.8 }, at);
  // Glosses are stacked, so hand off sequentially (out, then in) rather than
  // cross-fading — otherwise both sit at ~50% mid-scrub and overprint.
  tl.to(glosses[from], { opacity: 0, duration: 0.5 }, at);
  tl.to(glosses[to], { opacity: 1, duration: 0.5 }, at + 0.5);
}

/** Beat 1 — raw records read into typed fields. */
function ParseLayer({ rawLines, fields }: { rawLines: string[]; fields: ParseField[] }) {
  return (
    <div data-layer="parse" className="absolute inset-0 flex flex-col justify-start gap-8 pt-2">
      <pre
        aria-hidden="true"
        className="pointer-events-none select-none space-y-1 overflow-hidden whitespace-pre font-mono text-[11px] leading-5 text-muted/40"
      >
        {rawLines.map((line, index) => (
          <div key={index} className="truncate">
            {line}
          </div>
        ))}
      </pre>

      <div className="flex flex-wrap gap-2">
        {fields.map((field) => (
          <span
            key={field.key}
            data-parse-chip
            className="flex max-w-full items-baseline gap-1.5 rounded-lg border border-border bg-surface/70 px-3 py-1.5 font-mono text-xs"
          >
            <span className="text-muted">{field.key}</span>
            <span className="truncate text-accent-strong">{field.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Beat 2 — parsed records linked into a branching thread (the session DAG). */
function DagLayer({ bubbles }: { bubbles: WeaveBubble[] }) {
  return (
    <div data-layer="dag" className="absolute inset-0 flex flex-col justify-start pt-2">
      <ul className="relative space-y-7 pl-1">
        {/* Spine: the parent -> child trunk the thread hangs from. */}
        <span
          data-dag-spine
          aria-hidden
          className="absolute left-[5px] top-2 bottom-2 w-px origin-top bg-border"
        />
        {bubbles.map((bubble) => (
          <DagNode key={bubble.id} bubble={bubble} />
        ))}
      </ul>
    </div>
  );
}

/**
 * A node in the DAG: tool results branch off the trunk as sidechains. Each node
 * carries its real session payload — the prompt / tool command / thinking, plus
 * structural metadata (time, tokens) — so the graph reads as actual linked
 * records, not just labels.
 */
function DagNode({ bubble }: { bubble: WeaveBubble }) {
  const isBranch = bubble.kind === "tool";
  return (
    <li data-dag-node className={`relative flex gap-3 ${isBranch ? "ml-8" : ""}`}>
      {isBranch && (
        <span aria-hidden className="absolute -left-8 top-[0.65rem] h-px w-6 bg-border" />
      )}
      <span
        className={`mt-[0.3rem] size-2.5 shrink-0 rounded-full ${bubble.dotClass}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-fg">{bubble.label}</span>
          {bubble.meta && (
            <span className="font-mono text-[10px] tracking-wide text-muted/60">{bubble.meta}</span>
          )}
        </div>
        <p className="truncate font-mono text-xs text-muted">{bubble.text}</p>
      </div>
    </li>
  );
}

/** Beat 3 — the thread resolved into the woven conversation. */
function RenderLayer({ bubbles }: { bubbles: WeaveBubble[] }) {
  return (
    <div data-layer="render" className="absolute inset-0 flex flex-col justify-start gap-2.5 pt-2">
      {bubbles.map((bubble) => (
        <BubbleRow key={bubble.id} bubble={bubble} attr="data-render-row" />
      ))}
    </div>
  );
}

/**
 * Numbered progress stepper shown beneath the stage: the three mechanism words
 * as `01 · 02 · 03` passes, a rail that fills as you scrub (so the viewer knows
 * how far through the pipeline they are), and the active step's plain-English
 * gloss. Active word/number brighten via the scrubbed timeline.
 */
function Stepper() {
  return (
    <div className="mt-10">
      <ol className="grid grid-cols-3 gap-4">
        {MECHANISM.map((word, index) => (
          <li key={word} className="flex flex-col gap-1.5">
            <span data-caption className="flex items-baseline gap-2 text-accent-strong">
              <span className="font-mono text-[10px] tracking-[0.15em] tabular-nums">
                0{index + 1}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.18em]">{word}</span>
            </span>
          </li>
        ))}
      </ol>

      {/* Rail: fills left -> right with scroll progress through the section. */}
      <div className="relative mt-4 h-px w-full overflow-hidden bg-border">
        <span
          data-progress-rail
          aria-hidden
          className="absolute inset-y-0 left-0 w-full origin-left bg-accent"
        />
      </div>

      {/* Glosses stack so swapping one in never shifts the layout below. */}
      <div className="relative mt-4 h-5">
        {GLOSS.map((gloss) => (
          <p key={gloss} data-gloss className="absolute inset-0 text-sm text-muted">
            {gloss}
          </p>
        ))}
      </div>
    </div>
  );
}

/** A single woven conversation row: colored dot, speaker label, snippet. */
function BubbleRow({ bubble, attr }: { bubble: WeaveBubble; attr?: string }) {
  const dataProps = attr ? { [attr]: true } : {};
  return (
    <div
      {...dataProps}
      className="flex items-start gap-3 rounded-xl border border-border bg-surface/70 p-3.5"
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
 * — the raw JSONL block, the three mechanism steps with their glosses, then the
 * rendered conversation — so the same story reads without any scrub.
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

      <ol
        className="flex flex-row items-center justify-center gap-4 md:flex-col md:items-start"
        aria-label="weavr parses, builds a session DAG, and renders"
      >
        {MECHANISM.map((word, index) => (
          <li key={word} className="flex items-center gap-3 md:flex-col md:items-start">
            <div className="md:text-left">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-strong">
                {word}
              </div>
              <div className="mt-0.5 text-xs text-muted">{GLOSS[index]}</div>
            </div>
            {index < MECHANISM.length - 1 && (
              <span className="text-muted/50 md:hidden" aria-hidden>
                →
              </span>
            )}
          </li>
        ))}
      </ol>

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
