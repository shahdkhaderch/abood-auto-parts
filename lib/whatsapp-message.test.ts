// Run with `npm test`. Names are real rows from the sheet (اسم الصنف): mixed Arabic / Latin / years.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProductName } from "./product-name.ts";
import { buildProductMessage, LRI, PDI, RLM } from "./whatsapp-message.ts";

const URL = "https://aboodparts.com/products/amg-c205-front-bumper-2019-2021-k7q2m9";
const msg = (name: string, url = URL) => buildProductMessage({ ...parseProductName(name), url });

test("طبون امامي AMG C205 2019-2021: one value per line, Latin values isolated", () => {
  assert.equal(
    msg("طبون امامي AMG C205 2019-2021"),
    [
      `${RLM}مرحبا، بدي استفسر عن هالقطعة:`,
      `${RLM}القطعة: طبون امامي`,
      `${RLM}الموديل: ${LRI}AMG C205${PDI}`,
      `${RLM}السنوات: ${LRI}2019 - 2021${PDI}`,
      `${RLM}الرابط: ${LRI}${URL}${PDI}`,
    ].join("\n"),
  );
});

test("every line starts with RLM; the link is the last line with nothing after it", () => {
  for (const name of ["ضوء امامي امريكي يمين GLC253 2016", "طبون خلفي C63 C2062022-2025", "C206 D2025 شل", "حساسات طبون 2014+"]) {
    const lines = msg(name).split("\n");
    assert.ok(lines.every((l) => l.startsWith(RLM)), name);
    assert.ok(lines.at(-1)!.endsWith(`${URL}${PDI}`), name);
  }
});

test("missing parts are skipped", () => {
  // no years
  assert.ok(!msg("زجاجة مراية يمين C205").includes("السنوات"));
  // no Latin model tokens
  assert.ok(!msg("حساسات طبون 2014+").includes("الموديل"));
  // no Arabic part words
  assert.equal(buildProductMessage({ part: "", model: "C206 D", years: "2025", url: URL }).split("\n").length, 4);
});

test("side and market words stay in the part line; glued typos are split", () => {
  assert.ok(msg("غماز طبون امريكي يمين E212 2010-2013").includes("القطعة: غماز طبون امريكي يمين"));
  assert.ok(msg("طبون خلفي C63 C2062022-2025").includes(`الموديل: ${LRI}C63 C206${PDI}`));
  assert.ok(msg("طبون خلفي C63 C2062022-2025").includes(`السنوات: ${LRI}2022 - 2025${PDI}`));
});

test("no item code, price or chassis field", () => {
  const m = msg("طبون خلفي Sedan A177 a45 2018-2024");
  for (const word of ["رقم الصنف", "السعر", "الشاصي", "₪", "BG2J"]) assert.ok(!m.includes(word), word);
});
