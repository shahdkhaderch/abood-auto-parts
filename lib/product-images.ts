import type { Product } from "./catalog";
import { PRODUCT_IMAGES } from "./product-images.generated";
import { cloudinaryImageUrl } from "./site";

type PhotoSource = Pick<Product, "slug" | "imageFiles">;

/**
 * All photos for a product, main image first. Empty → the designed placeholder is used.
 * Priority: Cloudinary files from the sheet (صور مرجعية) → local public/products/<CODE>.jpg.
 */
export function getProductPhotos(product: PhotoSource): string[] {
  if (product.imageFiles.length) return product.imageFiles.map(cloudinaryImageUrl);
  const local = PRODUCT_IMAGES[product.slug.toLowerCase()];
  return local ? [local] : [];
}

/** True when the product shows a real photo (not the placeholder). */
export function hasPhoto(product: PhotoSource): boolean {
  return getProductPhotos(product).length > 0;
}

/**
 * The one shared list order (owner request 2026-11-21): products with a photo first, products without
 * one (placeholder) last. Stable: the order inside each group is kept. "With a photo" = a file in
 * صور مرجعية that exists on Cloudinary (getProducts drops missing ones) or a local photo, i.e. exactly
 * the cards that show a picture. Used by getProducts, applyFilters (after search ranking), favourites and
 * related products, so it survives every filter, search and "load more".
 */
export function photosFirst<T extends PhotoSource>(list: T[]): T[] {
  const withPhoto: T[] = [];
  const without: T[] = [];
  for (const p of list) (hasPhoto(p) ? withPhoto : without).push(p);
  return without.length === 0 ? list : [...withPhoto, ...without];
}

/** The main photo (product card, WhatsApp preview), or null for the placeholder. */
export function getProductPhoto(product: PhotoSource): string | null {
  return getProductPhotos(product)[0] ?? null;
}

export function isRemotePhoto(src: string): boolean {
  return /^https?:\/\//.test(src);
}

