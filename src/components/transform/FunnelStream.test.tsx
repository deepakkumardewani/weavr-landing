import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render } from "@testing-library/react";
import { FunnelStream } from "./FunnelStream";

beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("renders the JSONL wall as aria-hidden decoration", () => {
  const { container } = render(<FunnelStream />);
  const wall = container.querySelector("pre");
  expect(wall).not.toBeNull();
  expect(wall?.getAttribute("aria-hidden")).toBe("true");
  // Wall contains real JSONL content.
  expect(container.textContent).toContain('"role"');
});

test("under reduced motion, wall is confined to hero viewport (h-dvh + overflow-hidden)", () => {
  const { container } = render(<FunnelStream />);
  const wall = container.querySelector("pre");
  // Must have height limited to one viewport — no spanning the weave section.
  expect(wall?.className).toContain("h-dvh");
  expect(wall?.className).toContain("overflow-hidden");
  // Must not span full wrapper (absolute inset-0 spans both sections).
  expect(wall?.className).not.toContain("inset-0");
});
