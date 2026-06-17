import { expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { Timeline } from "./Timeline";
import { demoSession } from "../../../data/demo-session";

test("renders the full demo session without errors", () => {
  render(<Timeline events={demoSession} />);
  // Labels from each renderer prove the dispatcher covers every kind.
  expect(screen.getAllByText("Claude").length).toBeGreaterThan(0);
  expect(screen.getByText("Thinking")).toBeInTheDocument();
  expect(screen.getAllByText("Tool").length).toBeGreaterThan(0);
  expect(screen.getAllByText("User").length).toBeGreaterThan(0);
});

test("renders a diff with add and remove lines", () => {
  const { container } = render(<Timeline events={demoSession} />);
  expect(container.querySelector(".bg-diff-add-bg")).not.toBeNull();
  expect(container.querySelector(".bg-diff-remove-bg")).not.toBeNull();
});
