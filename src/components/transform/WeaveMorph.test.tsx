import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { WeaveMorph } from "./WeaveMorph";
import { demoSession } from "../../data/demo-session";

// Reduced motion renders the static before -> after diagram (F4), which is the
// deterministic, assertable path in jsdom.
beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("shows a static before -> after diagram with the mechanism words labeled", () => {
  render(<WeaveMorph events={demoSession} />);
  expect(screen.getByText("Raw JSONL")).toBeInTheDocument();
  expect(screen.getByText("Rendered")).toBeInTheDocument();
  // Mechanism captions surface the steps.
  expect(screen.getByText("parse")).toBeInTheDocument();
  expect(screen.getByText("session DAG")).toBeInTheDocument();
  expect(screen.getByText("render")).toBeInTheDocument();
});
