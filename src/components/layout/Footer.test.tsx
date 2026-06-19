import { expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { LINKS } from "../../lib/links";

test("renders three trust chips", () => {
  render(<Footer />);
  expect(screen.getByText("100% local")).toBeInTheDocument();
  expect(screen.getByText("no AI")).toBeInTheDocument();
  expect(screen.getByText("a single Rust binary")).toBeInTheDocument();
});

test("renders claude-code-log credit link and no nav links", () => {
  render(<Footer />);
  const credit = screen.getByRole("link", { name: "claude-code-log" });
  expect(credit).toHaveAttribute("href", LINKS.claudeCodeLog);

  // Nav links (GitHub, crates.io, License) must not be present in Footer
  expect(screen.queryByRole("link", { name: "GitHub" })).toBeNull();
  expect(screen.queryByRole("link", { name: "crates.io" })).toBeNull();
  expect(screen.queryByRole("link", { name: /license/i })).toBeNull();
});
