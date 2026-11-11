import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { availabilityResponse, getMaintenanceEnabled, readMaintenanceFlag } from "../src/lib/site-availability.ts";

test("legacy content is ignored; only the boolean visibility setting is read", () => {
  assert.equal(readMaintenanceFlag({ fields: { kicker: { stringValue: "Old text" } } }), false);
  assert.equal(readMaintenanceFlag({ fields: { maintenanceEnabled: { booleanValue: true } } }), true);
  assert.equal(readMaintenanceFlag({ fields: { maintenanceEnabled: { booleanValue: false } } }), false);
  assert.throws(() => readMaintenanceFlag({ fields: { maintenanceEnabled: { booleanValue: "false" } } }));
});

test("availability reads only the setting, bypasses caches and validates responses", async () => {
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.searchParams.get("mask.fieldPaths"), "maintenanceEnabled");
    assert.equal(init?.cache, "no-store");
    assert.ok(init?.signal);
    return Response.json({ fields: { maintenanceEnabled: { booleanValue: true } } });
  };
  assert.equal(await getMaintenanceEnabled("project", "test-key", fetcher), true);
  assert.equal(await getMaintenanceEnabled("project", "test-key", async () => new Response(null, { status: 404 })), false);
  await assert.rejects(getMaintenanceEnabled(undefined, "key", fetcher));
  await assert.rejects(getMaintenanceEnabled("project", "key", async () => new Response(null, { status: 403 })));
  await assert.rejects(getMaintenanceEnabled("project", "key", async () => { throw new Error("offline"); }));
});

test("maintenance redirects before serving the portfolio and reopening has no loop", () => {
  for (const path of ["/", "/?preview=local", "/index.html"]) {
    const response = availabilityResponse(new Request(`https://example.com${path}`), true);
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "https://example.com/maintenance");
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  assert.equal(availabilityResponse(new Request("https://example.com/maintenance"), true).headers.get("x-middleware-next"), "1");
  assert.equal(availabilityResponse(new Request("https://example.com/maintenance"), false).headers.get("location"), "https://example.com/");
  assert.equal(availabilityResponse(new Request("https://example.com/"), false).headers.get("x-middleware-next"), "1");
});

test("sections no longer fetch or overwrite content from Firebase", () => {
  for (const name of ["Hero", "Projects", "Experience", "Education", "AboutMe"]) {
    const source = readFileSync(new URL(`../src/components/${name}.astro`, import.meta.url), "utf8");
    assert.ok(!source.includes("firebase/"), name);
    assert.ok(!source.includes("FromFirestore"), name);
  }
  const middleware = readFileSync(new URL("../middleware.ts", import.meta.url), "utf8");
  assert.ok(middleware.includes("let maintenance = true"));
  assert.ok(!middleware.includes('"/admin"'));
  const admin = readFileSync(new URL("../src/pages/admin.astro", import.meta.url), "utf8");
  assert.ok(admin.includes("{ merge: true }"));
  assert.ok(!admin.includes('href="/admin/projects"'));
  assert.ok(!admin.includes('href="/admin/content"'));
});
