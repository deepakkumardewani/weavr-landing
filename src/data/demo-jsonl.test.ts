import { expect, test } from "vite-plus/test";
import { demoSession } from "./demo-session";
import { toJsonl } from "./demo-jsonl";

test("serializes one valid JSON object per line", () => {
  const lines = toJsonl(demoSession).split("\n");
  expect(lines).toHaveLength(demoSession.length);
  for (const line of lines) {
    expect(() => JSON.parse(line)).not.toThrow();
  }
});

test("records carry transcript-shaped fields", () => {
  const first = JSON.parse(toJsonl(demoSession).split("\n")[0]);
  expect(first).toMatchObject({
    type: "user",
    sessionId: expect.any(String),
    message: { role: "user" },
  });
});

test("tool events serialize tool_use and tool_result blocks", () => {
  const records = toJsonl(demoSession)
    .split("\n")
    .map((l) => JSON.parse(l));
  const toolRecord = records.find((r) =>
    r.message?.content?.some?.((c: { type: string }) => c.type === "tool_use"),
  );
  expect(toolRecord).toBeDefined();
  const types = toolRecord.message.content.map((c: { type: string }) => c.type);
  expect(types).toContain("tool_use");
  expect(types).toContain("tool_result");
});

test("output is deterministic", () => {
  expect(toJsonl(demoSession)).toBe(toJsonl(demoSession));
});
