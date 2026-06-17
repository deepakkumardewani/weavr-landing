import { afterEach, expect, test } from "vite-plus/test";
import { prefersReducedMotion, registerMotion } from "./motion";

afterEach(() => {
  globalThis.__reducedMotion = false;
});

test("prefersReducedMotion reflects the media query", () => {
  globalThis.__reducedMotion = false;
  expect(prefersReducedMotion()).toBe(false);
  globalThis.__reducedMotion = true;
  expect(prefersReducedMotion()).toBe(true);
});

test("registerMotion runs the animate path when motion is allowed", () => {
  globalThis.__reducedMotion = false;
  let animated = false;
  let staticRan = false;
  let cleaned = false;

  const cleanup = registerMotion({
    animate: () => {
      animated = true;
      return () => {
        cleaned = true;
      };
    },
    static: () => {
      staticRan = true;
    },
  });

  expect(animated).toBe(true);
  expect(staticRan).toBe(false);
  cleanup();
  expect(cleaned).toBe(true);
});

test("registerMotion runs the static path under reduced motion", () => {
  globalThis.__reducedMotion = true;
  let animated = false;
  let staticRan = false;

  const cleanup = registerMotion({
    animate: () => {
      animated = true;
    },
    static: () => {
      staticRan = true;
    },
  });

  expect(animated).toBe(false);
  expect(staticRan).toBe(true);
  // No-op cleanup is still safe to call.
  expect(() => cleanup()).not.toThrow();
});

test("registerMotion tolerates an animate handler with no cleanup", () => {
  globalThis.__reducedMotion = false;
  const cleanup = registerMotion({
    animate: () => {},
    static: () => {},
  });
  expect(() => cleanup()).not.toThrow();
});
