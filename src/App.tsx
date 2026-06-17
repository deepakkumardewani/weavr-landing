import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollBridge } from "./hooks/useScrollBridge";

/**
 * Composition root. For Phase A this hosts a scroll-bridge probe (tall panels +
 * a sample ScrollTrigger reporting progress) that proves inertial scroll and
 * trigger firing. Phases B/C replace the panels with the real sections.
 */
export default function App() {
  useScrollBridge();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setProgress(self.progress),
    });
    return () => trigger.kill();
  }, []);

  return (
    <main className="bg-bg text-fg">
      <div
        className="pointer-events-none fixed right-4 top-4 z-50 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs tabular-nums text-muted"
        data-testid="scroll-progress"
      >
        scroll {(progress * 100).toFixed(0)}%
      </div>

      <div ref={trackRef}>
        <section className="grid min-h-dvh place-items-center">
          <h1 className="font-mono text-3xl tracking-tight">weavr</h1>
        </section>
        <section className="grid min-h-dvh place-items-center bg-surface">
          <p className="font-mono text-sm text-muted">scroll bridge probe — S2</p>
        </section>
        <section className="grid min-h-dvh place-items-center bg-surface-2">
          <p className="font-mono text-sm text-muted">scroll bridge probe — S3</p>
        </section>
      </div>
    </main>
  );
}
