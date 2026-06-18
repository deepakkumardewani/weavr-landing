import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { ScrollCue } from "./ScrollCue";

beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("renders a non-interactive scroll cue", () => {
  const { container } = render(<ScrollCue />);
  expect(screen.getByText(/see it weave/i)).toBeInTheDocument();
  // The cue is decorative: it must not introduce a CTA into the hero.
  expect(container.querySelectorAll("button, a").length).toBe(0);
});
