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
  /** Structural metadata surfaced in the DAG view (time, tokens, tool kind). */
  meta?: string;
}

/** How many of the early events the woven preview surfaces. */
const PREVIEW_COUNT = 5;
/** Max characters per bubble snippet before truncation. */
const MAX_TEXT = 92;
/** Max characters for a parsed field value before truncation. */
const MAX_FIELD = 38;

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

function truncate(text: string, max = MAX_TEXT): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  return collapsed.length > max ? `${collapsed.slice(0, max - 1)}…` : collapsed;
}

/** The raw text payload of an event, regardless of kind. */
function textOf(event: DemoEvent): string {
  return event.kind === "tool" ? event.input : event.text;
}

/** One key/value pair the "parse" stage lifts out of a raw JSONL record. */
export interface ParseField {
  key: string;
  value: string;
}

/**
 * The fields the "parse" beat extracts from the first raw record — a
 * representative (not literal) view of reading one JSONL line into typed
 * fields, so the viewer sees *what* parsing pulls out.
 */
export function toParseFields(events: DemoEvent[]): ParseField[] {
  const first = events[0];
  return [
    { key: "type", value: first.kind },
    { key: "role", value: first.kind === "tool" ? "tool" : first.kind },
    { key: "content", value: truncate(textOf(first), MAX_FIELD) },
  ];
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

/** Structural metadata the DAG node surfaces beside its label. */
function metaOf(event: DemoEvent): string | undefined {
  switch (event.kind) {
    case "user":
      // Local clock time from the ISO timestamp (e.g. "09:41").
      return event.ts?.slice(11, 16);
    case "assistant":
      return event.tokens ? `${event.tokens.in} → ${event.tokens.out} tok` : undefined;
    case "thinking":
      return "reasoning";
    case "tool":
      return "tool call";
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
    meta: metaOf(event),
  }));
}
