import { expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InstallSection } from "./InstallSection";
test("renders macOS tab by default with brew command", () => {
  render(<InstallSection />);
  expect(screen.getByRole("tab", { name: "macOS" })).toHaveAttribute("aria-selected", "true");
  expect(
    screen.getAllByRole("button", { name: /brew install deepakkumardewani\/weavr\/weavr/i }).length,
  ).toBeGreaterThan(0);
  expect(screen.queryByRole("link", { name: /view on github/i })).not.toBeInTheDocument();
});

test("switching to Linux tab removes brew command", async () => {
  const user = userEvent.setup();
  render(<InstallSection />);

  await user.click(screen.getByRole("tab", { name: "Linux" }));
  expect(screen.getByRole("tab", { name: "Linux" })).toHaveAttribute("aria-selected", "true");

  // brew command no longer present (quickstart no longer has install step)
  expect(
    screen.queryAllByRole("button", { name: /brew install deepakkumardewani\/weavr\/weavr/i }),
  ).toHaveLength(0);

  // cargo commands still present
  expect(screen.getAllByRole("button", { name: /cargo binstall weavr/i }).length).toBeGreaterThan(
    0,
  );
});

test("quickstart shows two usage steps — no install step", () => {
  render(<InstallSection />);
  // Usage commands present
  expect(
    screen.getByRole("button", { name: /weavr -i ~\/.claude\/projects\/my-app\/session\.jsonl/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /weavr --all-projects --open-browser/i }),
  ).toBeInTheDocument();
  // Install command not duplicated in quickstart (only in install column under macOS)
  const installButtons = screen.getAllByRole("button", {
    name: /brew install deepakkumardewani\/weavr\/weavr/i,
  });
  // Exactly one — from the install column; not a second from quickstart
  expect(installButtons).toHaveLength(1);
});
