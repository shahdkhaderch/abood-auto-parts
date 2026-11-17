// Arabic text helpers for the OG image renderer (Satori), which:
//  1. measures Arabic words with un-joined letter widths but draws them joined, so spacing
//     comes out uneven, and
//  2. lays words out left-to-right even for Arabic.
// We fix (1) by converting letters to their Unicode presentation forms (already joined,
// so measured width == drawn width) and (2) by ordering word runs right-to-left ourselves.
// Only used for generated images; the website itself uses normal text and the browser's shaping.

// Isolated form code point for each base letter; final = +1, initial = +2, medial = +3.
// `dual` letters connect on both sides; the rest only connect to the previous (right) letter.
const FORMS: Record<string, { iso: number; dual: boolean }> = {
  "ء": { iso: 0xfe80, dual: false },
  "آ": { iso: 0xfe81, dual: false },
  "أ": { iso: 0xfe83, dual: false },
  "ؤ": { iso: 0xfe85, dual: false },
  "إ": { iso: 0xfe87, dual: false },
  "ئ": { iso: 0xfe89, dual: true },
  "ا": { iso: 0xfe8d, dual: false },
  "ب": { iso: 0xfe8f, dual: true },
  "ة": { iso: 0xfe93, dual: false },
  "ت": { iso: 0xfe95, dual: true },
  "ث": { iso: 0xfe99, dual: true },
  "ج": { iso: 0xfe9d, dual: true },
  "ح": { iso: 0xfea1, dual: true },
  "خ": { iso: 0xfea5, dual: true },
  "د": { iso: 0xfea9, dual: false },
  "ذ": { iso: 0xfeab, dual: false },
  "ر": { iso: 0xfead, dual: false },
  "ز": { iso: 0xfeaf, dual: false },
  "س": { iso: 0xfeb1, dual: true },
  "ش": { iso: 0xfeb5, dual: true },
  "ص": { iso: 0xfeb9, dual: true },
  "ض": { iso: 0xfebd, dual: true },
  "ط": { iso: 0xfec1, dual: true },
  "ظ": { iso: 0xfec5, dual: true },
  "ع": { iso: 0xfec9, dual: true },
  "غ": { iso: 0xfecd, dual: true },
  "ف": { iso: 0xfed1, dual: true },
  "ق": { iso: 0xfed5, dual: true },
  "ك": { iso: 0xfed9, dual: true },
  "ل": { iso: 0xfedd, dual: true },
  "م": { iso: 0xfee1, dual: true },
  "ن": { iso: 0xfee5, dual: true },
  "ه": { iso: 0xfee9, dual: true },
  "و": { iso: 0xfeed, dual: false },
  "ى": { iso: 0xfeef, dual: false }, // presentation block has no initial/medial forms
  "ي": { iso: 0xfef1, dual: true },
};

// Lam + alef ligatures: isolated code point; final = +1.
const LAM_ALEF: Record<string, number> = { "آ": 0xfef5, "أ": 0xfef7, "إ": 0xfef9, "ا": 0xfefb };

const ARABIC = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

/** Convert one Arabic word (logical order) to joined presentation forms (logical order). */
export function shapeArabicWord(word: string): string {
  const chars = Array.from(word);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const f = FORMS[c];
    if (!f) {
      out += c;
      continue;
    }
    const prev = FORMS[chars[i - 1]];
    const joinsPrev = !!prev && prev.dual;

    if (c === "ل" && LAM_ALEF[chars[i + 1]] !== undefined) {
      out += String.fromCodePoint(LAM_ALEF[chars[i + 1]] + (joinsPrev ? 1 : 0));
      i++;
      continue;
    }

    const joinsNext = f.dual && !!FORMS[chars[i + 1]];
    const offset = joinsPrev && joinsNext ? 3 : joinsNext ? 2 : joinsPrev ? 1 : 0;
    // Isolated: keep the base letter. It looks identical, and many fonts (Cairo included)
    // ship only the final/initial/medial presentation forms.
    out += offset === 0 ? c : String.fromCodePoint(f.iso + offset);
  }
  return out;
}

/**
 * Satori draws presentation forms in string order, but still reverses runs of plain
 * (U+0600–U+06FF) letters itself. So: reverse the order of segments, and reverse the letters
 * inside presentation-form segments only, leaving plain-letter runs for Satori to flip.
 */
function toVisualOrder(shaped: string): string {
  const segments = shaped.match(/[\u0600-\u06FF]+|[^\u0600-\u06FF]/g) ?? [];
  return segments
    .reverse()
    .map((s) => (/[؀-ۿ]/.test(s) ? s : Array.from(s).reverse().join("")))
    .join("");
}

/**
 * Split text into runs in visual right-to-left order: each Arabic word (shaped) is its own run,
 * consecutive non-Arabic words (Latin, numbers) are grouped and keep their left-to-right order.
 */
export function rtlVisualRuns(text: string): string[] {
  const runs: string[] = [];
  let latin: string[] = [];
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (ARABIC.test(word)) {
      if (latin.length) runs.push(latin.join(" "));
      latin = [];
      runs.push(toVisualOrder(shapeArabicWord(word)));
    } else {
      latin.push(word);
    }
  }
  if (latin.length) runs.push(latin.join(" "));
  return runs; // index 0 is the rightmost run
}
