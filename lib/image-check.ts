// Drops Cloudinary photos that don't exist yet, so no broken image is ever shown.
// The sheet lists a file name for (almost) every product, including photos not uploaded yet.
//
// Each photo URL gets a HEAD request. The result is cached for PRODUCTS_REVALIDATE_SECONDS
// (same 5 minutes as the sheet, tag "products"). unstable_cache is used rather than fetch's own
// cache because Next only caches 200 responses: a 404 would otherwise be re-checked on every render.

import { unstable_cache } from "next/cache";
import type { Product } from "./catalog";
import { cloudinaryImageUrl } from "./site";

const CONCURRENCY = 16;
const TIMEOUT_MS = 8000;
const REVALIDATE_SECONDS = 300; // keep in sync with PRODUCTS_REVALIDATE_SECONDS in lib/products.ts

/** HEAD status, or 0 on a network error / timeout. */
async function headStatus(url: string): Promise<number> {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(TIMEOUT_MS) });
    return res.status;
  } catch {
    return 0;
  }
}

/**
 * File names that Cloudinary answers with 404/410. Anything else (200, or an error/timeout/5xx)
 * counts as present: a temporary Cloudinary problem must not hide every photo, and the site still
 * swaps in the placeholder on the client if an image then fails to load.
 */
async function findMissingFiles(fileNames: string[]): Promise<string[]> {
  const missing: string[] = [];
  const queue = [...fileNames];
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let file = queue.shift(); file !== undefined; file = queue.shift()) {
        const status = await headStatus(cloudinaryImageUrl(file));
        if (status === 404 || status === 410) missing.push(file);
      }
    }),
  );
  return missing.sort();
}

// The sorted list of file names is the cache key, so a sheet change (new names) re-checks.
const cachedMissingFiles = unstable_cache(findMissingFiles, ["cloudinary-missing-files-v1"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["products"],
});

// Share one check between concurrent renders in the same server process.
const inFlight = new Map<string, Promise<string[]>>();

async function missingFiles(fileNames: string[]): Promise<Set<string>> {
  const key = fileNames.join("\n");
  let p = inFlight.get(key);
  if (!p) {
    p = cachedMissingFiles(fileNames).finally(() => inFlight.delete(key));
    inFlight.set(key, p);
  }
  return new Set(await p);
}

/** Products with every missing Cloudinary photo removed from imageFiles. */
export async function withExistingImages(products: Product[]): Promise<Product[]> {
  const all = [...new Set(products.flatMap((p) => p.imageFiles))].sort();
  if (all.length === 0) return products;
  const missing = await missingFiles(all);
  if (missing.size === 0) return products;
  return products.map((p) => (p.imageFiles.some((f) => missing.has(f)) ? { ...p, imageFiles: p.imageFiles.filter((f) => !missing.has(f)) } : p));
}
