import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { ProcessPipeline } from "./ProcessPipeline";

beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("renders the three beats and the local/no-AI reinforcement", () => {
  render(<ProcessPipeline />);
  expect(screen.getByText("Raw JSONL")).toBeInTheDocument();
  expect(screen.getByText("weavr")).toBeInTheDocument();
  expect(screen.getByText("Beautiful HTML")).toBeInTheDocument();
  expect(screen.getByText("100% local")).toBeInTheDocument();
  expect(screen.getByText("No AI")).toBeInTheDocument();
});
