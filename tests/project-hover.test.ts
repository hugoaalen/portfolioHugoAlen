import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/portfolio.css", import.meta.url), "utf8");
const hover = readFileSync(new URL("../src/lib/portfolio-hover.ts", import.meta.url), "utf8");

test("project descriptions expand for hover or visible keyboard focus, not hash targets", () => {
  const rule = css.split("\n").find((line) => line.includes(".project-card:is(") && line.includes(".project-description"));
  assert.ok(rule);
  assert.ok(rule.includes(":hover"));
  assert.ok(rule.includes(":focus-visible"));
  assert.ok(!rule.includes(":target"));
  assert.ok(!rule.includes(":focus-within"));
});

test("pointer input clears persistent keyboard hover state", () => {
  assert.ok(hover.includes('element.matches(":focus-visible")'));
  assert.ok(hover.includes('root.addEventListener("pointerdown", pointerDown)'));
  assert.ok(hover.includes('root.removeEventListener("pointerdown", pointerDown)'));
});
