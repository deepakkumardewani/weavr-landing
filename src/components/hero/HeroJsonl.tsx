import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isSmallScreen, prefersReducedMotion } from "../../lib/motion";
import { ScrollCue } from "./ScrollCue";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_LINES = ["Make your Claude Code", "transcripts readable."];

const SUBLINE =
  "weavr turns raw JSONL session logs into beautiful, shareable HTML — 100% local, no AI.";

/**
 * S1 hero: framing copy over the shared FunnelStream wall (in App.tsx wrapper).
 * Vignette + glow keep the copy legible at rest. As the user scrolls, the copy
 * fades out early (B2) so the condensing wall takes center stage before the
 * weave section pins. No CTA — the GitHub icon lives in the header.
 */
export function HeroJsonl() {
  const [reduced] = useState(() => prefersReducedMotion() || isSmallScreen());
  const copyRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sublineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (reduced) return;
    const copy = copyRef.current;
    const section = sectionRef.current;
    if (!copy || !section) return;

    const ctx = gsap.context(() => {
      // Entrance: headline lines stagger in with fade-up + blur clear
      gsap.from(headlineRefs.current, {
        opacity: 0,
        y: 28,
        filter: "blur(8px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.18,
        delay: 0.15,
        clearProps: "filter",
      });

      // Subtext follows after headline finishes
      gsap.from(sublineRef.current, {
        opacity: 0,
        y: 18,
        filter: "blur(6px)",
        duration: 0.8,
        ease: "power3.out",
        delay: 0.55,
        clearProps: "filter",
      });
      // B2: Fade copy early — gone by the time the wall is mid-condense.
      // Fades from 0% to 45% scroll progress through the hero.
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Fade out across the first 45% of hero scroll; clamp at 0.
          const fadeProgress = Math.min(self.progress / 0.45, 1);
          gsap.set(copy, { opacity: 1 - fadeProgress });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-label="weavr — make your Claude Code transcripts readable"
      className="relative grid h-dvh place-items-center overflow-hidden"
    >
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

      {/* Focal layer: the framing copy. Fades early so the wall takes over. */}
      <div ref={copyRef} className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl md:text-6xl">
          {HEADLINE_LINES.map((line, i) => (
            <span
              key={i}
              ref={(el) => {
                headlineRefs.current[i] = el;
              }}
              className="block"
            >
              {line}
            </span>
          ))}
        </h1>
        <p
          ref={sublineRef}
          className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted sm:text-lg"
        >
          {SUBLINE}
        </p>
      </div>

      <ScrollCue />
    </section>
  );
}
