import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { organizationLogo, renderOrganizationLogo } from "../src/lib/organization-logo.ts";

test("every institution and employer has a local WebP logo", () => {
  for (const file of ["experience", "education"]) {
    const items = JSON.parse(readFileSync(new URL(`../src/data/${file}.json`, import.meta.url), "utf8"));
    for (const item of items.filter((item: { visible: boolean }) => item.visible)) {
      const src = organizationLogo(item.company);
      assert.ok(src, item.company);
      const asset = new URL(`../public${src}`, import.meta.url);
      assert.ok(existsSync(asset));
      const data = readFileSync(asset);
      assert.equal(data.toString("ascii", 8, 12), "WEBP");
      assert.ok(data.length < 40_000);
    }
  }
});
test("organization names are accent/case insensitive; unknown names render nothing", () => {
  assert.equal(organizationLogo(" IES PAZO DA MERCÉ "), organizationLogo("ies pazo da merce"));
  assert.equal(renderOrganizationLogo('<img src=x onerror="alert(1)">'), "");
  assert.equal(renderOrganizationLogo("__proto__"), "");
  assert.match(renderOrganizationLogo("Google"), /alt=""/);
});
