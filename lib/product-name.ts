// Splits a product name from the sheet (اسم الصنف) into the three lines of the product card:
//   model  — the Latin / number tokens in sheet order ("E63 E213", "AMG CLA117", "GT")
//   part   — the remaining Arabic words in sheet order ("طبون امامي", "ضوء خلفي يمين")
//   years  — the year or year range ("2020 - 2024", "2014+")
// Display only: the sheet is never changed, and search/filters keep using the full name.
// Pure, no imports, so it runs under `node --test` (lib/product-name.test.ts).

export type NameParts = { model: string; part: string; years: string };

const YEAR = "(?:19|20)\\d\\d";
const YEAR_TOKEN = new RegExp(`^(${YEAR})(?:-(${YEAR}))?(\\+)?$`);
const ARABIC = /[؀-ۿ]/;
const LATIN_OR_DIGIT = /[A-Za-z0-9]/;
/** Arabic words that join two model tokens ("S221 الى S223") and stay in the model line as an arrow. */
const MODEL_JOINERS = new Set(["الى", "إلى"]);

/** Typos in the sheet where a space is missing: "C2062022-2025", "D2025", "2019D", "AMGGLC253", "e63GLE166". */
function splitGlued(token: string): string[] {
  const rules: RegExp[] = [
    new RegExp(`^([A-Za-z]+\\d{2,3})(${YEAR}(?:-${YEAR})?\\+?)$`), // chassis + year
    new RegExp(`^([A-Za-z])(${YEAR})$`), // D2025
    new RegExp(`^(${YEAR})([A-Za-z])$`), // 2019D
    /^(AMG)([A-Za-z]+\d+)$/i, // AMGGLC253
    /^([a-z]+\d+)([A-Z]+\d+)$/, // e63GLE166 (case change marks the boundary)
  ];
  for (const r of rules) {
    const m = token.match(r);
    if (m) return [m[1], m[2]];
  }
  return [token];
}

/** "e63" → "E63"; other tokens ("GT", "Sedan", "G-Class") as written. */
function formatModelToken(t: string): string {
  return /^[a-z]+\d+$/i.test(t) ? t.toUpperCase() : t;
}

export function parseProductName(name: string): NameParts {
  const tokens = name.trim().split(/\s+/).filter(Boolean).flatMap(splitGlued);
  const isModel = (t: string | undefined) => !!t && !ARABIC.test(t) && LATIN_OR_DIGIT.test(t) && !YEAR_TOKEN.test(t);

  const model: string[] = [];
  const part: string[] = [];
  let years = "";

  tokens.forEach((t, i) => {
    const y = t.match(YEAR_TOKEN);
    if (y) {
      // First year (range) wins; a second one in the same name is rare and dropped.
      if (!years) years = y[2] ? `${y[1]} - ${y[2]}` : `${y[1]}${y[3] ?? ""}`;
      return;
    }
    if (ARABIC.test(t)) {
      if (MODEL_JOINERS.has(t) && isModel(tokens[i - 1]) && isModel(tokens[i + 1])) model.push("→");
      else part.push(t);
      return;
    }
    if (LATIN_OR_DIGIT.test(t)) model.push(formatModelToken(t));
    // Anything else (a stray "-" or "+") is dropped.
  });

  return { model: model.join(" "), part: part.join(" "), years };
}
