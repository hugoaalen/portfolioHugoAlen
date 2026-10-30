import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("compact menu uses the same tablet breakpoint in CSS, JS and desktop navigation", () => {
  const mobile = readFileSync(new URL("../src/components/MobileNavigation.astro", import.meta.url), "utf8");
  const desktop = readFileSync(new URL("../src/components/PublicNavigation.astro", import.meta.url), "utf8");
  const query = mobile.match(/const media = matchMedia\("([^"]+)"\)/)?.[1];
  assert.ok(query);
  assert.ok(query.includes("(max-width: 1439px)"));
  assert.ok(query.includes("(hover: none) and (pointer: coarse)"));
  assert.ok(mobile.includes(`@media ${query} { .mobile-navigation { display: block; } }`));
  assert.ok(desktop.includes(`@media ${query} {\n    .reading-ruler { display: none; }`));
  assert.ok(!desktop.includes("section-picker"));
});
