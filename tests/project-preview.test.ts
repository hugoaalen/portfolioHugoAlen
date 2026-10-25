import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { renderProjectPreview } from "../src/lib/project-preview.ts";
import { getOptimizedImagePath } from "../src/lib/public-assets.ts";

const projects = JSON.parse(readFileSync(new URL("../src/data/projects.json", import.meta.url), "utf8"));

test("every catalog project resolves to a real local image", () => {
  for (const project of projects) {
    const path = getOptimizedImagePath(project.image);
    assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `${project.id}: ${path}`);
    assert.match(renderProjectPreview(project), /class="project-preview"/);
  }
});

test("old CMS image paths resolve to the refreshed assets", () => {
  assert.equal(getOptimizedImagePath("/projects/futpath.svg"), "/projects/futpath-capture.jpg");
  assert.equal(getOptimizedImagePath("/projects/senda-window-1200.jpg"), "/projects/senda-capture.jpg");
  assert.equal(getOptimizedImagePath("/projects/taskflow.svg"), "/projects/taskflow-cover.svg");
});

test("custom CMS replacements are preserved and never receive the old frame crop", () => {
  const markup = renderProjectPreview({ id: "bpkeepers", image: "/projects/custom.png", title: { es: "Custom" } });
  assert.match(markup, /src="\/projects\/custom.png"/);
  assert.match(markup, /data-format="desktop"/);
  assert.match(renderProjectPreview({ id: "bpkeepers", image: "/projects/bpkeepers.webp", title: { es: "Original" } }), /data-format="legacy"/);
});

test("CMS text and image attributes cannot inject markup", () => {
  const markup = renderProjectPreview({ id: "new-project", image: '/image.png" onerror="alert(1)', title: { es: '<script>alert(1)</script>' } });
  assert.ok(!markup.includes("<script>"));
  assert.match(markup, /&lt;script&gt;/);
  assert.match(markup, /image.png&quot; onerror=&quot;/);
});

test("new projects have unique IDs and verified links only", () => {
  assert.equal(new Set(projects.map((project: { id: string }) => project.id)).size, projects.length);
  assert.ok(projects.find((project: { id: string }) => project.id === "sfit"));
  assert.ok(projects.find((project: { id: string }) => project.id === "padeltime"));
  const moto = projects.find((project: { id: string }) => project.id === "mototv");
  assert.deepEqual(moto.tags, ["KOTLIN", "SQLITE"]);
  assert.equal(moto.github, undefined);
  assert.equal(moto.link, undefined);
});
