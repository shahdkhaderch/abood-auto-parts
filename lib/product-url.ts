// Public product URLs without the item code (decision 5):
//   /products/<readable>-<id>    e.g. /products/amg-c205-front-bumper-2019-2021-k7q2m9
// <readable> is Latin only (model tokens from the name, part type or category, years) and purely
// cosmetic; <id> is a 6-character one-way hash of the item code and is what the page is found by.
// So a renamed product keeps its links (wrong readable part → redirect to the current URL), and the
// old /products/<code> URLs redirect too (see app/products/[slug]/page.tsx).
// Pure, no imports, so it runs under `node --test` (lib/product-url.test.ts).

const ID_LENGTH = 6;
const ID_SPACE = 36 ** ID_LENGTH;

/** 6-character base-36 id from the item code (FNV-1a, 32 bit). Same code → same id; the code can't be read back. */
export function productId(code: string): string {
  let h = 0x811c9dc5;
  for (const ch of code.trim().toUpperCase()) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (h % ID_SPACE).toString(36).padStart(ID_LENGTH, "0");
}

/** "AMG C205" → "amg-c205"; "S221 → S223" → "s221-s223"; anything non-Latin is dropped. */
function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The URL slug: readable Latin words + "-" + id. `model` = model tokens from the name (or the الموديل
 * column), `part` = an English part-type / category key ("front-bumper", "lights"), `years` = "2019 - 2021".
 */
export function buildUrlSlug(input: { code: string; model: string; part: string; years: string }): string {
  const readable = [input.model, input.part, input.years].map(slugPart).filter(Boolean).join("-").replace(/-{2,}/g, "-");
  // Keep URLs readable but not endless.
  const short = readable.length > 60 ? readable.slice(0, 60).replace(/-[^-]*$/, "") : readable;
  return [short, productId(input.code)].filter(Boolean).join("-");
}

/** The id at the end of a URL slug ("…-k7q2m9" → "k7q2m9"), or null (e.g. an old /products/<code> URL). */
export function idFromUrlSlug(slug: string): string | null {
  const m = slug.toLowerCase().match(/-([0-9a-z]{6})$/);
  return m ? m[1] : null;
}
