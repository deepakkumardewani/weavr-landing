import { CopyBlock } from "../ui/CopyBlock";
import { SectionHeading } from "../ui/SectionHeading";

const INSTALL_COMMANDS = [
  "brew install deepakkumardewani/weavr/weavr",
  "cargo binstall weavr",
  "cargo install weavr",
] as const;

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
 * S6 install + quickstart. Every command is a {@link CopyBlock}, so they copy
 * with feedback and are keyboard-reachable. The quickstart numbers the path from
 * install to a rendered transcript.
 */
export function InstallSection() {
  return (
    <section
      id="install"
      aria-label="Install weavr"
      className="theme-dark bg-bg px-6 py-24 text-fg"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Install" title="One command. No dependencies." align="left" />
          <div className="space-y-3">
            {INSTALL_COMMANDS.map((command) => (
              <CopyBlock key={command} command={command} />
            ))}
          </div>
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
    </section>
  );
}
