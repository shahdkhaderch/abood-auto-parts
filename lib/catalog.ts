// Pure catalogue helpers: CSV parsing and product derivation.
// No Next.js or network code here so it can be unit-checked in isolation.

import { normalizeText } from "./text";

export type PartType = "front-bumper" | "rear-bumper" | "diffuser" | "other";

export type Product = {
  /** Code exactly as written in the sheet (رقم الصنف), e.g. "BG2J0019". */
  code: string;
  /** URL slug: the code in lowercase. */
  slug: string;
  /** Product name from the sheet (اسم الصنف). */
  name: string;
  /** Mercedes model text from the sheet (الموديل), e.g. "C Class" or "C Class, E Class". */
  model: string;
  /** Each model in الموديل (comma-separated in the sheet), with its URL slug, e.g. { label: "C Class", slug: "c-class" }. */
  models: { label: string; slug: string }[];
  /** Chassis code derived from the 3-digit number in the name, e.g. "W205". Empty if none found. */
  chassis: string;
  partType: PartType;
  /** The optional القسم column when filled, otherwise detected from the name (see detectCategory). */
  category: Category;
  /** From the optional عرض column: true when the value is نعم. */
  onOffer: boolean;
  /** Cloudinary file names from the optional صور مرجعية column, in sheet order; the first is the main image. Empty when there are none. */
  imageFiles: string[];
};

/** Part types with their own filter. Everything else is "other" and is never shown as a label. */
export const PART_TYPE_LABELS: Record<Exclude<PartType, "other">, string> = {
  "front-bumper": "طبون أمامي",
  "rear-bumper": "طبون خلفي",
  diffuser: "دفيوزر",
};

/** The label shown on a product: its part type (e.g. طبون أمامي), or its category for other parts. */
export function productLabel(p: Pick<Product, "partType" | "category">): string {
  return p.partType === "other" ? CATEGORY_LABELS[p.category] : PART_TYPE_LABELS[p.partType];
}

/** Short URL values for ?type=… */
export const PART_TYPE_PARAMS: Record<PartType, string> = {
  "front-bumper": "front",
  "rear-bumper": "rear",
  diffuser: "diffuser",
  other: "other",
};

export type Category = "interior" | "exterior" | "lights" | "light-parts" | "emblems" | "parts";

/** Display order and labels; the keys are the ?category=… URL values. */
export const CATEGORY_LABELS: Record<Category, string> = {
  interior: "كماليات داخلية",
  exterior: "كماليات خارجية",
  lights: "أضوية",
  "light-parts": "قطع الأضوية",
  emblems: "شعارات وإشارات",
  parts: "قطع بودي وغيار",
};

/**
 * How the category is detected from the product name when the القسم column is empty.
 * Rules are checked in this order and the first match wins. Phrases are normalised.
 *
 * - `start`: the name STARTS with one of the phrases. Used for the light groups, so
 *   "طوق كشاف" (a light part) is not caught by "كشاف" (a complete light), and
 *   "طقم اصلاح ضوء" is a light part while "طقم ضوء تحويل" is a complete light.
 * - `word`: one of the phrases appears at the start of any word in the name.
 *
 * Anything that matches nothing is "parts" (قطع بودي وغيار).
 */
export const CATEGORY_RULES: { category: Category; match: "start" | "word"; phrases: string[] }[] = [
  // Badges and emblems: anything starting with اشارة (اشارة شل, اشارة غطاء …). Never أضوية.
  { category: "emblems", match: "start", phrases: ["اشاره"] },
  { category: "light-parts", match: "start", phrases: ["طقم اصلاح ضوء", "زجاجه ضوء", "كتوت زينون", "عين ضوء", "جسر عين ضوء", "طوق كشاف", "غماز"] },
  // Complete lights only. "طقم ضوء خلفي/امامي تحويل" are the same conversion kits as "طقم ضوء تحويل".
  { category: "lights", match: "start", phrases: ["ضوء امامي", "ضوء خلفي", "ضوء خزانه", "ضوء بريك", "كشاف", "طقم ضوء تحويل", "طقم ضوء خلفي تحويل", "طقم ضوء امامي تحويل"] },
  { category: "interior", match: "word", phrases: ["طاره", "اير باك", "ايرباك", "لوحه كبسات", "فرش", "دواسات", "مقود", "قاعده سكره", "تابلو", "كرسي", "مسند"] },
  { category: "exterior", match: "word", phrases: ["طبون", "دفيوزر", "شل", "بودي كيت", "مرشات", "مرايه", "نجل", "اكزوزت", "جناح", "جنحان", "شفه", "سبويلر", "حساسات", "شبك", "بلاستيك حمايه", "واجهه"] },
];

