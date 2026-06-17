import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { SpeedStats } from "./SpeedStats";

beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("renders the final stat values and race contenders", () => {
  render(<SpeedStats />);
  expect(screen.getByText("~1.3s")).toBeInTheDocument();
  expect(screen.getByText("~28ms")).toBeInTheDocument();
  expect(screen.getByText("46.5×")).toBeInTheDocument();
  expect(screen.getByText("weavr")).toBeInTheDocument();
  expect(screen.getByText("claude-code-log")).toBeInTheDocument();
});
