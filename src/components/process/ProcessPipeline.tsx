import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerMotion } from "../../lib/motion";

const LOCAL_BADGES = ["100% local", "No AI", "Single binary"] as const;

const WEAVR_STEPS = ["parse", "session DAG", "SQLite cache", "render"] as const;

/**
 * S2 process: the three-beat explainer — raw JSONL flows into weavr and emerges
 * as a clean transcript. Beats reveal on scroll and an accent pulse travels the
 * connector to show the flow. Reduced motion leaves the full diagram in place.
 */
export function ProcessPipeline() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    return registerMotion({
      animate: () => {
        const ctx = gsap.context(() => {
          const beats = gsap.utils.toArray<HTMLElement>("[data-beat]", root);
          gsap.from(beats, {
            opacity: 0,
            y: 28,
            duration: 0.7,
            stagger: 0.18,
            scrollTrigger: { trigger: root, start: "top 65%" },
          });
          // Accent pulses travelling left -> right along the flow.
          gsap.to("[data-pulse]", {
            xPercent: 100,
            opacity: 0,
            duration: 1.6,
            ease: "power1.in",
            repeat: -1,
            stagger: 0.5,
          });
        }, root);
        return () => ctx.revert();
      },
      static: () => {},
    });
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="How weavr works"
      className="relative grid min-h-dvh place-items-center bg-bg px-6 py-24 text-fg"
    >
      <div className="w-full max-w-5xl">
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-accent">
          How it works
        </p>
        <h2 className="mb-16 text-center text-2xl font-medium tracking-tight sm:text-3xl">
          Point weavr at your transcripts. Get something you can actually read.
        </h2>

        <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <Beat label="Raw JSONL" caption="~/.claude/projects/**">
            <div className="space-y-1 font-mono text-[10px] leading-4 text-muted/60">
              {[
                '{"type":"user","message":{…}}',
                '{"type":"assistant",…}',
                '{"type":"tool_use",…}',
              ].map((line) => (
                <div key={line} className="truncate">
                  {line}
                </div>
              ))}
            </div>
          </Beat>

          <Connector />

          <Beat label="weavr" caption="one Rust binary, on your machine" accent>
            <ol className="space-y-1.5">
              {WEAVR_STEPS.map((step) => (
                <li key={step} className="flex items-center gap-2 font-mono text-xs text-fg">
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                  {step}
                </li>
              ))}
            </ol>
          </Beat>

          <Connector />

          <Beat label="Beautiful HTML" caption="self-contained, shareable">
            <div className="space-y-2">
              {["bg-dot-user", "bg-dot-assistant", "bg-dot-tool"].map((dot, i) => (
                <div key={dot} className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${dot}`} aria-hidden />
                  <span className="h-2 rounded bg-surface-2" style={{ width: `${70 - i * 12}%` }} />
                </div>
              ))}
            </div>
          </Beat>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {LOCAL_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-xs text-muted"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A single pipeline stage card. */
function Beat({
  label,
  caption,
  accent,
  children,
}: {
  label: string;
  caption: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      data-beat
      className={`flex flex-col rounded-xl border bg-surface/50 p-5 ${
        accent ? "border-accent/40" : "border-border"
      }`}
    >
      <div className="mb-1 font-medium">{label}</div>
      <div className="mb-4 text-xs text-muted">{caption}</div>
      <div className="mt-auto">{children}</div>
    </div>
  );
}

/** Horizontal flow connector with a travelling accent pulse (chevron on mobile). */
function Connector() {
  return (
    <div className="flex items-center justify-center md:px-1">
      <div className="relative hidden h-px w-full min-w-10 overflow-hidden bg-border md:block">
        <span
          data-pulse
          aria-hidden
          className="absolute left-0 top-1/2 h-px w-8 -translate-y-1/2 bg-accent"
        />
      </div>
      <span className="text-accent md:hidden" aria-hidden>
        ↓
      </span>
    </div>
  );
}
