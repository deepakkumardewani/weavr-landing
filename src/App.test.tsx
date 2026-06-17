import { afterEach, beforeEach, expect, test } from "vite-plus/test";
import { render, screen } from "@testing-library/react";
import App from "./App.tsx";

// Render via the reduced-motion path so the GSAP/ScrollTrigger setup (a browser
// concern) is skipped in jsdom.
beforeEach(() => {
  globalThis.__reducedMotion = true;
});
afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("App mounts and renders the weavr output panel", () => {
  render(<App />);
  expect(screen.getByLabelText("weavr output")).toBeInTheDocument();
});
