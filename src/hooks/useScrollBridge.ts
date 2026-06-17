import { useEffect } from "react";
import { initScrollBridge } from "../lib/lenis";

/**
 * Mounts the single Lenis + ScrollTrigger bridge for the app lifetime.
 * Place once at the composition root.
 */
export function useScrollBridge(): void {
  useEffect(() => {
    const bridge = initScrollBridge();
    return () => bridge.destroy();
  }, []);
}
