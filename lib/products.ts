// The only place the app reads product data from. Use getProducts() / getProductBySlug().
// Source: a published Google Sheet CSV (PRODUCTS_CSV_URL), cached and refreshed every 5 minutes.

import { cache } from "react";
import { csvToProducts, type Product } from "./catalog";
import { withExistingImages } from "./image-check";
import { photosFirst } from "./product-images";

export type { Product, PartType } from "./catalog";
export { PART_TYPE_LABELS } from "./catalog";

/** Seconds between sheet refreshes. Keep in sync with `revalidate` in the route files. */
export const PRODUCTS_REVALIDATE_SECONDS = 300;

export const getProducts = cache(async (): Promise<Product[]> => {
  const url = process.env.PRODUCTS_CSV_URL?.trim();
  if (!url) {
    // In production a missing variable is a configuration error: fail the build (or the
    // background refresh) loudly instead of deploying/caching an empty catalogue.
    if (process.env.NODE_ENV === "production") {
      throw new Error("[products] PRODUCTS_CSV_URL is not set. Add it in Vercel → Settings → Environment Variables and redeploy.");
    }
    console.warn("[products] PRODUCTS_CSV_URL is not set; showing an empty catalogue (development only).");
    return [];
  }

  // Errors are thrown on purpose: during a background refresh Next.js then keeps
  // serving the last good page instead of caching an empty catalogue.
  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: PRODUCTS_REVALIDATE_SECONDS, tags: ["products"] } });
  } catch (err) {
    throw new Error(`[products] CSV fetch failed: ${err instanceof Error ? err.message : String(err)}`);
  }
  if (!res.ok) throw new Error(`[products] CSV fetch failed: ${res.status} ${res.statusText}`);

  const text = await res.text();
  // A sign-in page or error page instead of the published CSV (sheet unpublished / wrong link).
  if (/^\s*</.test(text)) throw new Error("[products] CSV URL returned HTML, not CSV. Is the sheet still published as CSV?");

  const { products, warnings } = csvToProducts(text);
  for (const w of warnings) console.warn(`[products] ${w}`);
  if (products.length === 0) throw new Error("[products] CSV has no products; keeping the last good data.");
  // Photos listed in the sheet but not on Cloudinary (yet) are dropped → designed placeholder.
  // Then products with a photo first, photo-less last (sheet order inside each group).
  return photosFirst(await withExistingImages(products));
});

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  const key = slug.toLowerCase();
  return products.find((p) => p.slug === key);
}
