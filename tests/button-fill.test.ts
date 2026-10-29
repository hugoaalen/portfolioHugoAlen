import test from "node:test";
import assert from "node:assert/strict";
import { buttonFillOrigin } from "../src/lib/button-fill.ts";

test("fill begins at the entry point and covers every corner", () => {
  for (const [x, y] of [[0, 20], [200, 20], [100, 0], [100, 40], [0, 0]]) {
    const origin = buttonFillOrigin(200, 40, x, y);
    assert.equal(origin.x, x);
    assert.equal(origin.y, y);
    for (const [cx, cy] of [[0, 0], [200, 0], [0, 40], [200, 40]]) {
      assert.ok(Math.hypot(cx - x, cy - y) < origin.radius);
    }
  }
});
test("keyboard origin is centered and out-of-bounds coordinates are clamped", () => {
  assert.deepEqual(buttonFillOrigin(200, 40), { x: 100, y: 20, radius: 104 });
  const origin = buttonFillOrigin(200, 40, -10, 50);
  assert.equal(origin.x, 0);
  assert.equal(origin.y, 40);
});
