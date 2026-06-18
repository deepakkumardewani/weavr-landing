import { expect, test } from "vite-plus/test";
import type { DemoEvent } from "../../data/demo-session";
import { toWeaveBubbles } from "./weave-data";

const longText = "x".repeat(200);

const events: DemoEvent[] = [
  { kind: "user", text: "Why are the dates off by one?" },
  { kind: "assistant", text: "Probably a timezone boundary." },
  { kind: "thinking", text: "toISOString is always UTC..." },
  { kind: "tool", name: "Grep", input: 'rg -n "formatDate" src' },
  { kind: "assistant", text: longText },
  { kind: "user", text: "Thanks!" },
];

test("maps each event kind to its dot, label, and snippet", () => {
  const bubbles = toWeaveBubbles(events, 4);
  expect(bubbles).toHaveLength(4);
  expect(bubbles[0]).toMatchObject({ kind: "user", label: "You", dotClass: "bg-dot-user" });
  expect(bubbles[1]).toMatchObject({ kind: "assistant", label: "Claude" });
  expect(bubbles[2]).toMatchObject({ kind: "thinking", label: "Thinking" });
  // Tool rows use the tool name as the label and the command as the snippet.
  expect(bubbles[3]).toMatchObject({ kind: "tool", label: "Grep", dotClass: "bg-dot-tool" });
  expect(bubbles[3].text).toContain("formatDate");
});

test("truncates long snippets and collapses whitespace", () => {
  const bubbles = toWeaveBubbles([{ kind: "assistant", text: longText }]);
  expect(bubbles[0].text.endsWith("…")).toBe(true);
  expect(bubbles[0].text.length).toBeLessThan(longText.length);
});

test("defaults to the first five events", () => {
  expect(toWeaveBubbles(events)).toHaveLength(5);
});
