import { useEffect } from "react";
import { useScrollBridge } from "./hooks/useScrollBridge";
import { Timeline } from "./components/output/timeline/Timeline";
import { demoSession } from "./data/demo-session";

/**
 * Composition root. Phase B is wiring up the centerpiece; this currently mounts
 * the dot-timeline in the dark phase for verification. Phase C stitches the
 * full hero -> process -> output narrative.
 */
export default function App() {
  useScrollBridge();

  useEffect(() => {
    document.documentElement.setAttribute("data-phase", "dark");
    return () => document.documentElement.removeAttribute("data-phase");
  }, []);

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Timeline events={demoSession} />
      </div>
    </main>
  );
}
