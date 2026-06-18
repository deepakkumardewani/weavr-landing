import { expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { InstallSection } from "./InstallSection";
import { LINKS } from "../../lib/links";

test("renders install CTA with GitHub link and relocated trust pills", () => {
  render(<InstallSection />);
  // Primary install command is copyable (appears in install + quickstart).
  expect(
    screen.getAllByRole("button", { name: /brew install deepakkumardewani\/weavr\/weavr/i }).length,
  ).toBeGreaterThan(0);
  // "View on GitHub" points at the repo.
  const github = screen.getByRole("link", { name: /view on github/i });
  expect(github).toHaveAttribute("href", LINKS.github);
  // Trust pills now live at this convergence point.
  expect(screen.getByText("100% local")).toBeInTheDocument();
  expect(screen.getByText("No AI")).toBeInTheDocument();
  expect(screen.getByText("Single binary")).toBeInTheDocument();
});
