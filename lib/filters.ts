// URL-driven product filters for /products, and the facets (models, types, categories,
// offers) used by the navbar, footer and filter chips. Pure: no Next.js imports.

import {
  CATEGORY_LABELS,
  compareModels,
  OFFER_LABEL,
  PART_TYPE_LABELS,
  PART_TYPE_PARAMS,
  type Category,
  type PartType,
  type Product,
} from "./catalog";
import { searchProducts } from "./search";

export type ProductFilters = {
  q: string;
  /** Model slug, e.g. "c-class". */
  model: string;
  /** Part type URL value: front | rear | diffuser. */
  type: string;
  /** Category key: interior | exterior | lights | parts. */
  category: string;
  offer: boolean;
  /** How many products are shown (?show=48). Grows by SHOW_STEP with each "عرض المزيد". */
  show: number;
};

/** Products shown at first, and added by each "عرض المزيد" click. */
export const SHOW_STEP = 24;

export const EMPTY_FILTERS: ProductFilters = { q: "", model: "", type: "", category: "", offer: false, show: SHOW_STEP };

/** Upper bound for ?show=, so a hand-edited URL can't ask for a huge page. */
const SHOW_MAX = 2400;

/** ?show= value → a multiple of SHOW_STEP between SHOW_STEP and SHOW_MAX (default SHOW_STEP). */
export function parseShow(v: string | string[] | undefined): number {
  const n = Number.parseInt(first(v), 10);
  if (!Number.isFinite(n) || n <= SHOW_STEP) return SHOW_STEP;
  return Math.min(Math.ceil(n / SHOW_STEP) * SHOW_STEP, SHOW_MAX);
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

export function parseFilters(sp: SearchParams): ProductFilters {
  return {
    q: first(sp.q).slice(0, 100),
    model: first(sp.model).toLowerCase(),
    type: first(sp.type).toLowerCase(),
    category: first(sp.category).toLowerCase(),
    offer: first(sp.offer) === "1",
    show: parseShow(sp.show),
  };
}

/** Build a /products URL. Empty values are left out, so links stay short and shareable. */
export function productsHref(f: Partial<ProductFilters> = {}): string {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.model) params.set("model", f.model);
  if (f.type) params.set("type", f.type);
  if (f.category) params.set("category", f.category);
  if (f.offer) params.set("offer", "1");
  // Only when more than the first batch is shown; filter/search links leave it out, so they start over.
  if (f.show && f.show > SHOW_STEP) params.set("show", String(f.show));
  const s = params.toString();
  return s ? `/products?${s}` : "/products";
}

const TYPE_BY_PARAM = Object.fromEntries(
  (Object.entries(PART_TYPE_PARAMS) as [PartType, string][]).map(([type, param]) => [param, type]),
) as Record<string, PartType>;

/** Apply filters (not the page); `ignore` skips one filter (used for per-facet options). */
export function applyFilters(products: Product[], f: ProductFilters, ignore?: keyof ProductFilters): Product[] {
  let list = products;
  if (f.model && ignore !== "model") list = list.filter((p) => p.models.some((m) => m.slug === f.model));
  if (f.type && ignore !== "type") list = list.filter((p) => p.partType === TYPE_BY_PARAM[f.type]);
  if (f.category && ignore !== "category") list = list.filter((p) => p.category === f.category);
  if (f.offer && ignore !== "offer") list = list.filter((p) => p.onOffer);
  if (f.q && ignore !== "q") list = searchProducts(list, f.q);
  return list;
}

export type Facet = { value: string; label: string; count: number };

export type Facets = {
  models: Facet[];
  types: Facet[];
  categories: Facet[];
  offerCount: number;
};

/** Options per model / type / category / offer. Values with 0 products are left out. */
export function getFacets(products: Product[]): Facets {
  const models = new Map<string, Facet>();
  const types = new Map<PartType, number>();
  const categories = new Map<Category, number>();
  let offerCount = 0;

  for (const p of products) {
    for (const pm of p.models) {
      const m = models.get(pm.slug) ?? { value: pm.slug, label: pm.label, count: 0 };
      m.count++;
      models.set(pm.slug, m);
    }
    types.set(p.partType, (types.get(p.partType) ?? 0) + 1);
    categories.set(p.category, (categories.get(p.category) ?? 0) + 1);
    if (p.onOffer) offerCount++;
  }

  return {
    // "… Class" models first (A, C, E …), then the others alphabetically (CLA, CLS, GLA, GLC …). See compareModels.
    models: [...models.values()].sort((a, b) => compareModels(a.label, b.label)),
    // "other" never gets its own option; those parts are found through their category.
    types: (Object.keys(PART_TYPE_LABELS) as Exclude<PartType, "other">[])
      .filter((t) => types.get(t))
      .map((t) => ({ value: PART_TYPE_PARAMS[t], label: PART_TYPE_LABELS[t], count: types.get(t)! })),
    categories: (Object.keys(CATEGORY_LABELS) as Category[])
      .filter((c) => categories.get(c))
      .map((c) => ({ value: c, label: CATEGORY_LABELS[c], count: categories.get(c)! })),
    offerCount,
  };
}

/** Navigation data shared by Navbar / Footer (only things that have products). */
export type NavData = {
  models: Facet[];
  categories: Facet[];
  offerCount: number;
};

export function getNavData(products: Product[]): NavData {
  const f = getFacets(products);
  return { models: f.models, categories: f.categories, offerCount: f.offerCount };
}

export { OFFER_LABEL };
