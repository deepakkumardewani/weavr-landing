import { expect, test, vi } from "vite-plus/test";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyBlock } from "./CopyBlock";

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

test("copies the command and shows Copied aria-label feedback", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  const user = userEvent.setup();
  stubClipboard(writeText);

  render(<CopyBlock command="cargo install weavr" />);
  const button = screen.getByRole("button");
  // Before copy: aria-label signals "Copy command"
  expect(button).toHaveAttribute("aria-label", "Copy command: cargo install weavr");

  await user.click(button);

  expect(writeText).toHaveBeenCalledWith("cargo install weavr");
  // After copy: aria-label switches to "Copied"
  await waitFor(() => expect(button).toHaveAttribute("aria-label", "Copied: cargo install weavr"));
});

test("surfaces a clipboard failure without crashing", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const user = userEvent.setup();
  stubClipboard(() => Promise.reject(new Error("denied")));

  render(<CopyBlock command="brew install weavr" />);
  await user.click(screen.getByRole("button"));

  await waitFor(() => expect(error).toHaveBeenCalled());
  // Still shows copy state (not stuck in copied)
  expect(screen.getByRole("button")).toHaveAttribute(
    "aria-label",
    "Copy command: brew install weavr",
  );
  error.mockRestore();
});
