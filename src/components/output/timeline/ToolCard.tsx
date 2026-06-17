import type { DiffHunk, ToolName } from "../../../data/demo-session";
import { TimelineRow } from "./TimelineRow";
import { DiffView } from "./DiffView";

/** A tool invocation: name header, the command/input, and output or a diff. */
export function ToolCard({
  name,
  input,
  output,
  diff,
}: {
  name: ToolName;
  input: string;
  output?: string;
  diff?: DiffHunk[];
}) {
  return (
    <TimelineRow kind="tool" label="Tool">
      <div className="overflow-hidden rounded-lg border border-border bg-surface/60">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="rounded bg-dot-tool/15 px-2 py-0.5 font-mono text-[11px] font-medium text-dot-tool">
            {name}
          </span>
          <code className="truncate font-mono text-[12.5px] text-fg">{input}</code>
        </div>
        {diff ? (
          <div className="p-2">
            <DiffView hunks={diff} />
          </div>
        ) : (
          output && (
            <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-muted">
              {output}
            </pre>
          )
        )}
      </div>
    </TimelineRow>
  );
}
