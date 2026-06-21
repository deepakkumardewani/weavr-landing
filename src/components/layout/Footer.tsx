import { LINKS } from "../../lib/links";

const TRUST_CHIPS = ["100% local", "no AI", "a single Rust binary"] as const;

/**
 * S7 footer: closes the page with the same conviction as the hero.
 * Left-aligned two-row layout — tagline + chips left, links right — so the
 * eye lands on the brand statement first, not an anonymous centered blob.
 */
export function Footer() {
  return (
    <footer className="theme-dark border-t border-border bg-bg px-6 py-16 text-fg">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Closing statement */}
        <p className="font-mono text-sm text-muted/70">
          Your sessions. <span className="text-accent">Rendered.</span> Local.
        </p>

        {/* Main row: trust chips left, links right */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Why weavr">
            {TRUST_CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
              >
                {chip}
              </li>
            ))}
          </ul>

          <nav aria-label="External links" className="flex items-center gap-6">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-xs text-muted transition-colors duration-150 hover:text-accent"
            >
              GitHub
            </a>
          </nav>
        </div>

        {/* Bottom strip: inspiration credit left, copyright right */}
        <div className="flex flex-col gap-2 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted/50">
            Inspired by{" "}
            <a
              href={LINKS.claudeCodeLog}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-dotted underline-offset-2 transition-colors duration-150 hover:text-muted"
            >
              claude-code-log
            </a>
          </p>
          <p className="font-mono text-xs text-muted/40">© {new Date().getFullYear()} weavr</p>
        </div>
      </div>
    </footer>
  );
}
