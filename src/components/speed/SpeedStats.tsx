import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BENCHMARK_META, SPEED_RACE_GROUPS, SPEED_STATS } from "../../data/stats";
import { registerMotion } from "../../lib/motion";
import { CountUp } from "../ui/CountUp";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * S4 speed: the 58.2× story. Three count-up stats land the headline numbers and
 * two race bars (all-projects + single-session) fill on scroll so the gap vs
 * `claude-code-log` is felt, not just read.
 */
export function SpeedStats() {
  return (
    <section
      aria-label="weavr speed"
      className="theme-dark grid min-h-dvh place-items-center bg-bg px-6 py-24 text-fg"
    >
      <div className="w-full max-w-5xl">
        <SectionHeading
          eyebrow="Fast"
          title="Built from ground up in Rust. Renders before you blink."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {SPEED_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface/50 p-8 text-center transition-all duration-200 hover:border-accent/50 hover:bg-surface/80 hover:scale-[1.02] motion-reduce:hover:scale-100"
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
        <BenchmarkDetails />
      </div>
    </section>
  );
}

/** Collapsible panel showing the benchmark methodology and raw figures. */
function BenchmarkDetails() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="benchmark-details"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span
          aria-hidden="true"
          className={`transition-transform duration-200 motion-reduce:transition-none ${
            open ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        Benchmark details
      </button>

      <div
        id="benchmark-details"
        className={`overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
          open ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-lg border border-border bg-surface/50 px-5 py-4">
          {/* Two separate dl elements so each has only direct div→dt/dd children (valid HTML5). */}
          <dl className="font-mono text-xs grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
            <div>
              <dt className="text-muted">projects</dt>
              <dd className="text-fg">{BENCHMARK_META.projects}</dd>
            </div>
            <div>
              <dt className="text-muted">sessions</dt>
              <dd className="text-fg">{BENCHMARK_META.sessions}</dd>
            </div>
            <div>
              <dt className="text-muted">messages</dt>
              <dd className="text-fg">{BENCHMARK_META.messages}</dd>
            </div>
          </dl>
          <dl className="font-mono text-xs mt-3 grid grid-cols-2 gap-x-8 gap-y-2 border-t border-border/30 pt-3 sm:grid-cols-4">
            <div>
              <dt className="text-muted">tokens in</dt>
              <dd className="text-fg">{BENCHMARK_META.totalTokensIn}</dd>
            </div>
            <div>
              <dt className="text-muted">tokens out</dt>
              <dd className="text-fg">{BENCHMARK_META.totalTokensOut}</dd>
            </div>
            <div>
              <dt className="text-muted">cache read</dt>
              <dd className="text-fg">{BENCHMARK_META.totalCacheRead}</dd>
            </div>
            <div>
              <dt className="text-muted">cache write</dt>
              <dd className="text-fg">{BENCHMARK_META.totalCacheWrite}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">
            Measured with hyperfine (3 runs, --no-cache) on macOS against{" "}
            <span className="text-fg">~/.claude/projects/</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Two race groups (all-projects + single-session) whose bars fill on scroll. */
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
            stagger: 0.1,
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
          });
        }, root);
        return () => ctx.revert();
      },
      static: () => {},
    });
  }, []);

  return (
    <div ref={rootRef} className="mx-auto mt-16 max-w-2xl space-y-10">
      {SPEED_RACE_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-3 font-mono text-xs text-muted">{group.label}</p>
          <div className="space-y-3">
            {group.contenders.map((contender) => (
              <div key={contender.name} className="group">
                <div className="mb-1.5 flex items-baseline justify-between font-mono text-xs">
                  <span
                    className={`transition-colors duration-150 motion-reduce:transition-none ${
                      contender.accent ? "text-accent" : "text-muted group-hover:text-fg"
                    }`}
                  >
                    {contender.name}
                  </span>
                  <span className="text-muted transition-colors duration-150 group-hover:text-fg motion-reduce:transition-none">
                    {contender.time}
                  </span>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    data-bar-fill
                    className={`h-full rounded-full ${
                      contender.accent ? "bg-accent" : "bg-muted/50"
                    }`}
                    style={{ width: `${contender.fraction * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {/* Scale axis: 0 on left, round ceiling on right */}
            <div className="flex justify-between font-mono text-[10px] text-muted">
              <span>0</span>
              <span>{group.scaleMax}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
