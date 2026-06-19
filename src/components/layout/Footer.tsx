import { LINKS } from "../../lib/links";

const CHIPS = ["100% local", "no AI", "a single Rust binary"] as const;

/**
 * S7 footer: three trust chips re-state the core promise, followed by the
 * claude-code-log inspiration credit. Nav links removed — GitHub and crates
 * live in the Install section.
 */
export function Footer() {
  return (
    <footer className="theme-dark border-t border-border bg-bg px-6 py-16 text-fg">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <ul className="flex flex-wrap justify-center gap-3" aria-label="Why weavr">
          {CHIPS.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-xs text-muted"
            >
              {chip}
            </li>
          ))}
        </ul>
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
