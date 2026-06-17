import { LINKS } from "../../lib/links";
import { GitHubIcon } from "../ui/GitHubIcon";

/**
 * Fixed header — wordmark left, GitHub link right. Colors resolve from the
 * interpolated theme tokens (`text-fg`/`border`), so it stays legible as the
 * page crosses from the light to the dark phase. A faint blurred backdrop keeps
 * it readable over whichever section sits beneath it.
 */
export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="rounded font-mono text-base font-semibold tracking-tight text-fg transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          weavr
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
