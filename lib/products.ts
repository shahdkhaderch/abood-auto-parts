// The only place the app reads product data from. Use getProducts() / getProductBySlug().
// Source: a published Google Sheet CSV (PRODUCTS_CSV_URL), cached and refreshed every 5 minutes.

import { cache } from "react";
import { csvToProducts, type Product } from "./catalog";
import { withExistingImages } from "./image-check";

export type { Product, PartType } from "./catalog";
export { PART_TYPE_LABELS } from "./catalog";

/** Seconds between sheet refreshes. Keep in sync with `revalidate` in the route files. */
export const PRODUCTS_REVALIDATE_SECONDS = 300;

export const getProducts = cache(async (): Promise<Product[]> => {
  const url = process.env.PRODUCTS_CSV_URL;
  if (!url) {
    console.warn("[products] PRODUCTS_CSV_URL is not set; showing an empty catalogue.");
    return [];
  }

  // Errors are thrown on purpose: during a background refresh Next.js then keeps
  // serving the last good page instead of caching an empty catalogue.
  const res = await fetch(url, { next: { revalidate: PRODUCTS_REVALIDATE_SECONDS, tags: ["products"] } });
  if (!res.ok) throw new Error(`[products] CSV fetch failed: ${res.status} ${res.statusText}`);

  const { products, warnings } = csvToProducts(await res.text());
  for (const w of warnings) console.warn(`[products] ${w}`);
  // Photos listed in the sheet but not on Cloudinary (yet) are dropped → designed placeholder.
  return withExistingImages(products);
});

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  const key = slug.toLowerCase();
  return products.find((p) => p.slug === key);
}
