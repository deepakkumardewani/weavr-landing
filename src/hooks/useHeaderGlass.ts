import { useEffect, useState } from "react";

/**
 * Returns true once the user has scrolled past one viewport height (end of hero).
 * Uses a passive scroll listener for performance; threshold is 100vh.
 */
export function useHeaderGlass(): boolean {
  const [glassy, setGlassy] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setGlassy(window.scrollY > window.innerHeight * 0.85);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // sync on mount in case page is already scrolled
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return glassy;
}
