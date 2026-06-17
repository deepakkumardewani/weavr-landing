import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerMotion } from "../../lib/motion";
import { SectionHeading } from "../ui/SectionHeading";

interface Feature {
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    title: "Self-contained HTML",
    body: "One file with everything inlined — open it anywhere, share it anywhere.",
  },
  {
    title: "Light & dark themes",
    body: "Warm-neutral Material 3 output that reads well in either mode.",
  },
  {
    title: "Markdown export",
    body: "Export to Markdown with selectable detail levels for docs or review.",
  },
  {
    title: "Rich tool rendering",
    body: "Bash, Read, Edit and Write calls render as cards with real diffs.",
  },
  {
    title: "Token tracking",
    body: "Per-message input/output token counts surfaced inline.",
  },
  {
    title: "Multi-project export",
    body: "Sweep every project under ~/.claude in a single command.",
  },
  {
    title: "SQLite incremental cache",
    body: "Only re-renders what changed, so repeat runs stay instant.",
  },
  {
    title: "100% local",
    body: "A single Rust binary on your machine. No accounts, no AI, no upload.",
  },
];

/**
 * S5 features: a concise grid of differentiators. Cards reveal on scroll and
 * stack to one column on mobile. Reduced motion leaves them fully in place.
 */
export function FeatureGrid() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    return registerMotion({
      animate: () => {
        const ctx = gsap.context(() => {
          gsap.from("[data-feature]", {
            opacity: 0,
            y: 24,
            duration: 0.6,
            stagger: 0.08,
            scrollTrigger: { trigger: root, start: "top 70%", once: true },
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
      aria-label="weavr features"
      className="theme-dark bg-bg px-6 py-24 text-fg"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to read your sessions again."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              data-feature
              className="rounded-xl border border-border bg-surface/50 p-6 transition-[colors,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/50 motion-reduce:hover:translate-y-0"
            >
              <h3 className="mb-2 font-medium">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{feature.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
