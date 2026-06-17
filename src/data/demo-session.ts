/**
 * One coherent Claude Code bug-fix session, authored to read as a genuine
 * transcript. This single source powers both the raw-JSONL hero (serialized
 * form, see demo-jsonl.ts) and the rendered output panel (parsed form), so the
 * before/after story stays consistent by construction.
 *
 * The session: a user reports that exported dates land one day early for
 * anyone in a negative UTC offset; Claude Code traces it to a UTC-vs-local
 * mismatch in a date formatter and fixes it.
 */

export interface DiffLine {
  kind: "add" | "remove" | "context";
  text: string;
}

export interface DiffHunk {
  /** e.g. "@@ -42,7 +42,8 @@" */
  header: string;
  lines: DiffLine[];
}

export type ToolName = "Bash" | "Read" | "Edit" | "Write" | "Grep";

export type DemoEvent =
  | { kind: "user"; text: string; ts?: string }
  | { kind: "assistant"; text: string; tokens?: { in: number; out: number } }
  | { kind: "thinking"; text: string }
  | {
      kind: "tool";
      name: ToolName;
      input: string;
      output?: string;
      diff?: DiffHunk[];
    };

export const demoSession: DemoEvent[] = [
  {
    kind: "user",
    text: "Dates in the exported report are off by one day, but only for some teammates. Mine look fine. Can you figure out why?",
    ts: "2025-06-14T09:41:02-05:00",
  },
  {
    kind: "assistant",
    text: "An off-by-one that only hits *some* people almost always means a timezone boundary. Let me find where the report formats dates.",
    tokens: { in: 318, out: 41 },
  },
  {
    kind: "tool",
    name: "Grep",
    input: 'rg -n "toISOString|formatDate" src/report',
    output:
      "src/report/format.ts:14:  return formatDate(row.completedAt);\nsrc/report/format.ts:31:export function formatDate(d: Date): string {\nsrc/report/format.ts:33:    .toISOString()",
  },
  {
    kind: "tool",
    name: "Read",
    input: "src/report/format.ts (lines 31-38)",
    output:
      'export function formatDate(d: Date): string {\n  // "2025-06-14"\n  return d\n    .toISOString()\n    .slice(0, 10);\n}',
  },
  {
    kind: "thinking",
    text: "`toISOString()` always serializes in UTC. For a user at UTC-05:00, a Date that is local midnight June 14 is actually 05:00 June 14 UTC — fine. But a timestamp near the end of the day, say 21:00 June 14 local, is 02:00 June 15 UTC… wait, that pushes it forward. The off-by-one *backward* means their stored timestamps are at local midnight, which in a negative offset is the *previous* day in UTC. That's it: midnight-local dates roll back a day under UTC. I should format in the user's local date, not UTC.",
  },
  {
    kind: "assistant",
    text: "Found it. `formatDate` calls `toISOString()`, which is always UTC. For teammates west of UTC, a midnight-local timestamp falls on the previous calendar day in UTC — so the date renders one day early. People at or east of UTC never see it. The fix is to format the local calendar date instead of slicing the UTC string.",
    tokens: { in: 612, out: 88 },
  },
  {
    kind: "tool",
    name: "Edit",
    input: "src/report/format.ts",
    diff: [
      {
        header: "@@ -31,7 +31,9 @@ export function formatDate",
        lines: [
          { kind: "context", text: "export function formatDate(d: Date): string {" },
          { kind: "context", text: '  // "2025-06-14"' },
          { kind: "remove", text: "  return d" },
          { kind: "remove", text: "    .toISOString()" },
          { kind: "remove", text: "    .slice(0, 10);" },
          { kind: "add", text: "  const year = d.getFullYear();" },
          { kind: "add", text: '  const month = String(d.getMonth() + 1).padStart(2, "0");' },
          { kind: "add", text: '  const day = String(d.getDate()).padStart(2, "0");' },
          { kind: "add", text: "  return `${year}-${month}-${day}`;" },
          { kind: "context", text: "}" },
        ],
      },
    ],
  },
  {
    kind: "tool",
    name: "Bash",
    input: "npm test -- format.test.ts",
    output:
      "PASS  src/report/format.test.ts\n  formatDate\n    ✓ uses the local calendar date (4 ms)\n    ✓ is stable across negative UTC offsets (1 ms)\n\nTests: 2 passed, 2 total\nTime:  0.62 s",
  },
  {
    kind: "assistant",
    text: "Fixed. `formatDate` now builds the string from the local year/month/day, so the calendar date matches what each teammate sees on their own clock. I added a regression test that pins the behaviour at UTC-05:00; both tests pass.",
    tokens: { in: 740, out: 96 },
  },
  {
    kind: "user",
    text: "Perfect — that lines up with what they reported. Thanks!",
    ts: "2025-06-14T09:48:55-05:00",
  },
];
