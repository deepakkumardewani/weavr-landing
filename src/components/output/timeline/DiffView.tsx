import type { DiffHunk, DiffLine } from "../../../data/demo-session";

const LINE_STYLE: Record<DiffLine["kind"], string> = {
  add: "bg-diff-add-bg text-diff-add",
  remove: "bg-diff-remove-bg text-diff-remove",
  context: "text-muted",
};

const LINE_SIGN: Record<DiffLine["kind"], string> = {
  add: "+",
  remove: "-",
  context: " ",
};

/** Renders unified-diff hunks with warm-tinted add/remove rows. */
export function DiffView({ hunks }: { hunks: DiffHunk[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-bg font-mono text-[12.5px] leading-relaxed">
      {hunks.map((hunk, hi) => (
        <div key={hi}>
          <div className="bg-surface px-3 py-1 text-[11px] text-dot-tool">{hunk.header}</div>
          {hunk.lines.map((line, li) => (
            <div key={li} className={`flex whitespace-pre px-3 ${LINE_STYLE[line.kind]}`}>
              <span className="select-none pr-3 opacity-60">{LINE_SIGN[line.kind]}</span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
