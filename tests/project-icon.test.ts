import test from "node:test";
import assert from "node:assert/strict";
import { renderProjectIcon, projectLogos } from "../src/lib/project-icon.ts";
import { existsSync } from "node:fs";

test("project icons are decorative vectors with a safe fallback", () => {
  assert.match(renderProjectIcon("marsan-mpms"), /aria-hidden="true"/);
  assert.match(renderProjectIcon("unknown"), /<svg/);
  assert.match(renderProjectIcon("zaizen"), /zaizen.webp/);
  assert.notEqual(renderProjectIcon("marsan-mpms"), renderProjectIcon("zaizen"));
  assert.equal(renderProjectIcon('<script>'), renderProjectIcon("unknown"));
  assert.ok(!renderProjectIcon('<script>').includes("<script>"));
});

test("corporate projects use real local logos and multiple brand variants", () => {
  assert.equal(Object.keys(projectLogos).filter((id) => id.startsWith("marsan-")).length, 8);
  assert.ok(new Set(Object.values(projectLogos).map((logo) => logo.file)).size >= 5);
  for (const [id, logo] of Object.entries(projectLogos)) {
    assert.ok(existsSync(new URL(`../public/images/project-logos/${logo.file}.${logo.format || "webp"}`, import.meta.url)));
    assert.match(renderProjectIcon(id), /class="project-emblem project-logo/);
  }
});
