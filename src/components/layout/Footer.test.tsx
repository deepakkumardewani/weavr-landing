import { expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";
import { LINKS } from "../../lib/links";

test("renders the local/no-AI line and all project links", () => {
  render(<Footer />);
  expect(screen.getByText(/100% local/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", LINKS.github);
  expect(screen.getByRole("link", { name: "crates.io" })).toHaveAttribute("href", LINKS.crates);
  expect(screen.getByRole("link", { name: "License (MIT)" })).toHaveAttribute(
    "href",
    LINKS.license,
  );
});
