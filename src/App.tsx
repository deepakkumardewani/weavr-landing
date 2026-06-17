import { useEffect } from "react";
import { useScrollBridge } from "./hooks/useScrollBridge";
import { OutputPanel } from "./components/output/OutputPanel";
import { demoSession } from "./data/demo-session";

/**
 * Composition root. Phase B mounts the centerpiece (S3) in the dark phase with
 * lead-in/lead-out space so the pinned scrub has room. Phase C wraps it in the
 * full hero -> process -> output narrative.
 */
export default function App() {
  useScrollBridge();

  useEffect(() => {
    document.documentElement.setAttribute("data-phase", "dark");
    return () => document.documentElement.removeAttribute("data-phase");
  }, []);

  return (
    <main className="bg-bg text-fg">
      <section className="grid min-h-dvh place-items-center">
        <p className="font-mono text-sm text-muted">scroll to weavr output ↓</p>
      </section>
      <OutputPanel events={demoSession} />
      <section className="grid min-h-dvh place-items-center">
        <p className="font-mono text-sm text-muted">…and out</p>
      </section>
    </main>
  );
}
