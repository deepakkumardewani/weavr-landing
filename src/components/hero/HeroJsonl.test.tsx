import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { HeroJsonl } from "./HeroJsonl";

beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("frames the promise with headline + subline over a JSONL texture, no CTA", () => {
  const { container } = render(<HeroJsonl />);
  // The framing copy is the focal layer and the page's single h1.
  expect(
    screen.getByRole("heading", { level: 1, name: /make your claude code transcripts readable/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/100% local, no ai/i)).toBeInTheDocument();
  // Wall lives in FunnelStream (App.tsx wrapper) — hero owns only copy + vignette.
  expect(container.querySelector("pre")).toBeNull();
  // Hard constraint: no buttons / CTAs in the hero.
  expect(container.querySelectorAll("button").length).toBe(0);
  expect(container.querySelectorAll("a").length).toBe(0);
});
