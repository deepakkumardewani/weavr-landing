import { useRef } from "react";
import { useScrollBridge } from "./hooks/useScrollBridge";
import { useThemeScroll } from "./hooks/useThemeScroll";
import { HeroJsonl } from "./components/hero/HeroJsonl";
import { ProcessPipeline } from "./components/process/ProcessPipeline";
import { OutputPanel } from "./components/output/OutputPanel";
import { demoSession } from "./data/demo-session";

/**
 * Composition root. Phase C drives the light -> dark palette from scroll. The
 * full hero -> process -> output narrative is stitched in C4; for now the theme
 * spans a lead-in, the centerpiece, and a lead-out.
 */
export default function App() {
  useScrollBridge();
  const outputRef = useRef<HTMLDivElement>(null);
  useThemeScroll(outputRef);

  return (
    <main className="bg-bg text-fg">
      <HeroJsonl />
      <ProcessPipeline />
      <div ref={outputRef}>
        <OutputPanel events={demoSession} />
      </div>
      <section className="grid min-h-dvh place-items-center">
        <p className="font-mono text-sm text-muted">…and out</p>
      </section>
    </main>
  );
}
