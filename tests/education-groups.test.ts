import test from "node:test";
import assert from "node:assert/strict";
import { groupEducation } from "../src/lib/education-groups.ts";

test("prepress sits after DAW even when CMS still has its old course order", () => {
  const items = [{ id: "google", order: 110 }, { id: "cm-preimpresion-digital", order: 120 }, { id: "cs-daw", order: 30 }];
  const { primary, additional } = groupEducation(items);
  assert.deepEqual(primary.map((item) => item.id), ["cs-daw", "cm-preimpresion-digital"]);
  assert.deepEqual(additional.map((item) => item.id), ["google"]);
  assert.equal(items[1].order, 120);
});
