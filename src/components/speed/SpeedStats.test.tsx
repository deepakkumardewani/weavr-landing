import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SpeedStats } from "./SpeedStats";

beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("renders the real stat values and race contenders", () => {
  render(<SpeedStats />);
  expect(screen.getByText("~412ms")).toBeInTheDocument();
  expect(screen.getByText("~6ms")).toBeInTheDocument();
  expect(screen.getByText("58.2×")).toBeInTheDocument();
  // Both race groups render weavr and claude-code-log rows
  expect(screen.getAllByText("weavr").length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText("claude-code-log").length).toBeGreaterThanOrEqual(2);
  // Group labels
  expect(screen.getByText(/all projects/i)).toBeInTheDocument();
  expect(screen.getByText("Single session")).toBeInTheDocument();
});

test("benchmark details panel is collapsed by default and toggles open", async () => {
  const user = userEvent.setup();
  render(<SpeedStats />);

  const toggle = screen.getByRole("button", { name: /benchmark details/i });
  expect(toggle).toHaveAttribute("aria-expanded", "false");

  // Details panel is hidden initially
  const panel = document.getElementById("benchmark-details");
  expect(panel).toHaveAttribute("hidden");

  // Click to expand
  await user.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(panel).not.toHaveAttribute("hidden");

  // Metadata values render
  expect(screen.getByText("15")).toBeInTheDocument(); // projects
  expect(screen.getByText("157")).toBeInTheDocument(); // sessions
  expect(screen.getByText("26,948")).toBeInTheDocument(); // messages
  expect(screen.getByText("16.3M")).toBeInTheDocument(); // tokens in
  expect(screen.getByText("1.8B")).toBeInTheDocument(); // cache read
  expect(screen.getByText("40.7M")).toBeInTheDocument(); // cache write
});
