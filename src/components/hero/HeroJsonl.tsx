import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { demoSession } from "../../data/demo-session";
import { toJsonl } from "../../data/demo-jsonl";
import { registerMotion } from "../../lib/motion";

/** Times the JSONL is repeated to overflow the viewport into an endless wall. */
const WALL_REPEAT = 6;

/**
 * S1 hero: a full-viewport wall of raw, unreadable JSONL — the problem, stated
 * visually. No buttons, no headline that explains it; the mess is the message.
 * Tension motion (slow drift, line flicker, a blinking cursor) makes it feel
 * alive and overwhelming. Reduced motion leaves a static, equally illegible wall.
 */
export function HeroJsonl() {
  const lines = useMemo(() => {
    const raw = toJsonl(demoSession).split("\n");
    return Array.from({ length: WALL_REPEAT }, () => raw).flat();
  }, []);

  const wallRef = useRef<HTMLPreElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wall = wallRef.current;
    const cursor = cursorRef.current;
    if (!wall || !cursor) return;

    return registerMotion({
      animate: () => {
        const ctx = gsap.context(() => {
          // Slow vertical drift — the wall is endlessly scrolling past.
          gsap.to(wall, {
            yPercent: -50,
            duration: 60,
            ease: "none",
            repeat: -1,
          });
          // Random line flicker, like a terminal struggling to keep up.
          const rows = gsap.utils.toArray<HTMLElement>("[data-line]", wall);
          gsap.to(gsap.utils.shuffle(rows).slice(0, 14), {
            opacity: 0.25,
            duration: 0.9,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.4, repeat: -1 },
          });
          // Blinking cursor.
          gsap.to(cursor, {
            opacity: 0,
            duration: 0.5,
            ease: "steps(1)",
            repeat: -1,
            yoyo: true,
          });
        }, wall);
        return () => ctx.revert();
      },
      static: () => {},
    });
  }, []);

  return (
    <section
      aria-label="Unreadable Claude Code transcript"
      className="relative grid h-dvh place-items-center overflow-hidden bg-bg"
    >
      {/* The hero is a deliberate wordless visual; this gives assistive tech and
          search engines the page's single h1 without altering the design. */}
      <h1 className="sr-only">weavr — turn unreadable Claude Code JSONL into beautiful HTML</h1>

      <pre
        ref={wallRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none whitespace-pre px-6 py-8 font-mono text-[12px] leading-5 text-muted/55"
      >
        {lines.map((line, index) => (
          <div key={index} data-line className="truncate">
            {line}
          </div>
        ))}
      </pre>

      {/* Vignette: fade the wall into the page edges so it reads as endless. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 35%, rgb(var(--color-bg)) 100%)",
        }}
      />

      {/* Live cursor — the only crisp element, hinting this is a live feed. */}
      <span
        ref={cursorRef}
        aria-hidden="true"
        className="relative z-10 inline-block h-5 w-2.5 bg-fg/70"
      />
    </section>
  );
}
