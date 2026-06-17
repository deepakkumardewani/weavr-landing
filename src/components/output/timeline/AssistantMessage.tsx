import { TimelineRow } from "./TimelineRow";

/** An assistant text turn, with an optional token-usage badge. */
export function AssistantMessage({
  text,
  tokens,
}: {
  text: string;
  tokens?: { in: number; out: number };
}) {
  return (
    <TimelineRow kind="assistant" label="Claude">
      <p className="text-[15px] leading-relaxed text-fg">{text}</p>
      {tokens && (
        <div className="mt-2 inline-flex gap-3 rounded-md bg-surface px-2.5 py-1 font-mono text-[11px] text-muted">
          <span>↑ {tokens.in.toLocaleString()} in</span>
          <span>↓ {tokens.out.toLocaleString()} out</span>
        </div>
      )}
    </TimelineRow>
  );
}
