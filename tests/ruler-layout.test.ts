import test from "node:test";
import assert from "node:assert/strict";
import { layoutRulerLabels, rulerLetterRotation } from "../src/lib/ruler-layout.ts";

test("letters form a progressive curve and align at both ends", () => {
  const turns = Array.from({ length: 8 }, (_, i) => rulerLetterRotation(-45, i, 8));
  assert.ok(new Set(turns).size > 4);
  for (let i = 0; i < 8; i++) {
    assert.equal(rulerLetterRotation(0, i, 8), 0);
    assert.equal(rulerLetterRotation(-90, i, 8), -90);
    assert.ok(turns[i] >= -90 && turns[i] <= 0);
  }
});

test("passed sections remain small and horizontal above the active label", () => {
  const result = layoutRulerLabels([-3000, -2000, -10, 600, 3000], 2, 88, 800);
  assert.deepEqual(result.map(item => item.passed), [true, true, false, false, false]);
  assert.ok(result[0].y < result[1].y);
  assert.ok(result[1].y < result[2].y);
  assert.equal(result[0].rotation, 0);
  assert.equal(result[0].scale, 0.55);
  assert.equal(result[2].rotation, 0);
  assert.equal(result[2].scale, 1);
});
test("upcoming labels turn vertical inside the rail, not while queued below it", () => {
  const result = layoutRulerLabels([-10, 450, 2000], 0, 88, 800);
  assert.equal(result[1].rotation, -90);
  assert.equal(result[2].rotation, 0);
});
test("upcoming labels stack within the viewport without overlap", () => {
  const result = layoutRulerLabels([0, 1500, 3000, 5000, 7000], 0, 88, 800);
  for (let i = 1; i < result.length; i++) assert.ok(result[i].y - result[i - 1].y >= 36);
  assert.ok(result.at(-1)!.y <= 764);
});
test("scrolling back restores earlier labels", () => {
  assert.equal(layoutRulerLabels([0, 800, 2000], 2, 88, 800)[0].passed, true);
  assert.equal(layoutRulerLabels([0, 800, 2000], 0, 88, 800)[0].passed, false);
});
