import { TimelineRow } from "./TimelineRow";

/** A thinking turn — dimmed and italicised to read as internal reasoning. */
export function ThinkingBlock({ text }: { text: string }) {
  return (
    <TimelineRow kind="thinking" label="Thinking">
      <p className="border-l border-dashed border-border pl-4 text-[14px] italic leading-relaxed text-muted">
        {text}
      </p>
    </TimelineRow>
  );
}
