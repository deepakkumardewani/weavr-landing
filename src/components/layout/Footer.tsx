import { LINKS } from "../../lib/links";

const FOOTER_LINKS = [
  { label: "GitHub", href: LINKS.github },
  { label: "crates.io", href: LINKS.crates },
  { label: "License (MIT)", href: LINKS.license },
  { label: "claude-code-log", href: LINKS.claudeCodeLog },
] as const;

/**
 * S7 footer: a quiet close-out that re-states the one promise that matters —
 * everything runs locally, with no AI — and links out to the project's homes.
 */
export function Footer() {
  return (
    <footer className="theme-dark border-t border-border bg-bg px-6 py-16 text-fg">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm text-muted">100% local · no AI · a single Rust binary</p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs text-muted">
          Built with{" "}
          <a
            href={LINKS.claudeCodeLog}
            target="_blank"
            rel="noreferrer noopener"
            className="underline decoration-dotted underline-offset-2 hover:text-accent"
          >
            claude-code-log
          </a>{" "}
          inspiration.
        </p>
      </div>
    </footer>
  );
}
