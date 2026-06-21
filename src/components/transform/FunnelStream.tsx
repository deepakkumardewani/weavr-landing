import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { demoSession } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { isSmallScreen, prefersReducedMotion, registerMotion } from "../../lib/motion";
import { RENDER_SCROLL_OFFSET } from "./WeaveMorph";

gsap.registerPlugin(ScrollTrigger);

/** Times the JSONL is repeated to fill the spanning wall height. */
const WALL_REPEAT = 6;
/** Mask opacity at rest (dim texture). */
const OPACITY_DIM = 0.15;
/** Mask opacity when fully converged into the ribbon at the weave entry. */
const OPACITY_BRIGHT = 0.5;
/** Half-width (% of viewport) of the thin centered ribbon — total width ≈ 16%. */
const RIBBON_HALF = 8;
/** Task 1: drift loop duration (seconds). Halved from 90 → 45 for a livelier pour. */
const DRIFT_DURATION_S = 45;
/** Spotlight radius in pixels — soft radial reveal on the bright overlay. */
const SPOTLIGHT_RADIUS_PX = 180;
/** Max concurrent flickering token spans. */
const FLICKER_CONCURRENT = 4;
/** Flicker tween rise/fall duration range (seconds) — slow enough to read as a glow. */
const FLICKER_DURATION_MIN = 1.4;
const FLICKER_DURATION_MAX = 2.6;
/** Target interval (seconds) between a chain's pulses; jittered ±20% to desync chains. */
const FLICKER_INTERVAL_S = 5;
/** Peak opacity a token reaches at the height of a flicker pulse (subtle, < spotlight). */
const FLICKER_PEAK_OPACITY = 0.85;
/** Fraction of lines that get a flicker-target span (one per sampled line). */
const FLICKER_LINE_SAMPLE_RATE = 0.4;
/** Pick the flicker token among the first N quoted strings — keeps it left of truncation. */
const FLICKER_TOKEN_CANDIDATES = 4;

/**
 * Symmetric horizontal collapse: both left and right edges move inward evenly
 * as p goes 0 → 1. At p=0 the full wall is visible; at p=1 both edges have
 * converged to a thin centered ribbon. No cone — top and bottom collapse equally.
 */
function ribbonClip(p: number): string {
  const inset = p * (50 - RIBBON_HALF);
  return `polygon(${inset}% 0%, ${100 - inset}% 0%, ${100 - inset}% 100%, ${inset}% 100%)`;
}

/** One quoted token in a line, split so it can be wrapped in a flicker span. */
interface FlickerSegment {
  pre: string;
  token: string;
  post: string;
}

/**
 * The wall is compact (space-free) JSONL, so split on a quoted string rather than
 * whitespace. Pick randomly among the FIRST few quoted tokens so the highlight lands
 * left of where long lines get truncated (and stays visible).
 */
function pickFlickerToken(line: string): FlickerSegment | null {
  const matches: { value: string; index: number }[] = [];
  const re = /"[^"]*"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null && matches.length < FLICKER_TOKEN_CANDIDATES) {
    matches.push({ value: m[0], index: m.index });
  }
  if (!matches.length) return null;
  const chosen = matches[Math.floor(Math.random() * matches.length)];
  return {
    pre: line.slice(0, chosen.index),
    token: chosen.value,
    post: line.slice(chosen.index + chosen.value.length),
  };
}

/**
 * Shared JSONL stream layer spanning the hero (S1) and weave morph (S2) sections.
 *
 * Under motion it is a viewport-**fixed** firehose: a stationary funnel `mask`
 * whose clip-path narrows on scroll, with the text `<pre>` drifting *downward*
 * inside it so the log appears to pour through the funnel. Fixed (not absolute)
 * so it stays in view behind the *pinned* weave instead of scrolling away.
 *
 * Animated path:
 *   – Continuous downward drift (time-based, scroll-independent).
 *   – B1: scroll-linked converge + brighten over the hero range
 *         (wide dim wall → bright funnel pouring to a center neck).
 *   – C1+C2: funnel keeps pouring + thins behind parse/DAG, opacity → 0 exactly
 *            at the render beat (derived from the same constants as WeaveMorph).
 *   – Living texture: cursor radial spotlight + random token flickers.
 *
 * Fallback (reduced-motion OR small screen): static dim wall confined to the
 * hero viewport only — no funnel, no flow, no scroll trap.
 */
