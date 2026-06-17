import type { DemoEvent } from "../../../data/demo-session";

const DOT_COLOR: Record<DemoEvent["kind"], string> = {
  user: "bg-dot-user",
  assistant: "bg-dot-assistant",
  thinking: "bg-dot-thinking",
  tool: "bg-dot-tool",
};

/** The flat-timeline node: a small colored dot sitting on the vertical rail. */
export function Dot({ kind }: { kind: DemoEvent["kind"] }) {
  return (
    <span
      className={`mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-bg ${DOT_COLOR[kind]}`}
      aria-hidden="true"
    />
  );
}
