import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DemoEvent } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { isSmallScreen, prefersReducedMotion } from "../../lib/motion";
import { Timeline } from "./timeline/Timeline";

/** Scroll distance (px) the panel stays pinned per conversation event. */
const PIN_DISTANCE_PER_EVENT = 230;
/** Dimmed opacity for events not yet "reached" by the scrub. */
const DIMMED_OPACITY = 0.16;

type View = "rendered" | "raw";

/**
 * S3 centerpiece. While not in reduced motion, the section pins and the
 * conversation is scrubbed: each event brightens in turn and the transcript
 * advances upward, so the page holds while the conversation plays. Under
 * reduced motion (B5) it degrades to a normal, fully-rendered scrollable panel.
 * A before/after toggle (R2/F6) flips the same panel back to its raw JSONL form
 * — "that mess became this" — reusing the serializer that fed the hero.
 */
export function OutputPanel({ events }: { events: DemoEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("rendered");
  const raw = useMemo(() => toJsonl(events), [events]);
  // The pinned scrub is dropped under reduced motion (B5) and on small screens
  // (E3), both of which fall back to the same fully-rendered scrollable panel.
  const [reduced] = useState(() => prefersReducedMotion() || isSmallScreen());

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const panel = panelRef.current;
    const track = trackRef.current;
    if (!section || !panel || !track) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-reveal-index]", track);
      gsap.set(rows, { opacity: DIMMED_OPACITY, y: 16 });
      gsap.set(rows[0], { opacity: 1, y: 0 });

      const span = rows.length;
      const timeline = gsap.timeline();
      rows.forEach((row, index) => {
        timeline.to(row, { opacity: 1, y: 0, ease: "none" }, index);
      });
      // Advance the transcript upward across the whole scrub so the active
      // event stays in view inside the fixed-height panel.
      timeline.to(
        track,
        {
          y: () => -Math.max(0, track.scrollHeight - panel.clientHeight),
          ease: "none",
          duration: span,
        },
        0,
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${span * PIN_DISTANCE_PER_EVENT}`,
        pin: true,
        scrub: 1,
        animation: timeline,
        invalidateOnRefresh: true,
      });
    }, section);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="weavr output"
      className="theme-dark flex min-h-dvh items-center justify-center bg-bg px-6 py-16 text-fg"
    >
      <div className="w-full max-w-3xl">
        <WindowChrome view={view} onChange={setView} />
        <div
          ref={panelRef}
          className={
            reduced
              ? "relative overflow-hidden rounded-b-xl border border-t-0 border-border bg-bg px-6 py-8"
              : "relative h-[68vh] overflow-hidden rounded-b-xl border border-t-0 border-border bg-bg px-6 py-8"
          }
        >
          {/* Rendered timeline stays mounted so the scrub keeps its node refs;
              the raw layer overlays it when toggled, so there's no layout jump. */}
          <div ref={trackRef} className="will-change-transform" aria-hidden={view === "raw"}>
            <Timeline events={events} />
          </div>

          {view === "raw" && (
            <pre
              data-raw-jsonl
              className="absolute inset-0 overflow-auto whitespace-pre bg-bg px-6 py-8 font-mono text-[12px] leading-5 text-muted"
            >
              {raw}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}

/** macOS-style title bar that frames the timeline as a weavr export window. */
function WindowChrome({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <div className="flex items-center gap-2 rounded-t-xl border border-border bg-surface px-4 py-3">
      <span className="size-3 rounded-full bg-diff-remove" aria-hidden="true" />
      <span className="size-3 rounded-full bg-dot-user" aria-hidden="true" />
      <span className="size-3 rounded-full bg-dot-assistant" aria-hidden="true" />
      <span className="ml-3 truncate font-mono text-xs text-muted">format-dates-session.html</span>
      <ViewToggle view={view} onChange={onChange} />
    </div>
  );
}

const VIEWS: { value: View; label: string }[] = [
  { value: "rendered", label: "Rendered" },
  { value: "raw", label: "Raw" },
];

/** Segmented control flipping the panel between weavr's output and raw JSONL. */
function ViewToggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return (
    <div
      role="group"
      aria-label="Panel view"
      className="ml-auto flex shrink-0 rounded-md border border-border p-0.5"
    >
      {VIEWS.map(({ value, label }) => {
        const active = view === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(value)}
            className={`rounded px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              active ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
