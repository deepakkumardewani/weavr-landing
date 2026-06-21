import { LINKS } from "../../lib/links";
import { GitHubIcon } from "../ui/GitHubIcon";
import { useHeaderGlass } from "../../hooks/useHeaderGlass";

/**
 * Fixed header — wordmark left, GitHub link right. Glass effect activates
 * smoothly once the user scrolls past the hero section.
 */
export function Header() {
  const glassy = useHeaderGlass();

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ease-out"
      style={{
        backgroundColor: glassy ? "rgb(var(--color-bg) / 0.75)" : "transparent",
        backdropFilter: glassy ? "blur(12px)" : "none",
        borderBottom: glassy ? "1px solid rgb(var(--color-border) / 0.3)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a
          href="#top"
          className="flex items-center gap-2 rounded transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <img src="/icon.png" alt="weavr logo" className="size-7 rounded-md" />
          <span className="font-mono text-base font-semibold tracking-tight text-fg">weavr</span>
        </a>
        <a
          href={LINKS.github}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="weavr on GitHub"
          className="rounded-md border border-border/60 bg-surface/40 p-2 text-fg backdrop-blur-sm transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <GitHubIcon className="size-5" />
        </a>
      </div>
    </header>
  );
}
