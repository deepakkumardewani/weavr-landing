import { TimelineRow } from "./TimelineRow";

/** A user turn — quietly emphasised with the accent rail tint. */
export function UserMessage({ text }: { text: string }) {
  return (
    <TimelineRow kind="user" label="User">
      <p className="rounded-lg border-l-2 border-accent bg-surface/60 px-4 py-3 text-[15px] leading-relaxed text-fg">
        {text}
      </p>
    </TimelineRow>
  );
}
