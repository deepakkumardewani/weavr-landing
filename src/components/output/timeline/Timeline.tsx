import type { DemoEvent } from "../../../data/demo-session";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { ThinkingBlock } from "./ThinkingBlock";
import { ToolCard } from "./ToolCard";

function renderEvent(event: DemoEvent, index: number) {
  switch (event.kind) {
    case "user":
      return <UserMessage key={index} text={event.text} />;
    case "assistant":
      return <AssistantMessage key={index} text={event.text} tokens={event.tokens} />;
    case "thinking":
      return <ThinkingBlock key={index} text={event.text} />;
    case "tool":
      return (
        <ToolCard
          key={index}
          name={event.name}
          input={event.input}
          output={event.output}
          diff={event.diff}
        />
      );
  }
}

/**
 * The flat dot-timeline: a vertical rail with one node per event. Each row may
 * carry a `data-reveal-index` so the pinned panel (B4) can scrub reveals.
 */
export function Timeline({ events }: { events: DemoEvent[] }) {
  return (
    <div className="relative">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-border" aria-hidden="true" />
      {events.map((event, index) => (
        <div key={index} data-reveal-index={index}>
          {renderEvent(event, index)}
        </div>
      ))}
    </div>
  );
}
