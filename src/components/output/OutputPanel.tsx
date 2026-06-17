import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DemoEvent } from "../../data/demo-session";
import { prefersReducedMotion } from "../../lib/motion";
import { Timeline } from "./timeline/Timeline";

/** Scroll distance (px) the panel stays pinned per conversation event. */
const PIN_DISTANCE_PER_EVENT = 230;
/** Dimmed opacity for events not yet "reached" by the scrub. */
const DIMMED_OPACITY = 0.16;

/**
 * S3 centerpiece. While not in reduced motion, the section pins and the
 * conversation is scrubbed: each event brightens in turn and the transcript
 * advances upward, so the page holds while the conversation plays. Under
 * reduced motion (B5) it degrades to a normal, fully-rendered scrollable panel.
 */
export function OutputPanel({ events }: { events: DemoEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduced] = useState(prefersReducedMotion);

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
        <WindowChrome />
        <div
          ref={panelRef}
          className={
            reduced
              ? "overflow-hidden rounded-b-xl border border-t-0 border-border bg-bg px-6 py-8"
              : "h-[68vh] overflow-hidden rounded-b-xl border border-t-0 border-border bg-bg px-6 py-8"
          }
        >
          <div ref={trackRef} className="will-change-transform">
            <Timeline events={events} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** macOS-style title bar that frames the timeline as a weavr export window. */
function WindowChrome() {
  return (
    <div className="flex items-center gap-2 rounded-t-xl border border-border bg-surface px-4 py-3">
      <span className="size-3 rounded-full bg-diff-remove" aria-hidden="true" />
      <span className="size-3 rounded-full bg-dot-user" aria-hidden="true" />
      <span className="size-3 rounded-full bg-dot-assistant" aria-hidden="true" />
      <span className="ml-3 font-mono text-xs text-muted">format-dates-session.html</span>
    </div>
  );
}
