import { expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import App from "./App.tsx";

test("App mounts and renders the weavr wordmark", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /weavr/i })).toBeInTheDocument();
});
