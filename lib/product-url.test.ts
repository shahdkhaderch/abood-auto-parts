// Run with `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildUrlSlug, idFromUrlSlug, productId } from "./product-url.ts";

test("id: 6 characters, stable, case-insensitive, never the code", () => {
  const id = productId("BG2J0020");
  assert.match(id, /^[0-9a-z]{6}$/);
  assert.equal(productId("bg2j0020"), id);
  assert.notEqual(productId("BG2J0021"), id);
  assert.ok(!id.includes("bg2j"));
});

test("readable Latin slug from model, part and years", () => {
  const slug = buildUrlSlug({ code: "BG2J0020", model: "AMG CLA117", part: "front-bumper", years: "2013 - 2015" });
  assert.equal(slug, `amg-cla117-front-bumper-2013-2015-${productId("BG2J0020")}`);
  assert.match(slug, /^[a-z0-9-]+$/);
  assert.ok(!slug.includes("bg2j0020"));
});

test("arrows, plus and empty parts", () => {
  assert.equal(buildUrlSlug({ code: "X1", model: "AMG S221 → S223", part: "exterior", years: "" }), `amg-s221-s223-exterior-${productId("X1")}`);
  assert.equal(buildUrlSlug({ code: "X2", model: "", part: "parts", years: "2014+" }), `parts-2014-plus-${productId("X2")}`);
});

test("the id is read back from the end of the slug; old code URLs have none", () => {
  const slug = buildUrlSlug({ code: "BG2J0050", model: "Sedan A177 A45", part: "rear-bumper", years: "2018 - 2024" });
  assert.equal(idFromUrlSlug(slug), productId("BG2J0050"));
  assert.equal(idFromUrlSlug("bg2j0050"), null);
});

test("700 real-looking codes give 700 different ids", () => {
  const ids = new Set<string>();
  for (const prefix of ["BG2J", "LIAH", "BGRE", "BGAH", "LI2J", "EXAH", "INAH"]) for (let n = 0; n < 100; n++) ids.add(productId(prefix + String(n).padStart(4, "0")));
  assert.equal(ids.size, 700);
});