/** The rule that puts a name in its category, or null when none matches (→ "parts"). */
export function matchCategoryRule(name: string): (typeof CATEGORY_RULES)[number] | null {
  const text = normalizeText(name);
  for (const rule of CATEGORY_RULES) {
    const hit = rule.phrases.some((p) => {
      const phrase = normalizeText(p);
      return rule.match === "start"
        ? text === phrase || text.startsWith(`${phrase} `)
        : ` ${text} `.includes(` ${phrase}`);
    });
    if (hit) return rule;
  }
  return null;
}

export function detectCategory(name: string): Category {
  return matchCategoryRule(name)?.category ?? "parts";
}

export const OFFER_LABEL = "عروض";

export function modelToSlug(model: string): string {
  return model
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "C Class, E Class" → [{ label: "C Class", slug: "c-class" }, { label: "E Class", slug: "e-class" }] */
export function parseModels(model: string): { label: string; slug: string }[] {
  const seen = new Set<string>();
  return model
    .split(/[,،]/)
    .map((m) => m.trim())
    .filter(Boolean)
    .map((label) => ({ label, slug: modelToSlug(label) }))
    .filter((m) => m.slug && !seen.has(m.slug) && seen.add(m.slug));
}

/** Mercedes chassis prefixes by platform number. Anything not listed falls back to "W". */
export const CHASSIS_LOOKUP: Record<string, string> = {
  "117": "C117",
  "118": "C118",
  "156": "X156",
  "166": "W166",
  "167": "V167",
  "176": "W176",
  "177": "W177",
  "204": "W204",
  "205": "W205",
  "206": "W206",
  "211": "W211",
  "212": "W212",
  "213": "W213",
  "218": "C218",
  "257": "C257",
  "221": "W221",
  "222": "W222",
  "253": "X253",
};

const HEADER_CODE = "رقم الصنف";
const HEADER_NAME = "اسم الصنف";
const HEADER_MODEL = "الموديل";
const HEADER_CATEGORY = "القسم"; // optional: كماليات داخلية / كماليات خارجية / أضوية / قطع بودي وغيار
const HEADER_OFFER = "عرض"; // optional: نعم or empty
const OFFER_YES = "نعم";
// Optional: Cloudinary file names separated by commas, or "عرض الصور" (a Google search link, ignored).
// Names may be listed before the photo is uploaded; lib/image-check.ts drops the ones not on Cloudinary.
// Other image columns in the sheet (الصورة, حالة الصورة, …) are ignored on purpose.
const HEADER_IMAGE = "صور مرجعية";

const isPlainJpgName = (v: string) => /\.jpg$/i.test(v) && !/[\s/\\?#]/.test(v);

/**
 * Image file names from a صور مرجعية cell, e.g. "a-1.jpg, a-2.jpg" → ["a-1.jpg", "a-2.jpg"].
 * Split by commas (also the Arabic ،), trimmed; only plain names ending in .jpg are kept, so
 * "عرض الصور", links and other formats are dropped. Duplicates are removed, order is kept.
 * `rejected` lists parts that look like a file meant as an image but aren't a plain .jpg name.
 */
export function parseImageFiles(value: string): { files: string[]; rejected: string[] } {
  const parts = value.split(/[,،]/).map((v) => v.trim()).filter(Boolean);
  const files = [...new Set(parts.filter(isPlainJpgName))];
  const rejected = parts.filter((v) => !isPlainJpgName(v) && /\.[a-z]{3,4}$/i.test(v) && !/^https?:/i.test(v));
  return { files, rejected };
}

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, CRLF/LF). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const BUMPER_WORDS = new Set(["طبون", "بمبر", "صدام"]);

/**
 * Bumpers and diffusers are recognised by the FIRST word of the name, so "ضوء خلفي" (rear light)
 * or "مربط طبون" (bumper bracket) are not counted as bumpers.
 */
export function detectPartType(name: string): PartType {
  const words = normalizeText(name).split(" ");
  if (words[0] === "دفيوزر") return "diffuser";
  if (BUMPER_WORDS.has(words[0])) {
    // "دفيوزر خلفي" is handled above; check rear before front for names like "طبون خلفي".
    if (words.includes("خلفي")) return "rear-bumper";
    if (words.includes("امامي")) return "front-bumper";
  }
  return "other";
}

export function detectChassis(name: string): string {
  // A standalone 3-digit number (so years like 2013 are not matched).
  const m = name.match(/(?<!\d)(\d{3})(?!\d)/);
  if (!m) return "";
  return CHASSIS_LOOKUP[m[1]] ?? `W${m[1]}`;
}

export function codeToSlug(code: string): string {
  return code
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Accepted القسم values (normalised) → category key.
const CATEGORY_VALUES: Record<string, Category> = Object.fromEntries(
  (Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([key, label]) => [normalizeText(label), key]),
);

export function parseCategory(value: string): Category | null | undefined {
  const v = normalizeText(value);
  if (!v) return null;
  return CATEGORY_VALUES[v]; // undefined = unknown value
}

export type ParseResult = { products: Product[]; warnings: string[] };

function cleanHeader(h: string): string {
  return h.replace(/[﻿​-‏‪-‮⁦-⁩]/g, "").replace(/\s+/g, " ").trim();
}

export function csvToProducts(csv: string): ParseResult {
  const rows = parseCsv(csv);
  const warnings: string[] = [];
  if (rows.length === 0) throw new Error("Products CSV is empty");

  // Headers are matched by name after cleanup: BOM, zero-width and RTL/LTR marks removed,
  // whitespace (incl. non-breaking) collapsed and trimmed — so "حالة الصورة " = "حالة الصورة".
  // Every column not listed above (#, الصورة, حالة الصورة …) is ignored: internal review only,
  // it never hides a product or changes how it is shown.
  const header = rows[0].map(cleanHeader);
  const iCode = header.indexOf(HEADER_CODE);
  const iName = header.indexOf(HEADER_NAME);
  const iModel = header.indexOf(HEADER_MODEL);
  // Optional columns (-1 when the sheet doesn't have them yet).
  const iCategory = header.indexOf(HEADER_CATEGORY);
  const iOffer = header.indexOf(HEADER_OFFER);
  const iImage = header.indexOf(HEADER_IMAGE);
  const missing = [
    [HEADER_CODE, iCode],
    [HEADER_NAME, iName],
    [HEADER_MODEL, iModel],
  ]
    .filter(([, i]) => i === -1)
    .map(([h]) => h);
  if (missing.length) {
    throw new Error(`Products CSV is missing column(s): ${missing.join(", ")}. Found: ${header.join(", ")}`);
  }

  const seen = new Set<string>();
  const products: Product[] = [];

  rows.slice(1).forEach((r, idx) => {
    const line = idx + 2; // 1-based, counting the header
    const code = (r[iCode] ?? "").trim();
    const name = (r[iName] ?? "").trim().replace(/\s+/g, " ");
    const model = (r[iModel] ?? "").trim();

    if (!code) {
      warnings.push(`row ${line}: skipped (no code)`);
      return;
    }
    const slug = codeToSlug(code);
    if (!slug) {
      warnings.push(`row ${line}: skipped (code "${code}" gives an empty slug)`);
      return;
    }
    if (seen.has(slug)) {
      warnings.push(`row ${line}: skipped duplicate code "${code}"`);
      return;
    }
    if (!name) warnings.push(`row ${line}: code "${code}" has no name`);
    seen.add(slug);

    const rawCategory = iCategory === -1 ? "" : (r[iCategory] ?? "").trim();
    const sheetCategory = parseCategory(rawCategory);
    if (sheetCategory === undefined) {
      warnings.push(`row ${line}: unknown ${HEADER_CATEGORY} "${rawCategory}" (expected: ${Object.values(CATEGORY_LABELS).join(" / ")}); detected from the name instead`);
    }

    const rawOffer = iOffer === -1 ? "" : normalizeText(r[iOffer] ?? "");
    if (rawOffer && rawOffer !== OFFER_YES) warnings.push(`row ${line}: ${HEADER_OFFER} should be "نعم" or empty, got "${r[iOffer]}"`);

    const rawImage = iImage === -1 ? "" : (r[iImage] ?? "").trim();
    const { files: imageFiles, rejected } = parseImageFiles(rawImage);
    for (const v of rejected) warnings.push(`row ${line}: ${HEADER_IMAGE} "${v}" is not a plain .jpg file name; ignored`);

    const partType = detectPartType(name);
    products.push({
      code,
      slug,
      name: name || code,
      model,
      models: parseModels(model),
      chassis: detectChassis(name),
      partType,
      // القسم wins; bumpers/diffusers are exterior even when the name mentions "كشاف ليد".
      category: sheetCategory ?? (partType === "other" ? detectCategory(name) : "exterior"),
      onOffer: rawOffer === OFFER_YES,
      imageFiles,
    });
  });

  return { products, warnings };
}
