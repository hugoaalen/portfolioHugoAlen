import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderProjectSummary } from "../src/lib/project-preview.ts";

const corporate = JSON.parse(readFileSync(new URL("../src/data/marsan-projects.json", import.meta.url), "utf8"));
test("corporate cases have bilingual summaries without private links or invented screenshots", () => {
  assert.equal(corporate.length, 8);
  assert.equal(new Set(corporate.map((p: { id: string }) => p.id)).size, corporate.length);
  for (const project of corporate) {
    assert.ok(project.id.startsWith("marsan-"));
    assert.equal(project.image, "");
    assert.equal(project.github, undefined);
    assert.equal(project.link, undefined);
    assert.ok(project.description.es && project.description.en);
    const html = renderProjectSummary(project);
    assert.ok(!html.includes("<img"));
    assert.ok(html.includes("Grupo Marsan"));
  }
});
test("editorial cards escape CMS text and work without image fields", () => {
  const html = renderProjectSummary({ id: "personal", title: { es: "<script>bad</script>" }, description: { es: '"quoted"' } });
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes("&quot;quoted&quot;"));
});
