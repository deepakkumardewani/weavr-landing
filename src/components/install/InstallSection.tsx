import { useState } from "react";
import { CopyBlock } from "../ui/CopyBlock";
import { SectionHeading } from "../ui/SectionHeading";

type OS = "macOS" | "Linux";

interface OsCommands {
  install: readonly string[];
}

const OS_COMMANDS: Record<OS, OsCommands> = {
  macOS: {
    install: [
      "brew install deepakkumardewani/weavr/weavr",
      "cargo binstall weavr",
      "cargo install weavr",
    ],
  },
  Linux: {
    install: ["cargo binstall weavr", "cargo install weavr"],
  },
};

const OS_TABS: OS[] = ["macOS", "Linux"];

interface QuickstartStep {
  command: string;
  caption: string;
}

// Install is the left column — quickstart shows two independent usage commands.
const QUICKSTART_STEPS: QuickstartStep[] = [
  {
    command: "weavr -i ~/.claude/projects/my-app/session.jsonl",
    caption: "Export a single session.",
  },
  {
    command: "weavr --all-projects --open-browser",
    caption: "Export every project.",
  },
];

/**
 * S6 install + quickstart. Left: OS-tabbed install commands. Right: two
 * post-install usage steps. A vertical rule at lg ties them into one
 * "get started" block without repeating the install command.
 */
export function InstallSection() {
  const [activeOS, setActiveOS] = useState<OS>("macOS");
  const commands = OS_COMMANDS[activeOS].install;

  return (
    <section
      id="install"
      aria-label="Install weavr"
      className="theme-dark bg-bg px-6 py-24 text-fg"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]">
          {/* ── Install ─────────────────────────────────────── */}
          <div className="pb-12 lg:pb-0 lg:pr-12">
            <SectionHeading eyebrow="Install" title="One command. Ready in seconds." align="left" />

            <div
              role="tablist"
              aria-label="Operating system"
              className="mb-4 flex gap-1 rounded-lg border border-border bg-surface/50 p-1"
            >
              {OS_TABS.map((os) => (
                <button
                  key={os}
                  type="button"
                  role="tab"
                  aria-selected={activeOS === os}
                  onClick={() => setActiveOS(os)}
                  className={`flex-1 rounded-md px-4 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    activeOS === os ? "bg-accent text-bg" : "text-muted hover:text-fg"
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {commands.map((command) => (
                <CopyBlock key={command} command={command} />
              ))}
            </div>
          </div>

          {/* ── Vertical rule (lg+) / Horizontal rule (mobile) ── */}
          <div
            aria-hidden="true"
            className="hidden self-stretch border-l border-border/40 lg:block"
          />
          <hr aria-hidden="true" className="border-t border-border/40 lg:hidden" />

          {/* ── Quickstart ──────────────────────────────────── */}
          <div className="pt-12 lg:pl-12 lg:pt-0">
            <SectionHeading
              eyebrow="Quickstart"
              title="Installed? Two commands to explore."
              align="left"
            />
            <ul className="space-y-6">
              {QUICKSTART_STEPS.map((step) => (
                <li key={step.command} className="space-y-2">
                  <p className="text-sm text-muted">{step.caption}</p>
                  <CopyBlock command={step.command} />
                </li>
              ))}
            </ul>
            <a
              href="https://github.com/deepakkumardewani/weavr"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
            >
              More info on GitHub
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
