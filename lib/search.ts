// Product search: name, code, model (+ chassis, part type, category, offer).
// Written for how people actually type in Palestine: Arabic/English mixed, loose spelling,
// dialect words, partial words and small typos.
//
// Rules (every query word must match, in any order):
// - normalisation: أ إ آ ٱ → ا, ة → ه, ى → ي, ء ؤ ئ removed, tashkeel/tatweel removed, lowercase;
// - a query word matches a product word it equals or starts ("ضو" finds "ضوء");
// - a word of 4+ letters may have one typo, but only when it matches nothing without one
//   (so a correctly spelled word never pulls in look-alike words);
// - words with digits (c205, e212, codes) never get typos, so c205 doesn't find c204;
// - synonym groups (SYNONYM_GROUPS) mean the same thing, including multi-word ones;
// - a full model name ("C Class", "CLA") restricts results to that model.

import { CATEGORY_LABELS, OFFER_LABEL, productLabel, type Product } from "./catalog";
import { normalizeText } from "./text";

/** Each group means the same thing. Written naturally; normalised when the module loads. */
export const SYNONYM_GROUPS: string[][] = [
  ["ضوء", "ضو", "ضواو", "اضواء", "اضويه", "فانوس"],
  ["طبون", "بمبر", "صدام", "دعاميه"],
  ["شل", "شبك", "جريل", "كريل"],
  ["امامي", "قدام", "قدامي"],
  ["خلفي", "ورا", "وراني"],
  ["شمال", "يسار"],
  ["مرايه", "مراه", "مرآه"],
  ["غطاء مطور", "كبوت", "كابوت"],
  ["نجل اكزوزت", "اكزوز", "اكزوست"],
  ["دفيوزر", "ديفيوزر"],
];

const MIN_TYPO_LENGTH = 4;

/** Search normalisation: normalizeText plus removing the hamza and its seats (ء ؤ ئ). */
export function normalizeSearch(s: string): string {
  return normalizeText(s).replace(/[ءؤئ]/g, "");
}

export function tokenize(s: string): string[] {
  return normalizeSearch(s)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(" ")
    .filter(Boolean);
}

/** A phrase is one or more words, e.g. ["غطا", "مطور"]. */
type Phrase = string[];

const GROUPS: Phrase[][] = SYNONYM_GROUPS.map((g) => g.map(tokenize).filter((p) => p.length > 0));

const hasDigit = (s: string) => /\p{N}/u.test(s);

/** Optimal string alignment distance, stopping early once it is above 1. */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const ra = a.slice(i + 1), rb = b.slice(i + 1);
  if (a.length === b.length) {
    if (ra === rb) return true; // substitution
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // transposition
  }
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1); // deletion / insertion
}

/** Does query word q fit product word w? 3 = same, 2 = start of the word, 1 = with one typo, 0 = no. */
function wordScore(q: string, w: string, allowTypo: boolean): number {
  if (w === q) return 3;
  if (w.startsWith(q)) return 2;
  // Numbers inside a longer token, e.g. "117" in "cla117" or "j0019" in a code.
  if (hasDigit(q) && q.length >= 3 && w.includes(q)) return 2;
  if (allowTypo && q.length >= MIN_TYPO_LENGTH && !hasDigit(q) && !hasDigit(w)) {
    // Whole word with a typo ("فانوص" → "فانوس"), or the start of the word with a typo.
    for (const len of [q.length - 1, q.length, q.length + 1]) {
      if (len <= w.length && withinOneEdit(q, w.slice(0, len))) return 1;
    }
  }
  return 0;
}

function phraseScore(phrase: Phrase, hay: string[], allowTypo: boolean): number {
  let min = 3;
  for (const q of phrase) {
    let best = 0;
    for (const w of hay) {
      best = Math.max(best, wordScore(q, w, allowTypo));
      if (best === 3) break;
    }
    if (best === 0) return 0;
    min = Math.min(min, best);
  }
  return min;
}

