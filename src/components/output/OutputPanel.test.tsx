import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { OutputPanel } from "./OutputPanel";
import { demoSession } from "../../data/demo-session";

// GSAP ScrollTrigger pinning is a browser concern (verified live); these smoke
// tests cover the rendered DOM via the reduced-motion path, which produces the
// same fully-rendered transcript without touching the layout engine.
beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("mounts and renders the window chrome and transcript", () => {
  render(<OutputPanel events={demoSession} />);
  expect(screen.getByText("format-dates-session.html")).toBeInTheDocument();
  expect(screen.getByLabelText("weavr output")).toBeInTheDocument();
  expect(screen.getAllByText("Claude").length).toBeGreaterThan(0);
});

test("reduced-motion panel renders the full transcript (no pin)", () => {
  const { container } = render(<OutputPanel events={demoSession} />);
  const rows = container.querySelectorAll("[data-reveal-index]");
  expect(rows.length).toBe(demoSession.length);
});
