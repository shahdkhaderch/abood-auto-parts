// Text normalisation shared by sheet parsing and search.

// Arabic tashkeel / Quranic marks are Unicode non-spacing marks (category Mn).
const MARKS = /\p{Mn}/gu;
const TATWEEL = /ـ/g;

/**
 * Normalise for matching:
 * - أ إ آ ٱ → ا, ة → ه, ى → ي
 * - remove tashkeel and tatweel
 * - lowercase Latin
 * - collapse whitespace
 */
export function normalizeText(s: string): string {
  return s
    .normalize("NFC")
    .replace(MARKS, "")
    .replace(TATWEEL, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