export function FunnelStream() {
  const [reduced] = useState(() => prefersReducedMotion() || isSmallScreen());

  // lines: base set (no flicker spans) — used for both dim base and bright overlay.
  // flickerLines: same lines, each carrying an optional quoted token to flicker.
  const { lines, flickerLines } = useMemo(() => {
    const raw = toJsonl(demoSession).split("\n");
    const repeated = Array.from({ length: WALL_REPEAT }, () => raw).flat();

    // Task 4: tag a sampled subset of lines with one quoted token to highlight.
    const flicker = repeated.map((line) => {
      const segment = Math.random() <= FLICKER_LINE_SAMPLE_RATE ? pickFlickerToken(line) : null;
      return { line, segment };
    });

    return { lines: repeated, flickerLines: flicker };
  }, []);

  const maskRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLPreElement>(null);
  const overlayRef = useRef<HTMLPreElement>(null);
  const overlayWrapRef = useRef<HTMLDivElement>(null);
  const flickerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (reduced) return;
    const mask = maskRef.current;
    const wall = wallRef.current;
    const overlay = overlayRef.current;
    const overlayWrap = overlayWrapRef.current;
    const flickerLayer = flickerRef.current;
    if (!mask || !wall || !overlay || !overlayWrap || !flickerLayer) return;
    const wrapper = mask.parentElement;
    if (!wrapper) return;

    return registerMotion({
      animate: () => {
        const ctx = gsap.context(() => {
          // clipPath lives on mask (clips both dim wall + spotlight overlay together).
          // Opacity lives on wall only — the overlay must stay visually independent
          // so the spotlight reveal isn't crushed by the parent's 0.15 opacity.
          gsap.set(mask, { clipPath: ribbonClip(0) });
          gsap.set(wall, { opacity: OPACITY_DIM });

          // Task 1: DRIFT_DURATION_S = 45 (halved from 90).
          // Both dim wall and bright overlay share the same tween targets so they
          // stay pixel-aligned (no parallax between layers).
          gsap.fromTo(
            [wall, overlay, flickerLayer],
            { yPercent: -100 / WALL_REPEAT },
            { yPercent: 0, duration: DRIFT_DURATION_S, ease: "none", repeat: -1 },
          );

          // Hero range: symmetric inward collapse + brighten (opacity on wall only).
          const heroRange = { p: 0 };
          const condenseTl = gsap.timeline();
          condenseTl.to(heroRange, {
            p: 1,
            ease: "power2.inOut",
            onUpdate: () => {
              gsap.set(mask, { clipPath: ribbonClip(heroRange.p) });
              gsap.set(wall, {
                opacity: OPACITY_DIM + (OPACITY_BRIGHT - OPACITY_DIM) * heroRange.p,
              });
            },
          });
          ScrollTrigger.create({
            trigger: wrapper,
            start: "top top",
            end: () => "+=" + window.innerHeight,
            scrub: 1.5,
            animation: condenseTl,
            invalidateOnRefresh: true,
          });

          // Weave range: fade to 0 at render beat.
          const weaveSection = document.querySelector("[data-weave-section]") as HTMLElement | null;
          if (weaveSection) {
            ScrollTrigger.create({
              trigger: weaveSection,
              start: "top top",
              end: `+=${RENDER_SCROLL_OFFSET}`,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                gsap.set(mask, { clipPath: ribbonClip(1) });
                gsap.set(wall, { opacity: OPACITY_BRIGHT * (1 - self.progress) });
                // Fade the spotlight + flicker overlays too so they vanish at render beat.
                gsap.set([overlayWrap, flickerLayer], { opacity: 1 - self.progress });
              },
              onLeave: () => gsap.set(mask, { display: "none" }),
              onEnterBack: () => {
                gsap.set(mask, { display: "" });
                gsap.set([overlayWrap, flickerLayer], { opacity: 1 });
              },
            });
          }

          // ── Task 3: Cursor spotlight via CSS custom properties ──────────────
          // pointermove → rAF-coalesced write to --mx / --my on the overlay wrapper.
          // The overlay's mask-image radial-gradient tracks these vars.
          // Default = far offscreen so no spotlight shows before first mousemove.
          overlayWrap.style.setProperty("--mx", "-9999px");
          overlayWrap.style.setProperty("--my", "-9999px");

          let pendingX = -9999;
          let pendingY = -9999;
          let rafId = 0;

          function flushPointer() {
            rafId = 0;
            overlayWrap!.style.setProperty("--mx", `${pendingX}px`);
            overlayWrap!.style.setProperty("--my", `${pendingY}px`);
          }

          function onPointerMove(e: PointerEvent) {
            pendingX = e.clientX;
            pendingY = e.clientY;
            if (!rafId) rafId = requestAnimationFrame(flushPointer);
          }

          window.addEventListener("pointermove", onPointerMove, { passive: true });

          // ── Task 5: Random token flicker tweens ─────────────────────────────
          // Run exactly FLICKER_CONCURRENT independent "chains": each chain flickers
          // one random span, then schedules ONLY its own next pulse on completion.
          // Concurrency stays constant — re-scheduling per chain (not per spawned
          // tween) avoids the geometric tween explosion that froze the page.
          const flickerSpans = Array.from(
            flickerLayer.querySelectorAll<HTMLSpanElement>("[data-flicker]"),
          );
          let flickerActive = true;

          /** Jittered interval (±20%) so the chains don't sync into one pulse. */
          const nextGap = () => FLICKER_INTERVAL_S * (0.8 + Math.random() * 0.4);

          /** Prefer a span currently in the viewport so pulses are actually seen. */
          function pickVisibleSpan(): HTMLSpanElement {
            const vh = window.innerHeight;
            const onscreen = flickerSpans.filter((s) => {
              const r = s.getBoundingClientRect();
              return r.bottom > 0 && r.top < vh;
            });
            const pool = onscreen.length ? onscreen : flickerSpans;
            return pool[Math.floor(Math.random() * pool.length)];
          }

          function flickerOnce() {
            if (!flickerActive || !flickerSpans.length) return;
            const span = pickVisibleSpan();
            const duration =
              FLICKER_DURATION_MIN + Math.random() * (FLICKER_DURATION_MAX - FLICKER_DURATION_MIN);
            gsap.fromTo(
              span,
              { opacity: 0 },
              {
                opacity: FLICKER_PEAK_OPACITY,
                duration: duration * 0.5,
                ease: "power1.inOut",
                yoyo: true,
                repeat: 1,
                repeatDelay: duration * 0.15,
                onComplete: () => gsap.delayedCall(nextGap(), flickerOnce),
              },
            );
          }

          // Start one chain per slot, phased evenly across the interval so the
          // collective cadence is steady (~FLICKER_INTERVAL_S / FLICKER_CONCURRENT).
          const flickerChains = Math.min(FLICKER_CONCURRENT, flickerSpans.length);
          for (let i = 0; i < flickerChains; i++) {
            gsap.delayedCall((i / flickerChains) * FLICKER_INTERVAL_S + 0.3, flickerOnce);
          }

          // Cleanup: stop scheduling flickers, remove pointer listener, cancel rAF.
          return () => {
            flickerActive = false;
            window.removeEventListener("pointermove", onPointerMove);
            if (rafId) cancelAnimationFrame(rafId);
          };
        }, mask);
        return () => ctx.revert();
      },
      static: () => {},
    });
  }, [reduced]);

  // text-muted at full color — dimness is controlled via mask opacity (GSAP or inline style).
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
    <div
      ref={maskRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {/* Dim base wall — always visible at OPACITY_DIM (controlled by mask opacity). */}
      <pre ref={wallRef} className={wallClass}>
        {lines.map((line, index) => (
          <div key={index} className="truncate">
            {line}
          </div>
        ))}
      </pre>

      {/*
       * Task 2: Bright overlay — same wall at full brightness, revealed only through
       * a radial-gradient mask centered at cursor (--mx, --my). Sits atop the dim
       * base. pointer-events-none so the wall stays non-interactive.
       *
       * Task 3: --mx/--my are written via rAF-coalesced pointermove handler (no React state).
       */}
      <div
        ref={overlayWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          // Reveal only the spotlight circle; hide everywhere else.
          maskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS_PX}px at var(--mx) var(--my), black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS_PX}px at var(--mx) var(--my), black 0%, transparent 100%)`,
        }}
      >
        {/* Full-brightness wall, revealed only inside the cursor spotlight. */}
        <pre ref={overlayRef} className={`${wallClass} text-fg opacity-100`}>
          {lines.map((line, index) => (
            <div key={index} className="truncate">
              {line}
            </div>
          ))}
        </pre>
      </div>

      {/*
       * Task 4/5: Random token flickers across the ENTIRE wall — independent of the
       * cursor spotlight. Unmasked full-brightness layer whose text is transparent
       * except the sampled flicker spans, which rest at opacity 0 (the dim base shows
       * through) and pulse toward FLICKER_PEAK_OPACITY via GSAP. Sits atop everything;
       * shares the same drift transform so flickers stay pixel-aligned with the base.
       */}
      <pre
        ref={flickerRef}
        aria-hidden="true"
        className={`${wallClass} absolute inset-x-0 top-0 text-transparent opacity-100`}
      >
        {flickerLines.map(({ line, segment }, index) => {
          if (segment) {
            // pre/token/post keep every character so the span aligns with the dim base.
            return (
              <div key={index} className="truncate">
                {segment.pre}
                <span data-flicker className="text-fg" style={{ opacity: 0 }}>
                  {segment.token}
                </span>
                {segment.post}
              </div>
            );
          }
          return (
            <div key={index} className="truncate">
              {line}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
