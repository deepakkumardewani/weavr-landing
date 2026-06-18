import { CopyBlock } from "../ui/CopyBlock";
import { GitHubIcon } from "../ui/GitHubIcon";
import { SectionHeading } from "../ui/SectionHeading";
import { LINKS } from "../../lib/links";

const INSTALL_COMMANDS = [
  "brew install deepakkumardewani/weavr/weavr",
  "cargo binstall weavr",
  "cargo install weavr",
] as const;

/** Trust pills moved here from the removed S2 explainer — the convergence point. */
const TRUST_PILLS = ["100% local", "No AI", "Single binary"] as const;

interface QuickstartStep {
  command: string;
  caption: string;
}

const QUICKSTART_STEPS: QuickstartStep[] = [
  { command: "brew install deepakkumardewani/weavr/weavr", caption: "Install the binary." },
  { command: "weavr -i ~/.claude/projects/my-app", caption: "Export a single session." },
  {
    command: "weavr --all-projects --open-browser",
    caption: "Export everything and open it.",
  },
];

/**
 * S6 install + quickstart — the primary CTA (R2/F7). It lands after the payoff,
 * once the visitor is convinced: copyable install commands, a "View on GitHub"
 * link, and the `100% local · No AI · Single binary` trust pills (relocated from
 * the removed explainer). Every command is a {@link CopyBlock}, so they copy
 * with feedback and are keyboard-reachable.
 */
export function InstallSection() {
  return (
    <section
      id="install"
      aria-label="Install weavr"
      className="theme-dark bg-bg px-6 py-24 text-fg"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Install" title="One command. No dependencies." align="left" />
            <div className="space-y-3">
              {INSTALL_COMMANDS.map((command) => (
                <CopyBlock key={command} command={command} />
              ))}
            </div>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <GitHubIcon className="size-4" />
              View on GitHub
            </a>
          </div>

          <div>
            <SectionHeading
              eyebrow="Quickstart"
              title="From install to readable in three steps."
              align="left"
            />
            <ol className="space-y-6">
              {QUICKSTART_STEPS.map((step, index) => (
                <li key={step.command} className="flex gap-4">
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/50 font-mono text-xs text-accent">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm text-muted">{step.caption}</p>
                    <CopyBlock command={step.command} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <ul className="mt-16 flex flex-wrap justify-center gap-3" aria-label="Why weavr">
          {TRUST_PILLS.map((pill) => (
            <li
              key={pill}
              className="rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-xs text-muted"
            >
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
