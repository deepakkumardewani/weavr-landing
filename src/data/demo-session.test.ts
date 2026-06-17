import { expect, test } from "vite-plus/test";
import { demoSession } from "./demo-session";

test("demo session is non-empty and well-formed", () => {
  expect(demoSession.length).toBeGreaterThan(5);
  for (const event of demoSession) {
    expect(event.kind).toMatch(/^(user|assistant|thinking|tool)$/);
  }
});

test("demo session exercises every event kind", () => {
  const kinds = new Set(demoSession.map((e) => e.kind));
  expect(kinds).toEqual(new Set(["user", "assistant", "thinking", "tool"]));
});

test("the edit tool carries a well-formed diff", () => {
  const edit = demoSession.find((e) => e.kind === "tool" && e.name === "Edit");
  expect(edit).toBeDefined();
  if (edit?.kind !== "tool" || !edit.diff) throw new Error("expected a diff");
  const lines = edit.diff.flatMap((h) => h.lines);
  expect(lines.some((l) => l.kind === "add")).toBe(true);
  expect(lines.some((l) => l.kind === "remove")).toBe(true);
});
