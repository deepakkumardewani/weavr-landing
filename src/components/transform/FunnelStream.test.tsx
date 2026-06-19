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
