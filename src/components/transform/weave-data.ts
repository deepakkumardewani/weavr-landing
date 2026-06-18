import type { DemoEvent } from "../../data/demo-session";

/** A condensed conversation row the morph reflows the raw JSONL into. */
export interface WeaveBubble {
  id: number;
  kind: DemoEvent["kind"];
  /** Speaker/tool label shown beside the dot. */
  label: string;
  /** One-line, whitespace-collapsed snippet of the event. */
  text: string;
  /** Tailwind dot color class echoing weavr's timeline hues. */
  dotClass: string;
}

/** How many of the early events the woven preview surfaces. */
const PREVIEW_COUNT = 5;
/** Max characters per bubble snippet before truncation. */
const MAX_TEXT = 92;

const DOT_CLASS: Record<DemoEvent["kind"], string> = {
  user: "bg-dot-user",
  assistant: "bg-dot-assistant",
  thinking: "bg-dot-thinking",
  tool: "bg-dot-tool",
};

const SPEAKER_LABEL: Record<DemoEvent["kind"], string> = {
  user: "You",
  assistant: "Claude",
  thinking: "Thinking",
  tool: "Tool",
};

function truncate(text: string): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  return collapsed.length > MAX_TEXT ? `${collapsed.slice(0, MAX_TEXT - 1)}…` : collapsed;
}

function snippet(event: DemoEvent): string {
  switch (event.kind) {
    case "user":
    case "assistant":
    case "thinking":
      return truncate(event.text);
    case "tool":
      return truncate(`${event.input}`);
  }
}

/**
 * Derive the woven preview from the *same* demo session that feeds the hero
 * JSONL and the output panel, so the morph resolves the exact mess from the
 * hero by construction (continuity), not with an unrelated mockup.
 */
export function toWeaveBubbles(events: DemoEvent[], count = PREVIEW_COUNT): WeaveBubble[] {
  return events.slice(0, count).map((event, id) => ({
    id,
    kind: event.kind,
    label: event.kind === "tool" ? event.name : SPEAKER_LABEL[event.kind],
    text: snippet(event),
    dotClass: DOT_CLASS[event.kind],
  }));
}
