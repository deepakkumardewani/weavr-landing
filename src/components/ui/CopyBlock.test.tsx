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

test("copies the command and shows transient feedback", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  const user = userEvent.setup();
  stubClipboard(writeText);

  render(<CopyBlock command="cargo install weavr" />);
  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("Copy");

  await user.click(button);

  expect(writeText).toHaveBeenCalledWith("cargo install weavr");
  await waitFor(() => expect(button).toHaveTextContent("Copied"));
});

test("surfaces a clipboard failure without crashing", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const user = userEvent.setup();
  stubClipboard(() => Promise.reject(new Error("denied")));

  render(<CopyBlock command="brew install weavr" />);
  await user.click(screen.getByRole("button"));

  await waitFor(() => expect(error).toHaveBeenCalled());
  expect(screen.getByRole("button")).toHaveTextContent("Copy");
  error.mockRestore();
});
