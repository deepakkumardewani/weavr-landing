import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { HeroJsonl } from "./HeroJsonl";

beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("renders an unreadable JSONL wall and no buttons (hero has no CTA)", () => {
  const { container } = render(<HeroJsonl />);
  expect(screen.getByLabelText("Unreadable Claude Code transcript")).toBeInTheDocument();
  // The wall is genuine transcript JSONL.
  expect(container.textContent).toContain('"role"');
  // Hard constraint: no buttons / CTAs in the hero.
  expect(container.querySelectorAll("button").length).toBe(0);
  expect(container.querySelectorAll("a").length).toBe(0);
});
