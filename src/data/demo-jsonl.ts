/**
 * Serialize a DemoEvent[] into raw JSONL that looks like a real Claude Code
 * transcript under ~/.claude/projects. The hero renders this verbatim
 * as the "unreadable" wall, so the shape mirrors genuine transcript records:
 * one JSON object per line, nested message/content blocks, tool_use + tool_result.
 */
import type { DemoEvent } from "./demo-session";

const SESSION_ID = "b7f3c9a1-4e2d-48a6-9c1f-2a5e8d0b6f74";
const BASE_TS = Date.parse("2025-06-14T14:41:02.000Z");

/** Deterministic pseudo-uuid so output is stable across renders. */
function recordId(index: number): string {
  const seed = (index + 1) * 0x9e3779b1;
  const hex = (seed >>> 0).toString(16).padStart(8, "0");
  return `${hex}-msg${String(index).padStart(2, "0")}`;
}

function timestamp(index: number): string {
  return new Date(BASE_TS + index * 7_000).toISOString();
}

interface ContentBlock {
  type: string;
  [key: string]: unknown;
}

function eventToRecord(event: DemoEvent, index: number): object {
  const base = {
    uuid: recordId(index),
    sessionId: SESSION_ID,
    timestamp: timestamp(index),
  };

  switch (event.kind) {
    case "user":
      return {
        ...base,
        type: "user",
        message: { role: "user", content: event.text },
      };
    case "assistant": {
      const content: ContentBlock[] = [{ type: "text", text: event.text }];
      return {
        ...base,
        type: "assistant",
        message: {
          role: "assistant",
          model: "claude-opus-4-8",
          content,
          usage: event.tokens
            ? { input_tokens: event.tokens.in, output_tokens: event.tokens.out }
            : undefined,
        },
      };
    }
    case "thinking":
      return {
        ...base,
        type: "assistant",
        message: {
          role: "assistant",
          content: [{ type: "thinking", thinking: event.text }],
        },
      };
    case "tool": {
      const toolUseId = `toolu_${recordId(index)}`;
      const diffText = event.diff
        ?.flatMap((h) => [
          h.header,
          ...h.lines.map((l) =>
            l.kind === "add" ? `+${l.text}` : l.kind === "remove" ? `-${l.text}` : ` ${l.text}`,
          ),
        ])
        .join("\n");
      return {
        ...base,
        type: "assistant",
        message: {
          role: "assistant",
          content: [
            {
              type: "tool_use",
              id: toolUseId,
              name: event.name,
              input: { command: event.input },
            },
            {
              type: "tool_result",
              tool_use_id: toolUseId,
              content: event.output ?? diffText ?? "",
            },
          ],
        },
      };
    }
  }
}

/** Serialize the full session to a raw JSONL string (one record per line). */
export function toJsonl(events: DemoEvent[]): string {
  return events.map((event, index) => JSON.stringify(eventToRecord(event, index))).join("\n");
}
