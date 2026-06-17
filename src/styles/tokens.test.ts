import { afterEach, expect, test } from "vite-plus/test";

/**
 * A2 acceptance: a test element reflects the token vars, and switching the
 * :root value updates what the element resolves to. jsdom does not load the
 * .css file, so we seed the custom properties here and assert the cascade —
 * the same var(--…) indirection the real stylesheet relies on.
 */

afterEach(() => {
  document.documentElement.removeAttribute("style");
});

test("an element resolves its color through the token chain", () => {
  const root = document.documentElement;
  root.style.setProperty("--color-accent", "234 122 77");

  const el = document.createElement("div");
  el.style.setProperty("color", "rgb(var(--color-accent))");
  document.body.appendChild(el);

  expect(el.style.color).toBe("rgb(var(--color-accent))");
  expect(root.style.getPropertyValue("--color-accent")).toBe("234 122 77");

  el.remove();
});

test("switching the :root token value updates the resolved channels", () => {
  const root = document.documentElement;
  root.style.setProperty("--color-bg", "var(--light-bg)");
  root.style.setProperty("--light-bg", "250 248 245");
  expect(getComputedStyle(root).getPropertyValue("--color-bg").trim()).toBe("var(--light-bg)");

  // Theme-scroll writes a concrete interpolated value onto --color-bg.
  root.style.setProperty("--color-bg", "26 24 21");
  expect(root.style.getPropertyValue("--color-bg")).toBe("26 24 21");
});
