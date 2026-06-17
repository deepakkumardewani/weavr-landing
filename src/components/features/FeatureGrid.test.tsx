import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { FeatureGrid } from "./FeatureGrid";

beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("renders all eight feature cards", () => {
  render(<FeatureGrid />);
  expect(screen.getAllByRole("listitem")).toHaveLength(8);
  expect(screen.getByText("Self-contained HTML")).toBeInTheDocument();
  expect(screen.getByText("100% local")).toBeInTheDocument();
});
