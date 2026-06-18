import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

test("toggle flips the panel between rendered and raw JSONL", async () => {
  const user = userEvent.setup();
  const { container } = render(<OutputPanel events={demoSession} />);

  const rendered = screen.getByRole("button", { name: "Rendered" });
  const rawBtn = screen.getByRole("button", { name: "Raw" });
  expect(rendered).toHaveAttribute("aria-pressed", "true");
  expect(container.querySelector("[data-raw-jsonl]")).toBeNull();

  await user.click(rawBtn);
  expect(rawBtn).toHaveAttribute("aria-pressed", "true");
  const pre = container.querySelector("[data-raw-jsonl]");
  expect(pre).not.toBeNull();
  expect(pre?.textContent).toContain('"role"');

  await user.click(rendered);
  expect(rendered).toHaveAttribute("aria-pressed", "true");
  expect(container.querySelector("[data-raw-jsonl]")).toBeNull();
});
