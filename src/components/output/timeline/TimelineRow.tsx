import type { ReactNode } from "react";
import type { DemoEvent } from "../../../data/demo-session";
import { Dot } from "./Dot";

/**
 * Shared layout for every timeline entry: the dot on the rail (left) plus a
 * labelled content column (right). Keeps spacing/rail rhythm in one place.
 */
export function TimelineRow({
  kind,
  label,
  children,
}: {
  kind: DemoEvent["kind"];
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex gap-4 pb-7">
      <Dot kind={kind} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {label}
        </div>
        {children}
      </div>
    </div>
  );
}
