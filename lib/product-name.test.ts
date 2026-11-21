// Run with `npm test` (Node's built-in test runner; Node strips the TypeScript types itself).
// Every name below is copied from the live sheet (اسم الصنف), typos included.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProductName } from "./product-name.ts";

const cases: [string, { model: string; part: string; years: string }][] = [
  // the example from the card design
  ["طبون امامي E63 E213 2020-2024", { model: "E63 E213", part: "طبون امامي", years: "2020 - 2024" }],
  ["طبون امامي AMG CLA117 2013-2015", { model: "AMG CLA117", part: "طبون امامي", years: "2013 - 2015" }],
  ["دفيوزر طبون خلفي E212 2010-2013", { model: "E212", part: "دفيوزر طبون خلفي", years: "2010 - 2013" }],
  // side / market words stay in the part name
  ["ضوء امامي شمال GLE167 2019", { model: "GLE167", part: "ضوء امامي شمال", years: "2019" }],
  ["غماز طبون امريكي يمين E212 2010-2013", { model: "E212", part: "غماز طبون امريكي يمين", years: "2010 - 2013" }],
  ["ضوء امامي امريكي يمين GLC253 2016", { model: "GLC253", part: "ضوء امامي امريكي يمين", years: "2016" }],
  // no years → empty years line
  ["زجاجة مراية يمين C205", { model: "C205", part: "زجاجة مراية يمين", years: "" }],
  ["بطانة عجل امامي JP يمين E213", { model: "JP E213", part: "بطانة عجل امامي يمين", years: "" }],
  ["اشارة شل برابوس G-Class", { model: "G-Class", part: "اشارة شل برابوس", years: "" }],
  // lowercase model codes are upper-cased; double spaces ignored
  ["طبون امامي  e63 GLE167 2019-2024", { model: "E63 GLE167", part: "طبون امامي", years: "2019 - 2024" }],
  // Latin first, Arabic last
  ["C206 D2025 شل", { model: "C206 D", part: "شل", years: "2025" }],
  ["CLA117 D2015 شل", { model: "CLA117 D", part: "شل", years: "2015" }],
  ["شل اسود C205 D 2018", { model: "C205 D", part: "شل اسود", years: "2018" }],
  ["شل سلفر C205 2019D", { model: "C205 D", part: "شل سلفر", years: "2019" }],
  // missing spaces in the sheet
  ["طبون خلفي C63 C2062022-2025", { model: "C63 C206", part: "طبون خلفي", years: "2022 - 2025" }],
  // open-ended years
  ["مراية جانبية شمال E213 2017+", { model: "E213", part: "مراية جانبية شمال", years: "2017+" }],
  ["حساسات طبون 2014+", { model: "", part: "حساسات طبون", years: "2014+" }],
  // "الى" between two chassis codes
  ["طقم تحويل بدون ابوبا AMG S221 الى S223", { model: "AMG S221 → S223", part: "طقم تحويل بدون ابوبا", years: "" }],
  ["بودي كيت S63 S223 2024", { model: "S63 S223", part: "بودي كيت", years: "2024" }],
  ["نجل اكزوزت سلفر E63 E213", { model: "E63 E213", part: "نجل اكزوزت سلفر", years: "" }],
];

for (const [name, expected] of cases) {
  test(name, () => assert.deepEqual(parseProductName(name), expected));
}

test("glued AMG and model codes are split", () => {
  assert.equal(parseProductName("طبون امامي AMGGLC253 2020").model, "AMG GLC253");
  assert.equal(parseProductName("طبون امامي e63GLE166").model, "E63 GLE166");
});

test("a name without Latin tokens or years gives only the part line", () => {
  assert.deepEqual(parseProductName("حساسات طبون"), { model: "", part: "حساسات طبون", years: "" });
});

test("years written with spaces around the dash", () => {
  assert.deepEqual(parseProductName("طبون امامي CLA117 2013 - 2015"), { model: "CLA117", part: "طبون امامي", years: "2013 - 2015" });
});

test("empty name", () => {
  assert.deepEqual(parseProductName(""), { model: "", part: "", years: "" });
});
