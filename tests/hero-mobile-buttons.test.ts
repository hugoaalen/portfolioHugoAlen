import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

test("mobile hero buttons override SocialPill's intrinsic maximum width", () => {
  const css = readFileSync(new URL("../src/styles/portfolio.css", import.meta.url), "utf8");
  const mobile = css.slice(css.indexOf("@media (max-width: 47.999rem)"));
  const buttons = mobile.match(/\.hero-panel > nav a \{([^}]+)\}/)?.[1] ?? "";
  assert.match(buttons, /width: 100%;/);
  assert.match(buttons, /max-width: none;/);
  assert.match(buttons, /justify-self: stretch;/);
  assert.match(mobile, /#hero-email-link \{ grid-column: 1 \/ -1;/);
});
