import { afterEach, expect, test } from "vite-plus/test";
import { initScrollBridge } from "./lenis";

afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("reduced motion skips Lenis and returns a destroyable bridge", () => {
  globalThis.__reducedMotion = true;
  const bridge = initScrollBridge();
  expect(bridge.lenis).toBeNull();
  expect(() => bridge.destroy()).not.toThrow();
});

test("motion-allowed bridge creates a Lenis instance and cleans up", () => {
  globalThis.__reducedMotion = false;
  const bridge = initScrollBridge();
  expect(bridge.lenis).not.toBeNull();
  expect(() => bridge.destroy()).not.toThrow();
});
