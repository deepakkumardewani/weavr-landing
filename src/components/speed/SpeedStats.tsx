import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SPEED_RACE, SPEED_STATS } from "../../data/stats";
import { registerMotion } from "../../lib/motion";
import { CountUp } from "../ui/CountUp";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * S4 speed: the 46.5× story. Three count-up stats land the headline numbers and
 * a race bar fills on scroll so the gap vs `claude-code-log` is felt, not read.
 */
export function SpeedStats() {
  return (
    <section
      aria-label="weavr speed"
      className="theme-dark grid min-h-dvh place-items-center bg-bg px-6 py-24 text-fg"
    >
      <div className="w-full max-w-5xl">
        <SectionHeading eyebrow="Fast" title="Built in Rust. Renders before you blink." />

        <div className="grid gap-6 sm:grid-cols-3">
          {SPEED_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface/50 p-8 text-center"
            >
              <CountUp
                value={stat.value}
                decimals={stat.decimals}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="block font-mono text-4xl font-semibold tracking-tight text-accent sm:text-5xl"
              />
              <p className="mt-3 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <RaceBar />
      </div>
    </section>
  );
}

/** Two horizontal bars whose widths fill on scroll to show the speed gap. */
function RaceBar() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    return registerMotion({
      animate: () => {
        const ctx = gsap.context(() => {
          gsap.from("[data-bar-fill]", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.1,
            ease: "power2.out",
            stagger: 0.15,
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
          });
        }, root);
        return () => ctx.revert();
      },
      static: () => {},
    });
  }, []);

  return (
    <div ref={rootRef} className="mx-auto mt-16 max-w-2xl space-y-4">
      {SPEED_RACE.map((contender) => (
        <div key={contender.name}>
          <div className="mb-1.5 flex items-baseline justify-between font-mono text-xs">
            <span className={contender.accent ? "text-accent" : "text-muted"}>
              {contender.name}
            </span>
            <span className="text-muted">{contender.time}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
            <div
              data-bar-fill
              className={`h-full rounded-full ${contender.accent ? "bg-accent" : "bg-muted/50"}`}
              style={{ width: `${contender.fraction * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