/**
 * One query term: the words the user typed plus every synonym that means the same.
 * `typo` is the same term looser: synonyms within one typo too ("فانوص" → فانوس → ضوء …),
 * used only when `exact` matches nothing.
 */
type Term = { exact: Phrase[]; typo: Phrase[] };

/** Turn query words into terms, joining multi-word synonyms ("غطاء مطور") into one term. */
function toTerms(words: string[]): Term[] {
  const terms: Term[] = [];
  for (let i = 0; i < words.length; i++) {
    // Multi-word synonym written in full, longest first.
    const multi = GROUPS.flatMap((g) => g.filter((p) => p.length > 1).map((p) => [p, g] as const))
      .sort((a, b) => b[0].length - a[0].length)
      .find(([p]) => p.every((t, j) => words[i + j] === t));
    if (multi) {
      terms.push({ exact: multi[1], typo: multi[1] });
      i += multi[0].length - 1;
      continue;
    }

    const w = words[i];
    // Groups that contain the word, or (3+ letters) a word it starts: "دعامي" → طبون group.
    const groups = GROUPS.filter((g) => g.some((p) => p.length === 1 && (p[0] === w || (w.length >= 3 && p[0].startsWith(w)))));
    const typoGroups = GROUPS.filter((g) => g.some((p) => p.length === 1 && wordScore(w, p[0], true) > 0));
    terms.push({ exact: [[w], ...groups.flat()], typo: [[w], ...typoGroups.flat()] });
  }
  return terms;
}

function termScore(term: Term, hay: string[], allowTypo: boolean): number {
  let best = 0;
  const phrases = allowTypo ? term.typo : term.exact;
  for (let i = 0; i < phrases.length; i++) {
    // Only the word as typed (index 0) may have a typo; synonyms are correct spellings.
    best = Math.max(best, phraseScore(phrases[i], hay, allowTypo && i === 0));
    if (best === 3) break;
  }
  return best;
}

function haystackTokens(p: Product): string[] {
  return tokenize(
    [
      p.name,
      p.code,
      p.model,
      p.chassis,
      productLabel(p),
      CATEGORY_LABELS[p.category],
      p.onOffer ? `${OFFER_LABEL} عرض` : "",
    ].join(" "),
  );
}

/**
 * Find whole model names in the query (e.g. "c class", "cla") and pull them out as a model
 * constraint, so "C Class امامي" doesn't also match "E Class" through the word "class".
 */
function extractModels(queryTokens: string[], products: Product[]) {
  const models = [...new Map(products.flatMap((p) => p.models.map((m) => [m.slug, tokenize(m.label)] as const))).entries()]
    .filter(([, t]) => t.length > 0)
    .sort((a, b) => b[1].length - a[1].length); // longest first: "c class" before "c"

  const rest = [...queryTokens];
  const found = new Set<string>();
  for (const [slug, mt] of models) {
    for (let i = 0; i + mt.length <= rest.length; i++) {
      if (mt.every((t, j) => rest[i + j] === t)) {
        found.add(slug);
        rest.splice(i, mt.length);
        i--;
      }
    }
  }
  return { modelSlugs: found, rest };
}

/** Products matching every word of the query, best matches first (stable for ties). */
export function searchProducts(products: Product[], query: string): Product[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return products;

  const { modelSlugs, rest } = extractModels(qTokens, products);
  const candidates = products
    .map((p, index) => ({ p, index, hay: haystackTokens(p) }))
    .filter(({ p }) => !modelSlugs.size || p.models.some((m) => modelSlugs.has(m.slug)));

  const terms = toTerms(rest);
  // Typos are only allowed for a term that matches nothing when spelled as typed.
  const allowTypo = terms.map((t) => !candidates.some((c) => termScore(t, c.hay, false) > 0));

  return candidates
    .map((c) => {
      let score = 0;
      for (let i = 0; i < terms.length; i++) {
        const s = termScore(terms[i], c.hay, allowTypo[i]);
        if (s === 0) return null;
        score += s;
      }
      return { ...c, score };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((x) => x.p);
}
