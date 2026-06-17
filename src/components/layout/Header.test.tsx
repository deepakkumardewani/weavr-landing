import { expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { LINKS } from "../../lib/links";

test("renders the wordmark and a working GitHub link", () => {
  render(<Header />);
  expect(screen.getByText("weavr")).toBeInTheDocument();
  const gh = screen.getByLabelText("weavr on GitHub");
  expect(gh).toHaveAttribute("href", LINKS.github);
});
