import type { Product } from "./catalog";
import { PRODUCT_IMAGES } from "./product-images.generated";
import { absoluteUrl, cloudinaryBaseUrl, cloudinaryImageUrl } from "./site";

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


/** Link-preview image for products without a photo (absolute URL in the metadata). */
const DEFAULT_SHARE_IMAGE = { path: "/hero/hero-main.jpg", width: 1672, height: 941 };

/**
 * og:image / twitter:image for a product page (WhatsApp link preview). An absolute https URL straight to a
 * CDN file, small and fast, so WhatsApp's crawler always gets it (it skips images over ~300 KB or slow ones):
 * - main photo on Cloudinary, transformed to a 1200×630 JPG padded on white (whole part visible, ~30–100 KB);
 * - a local public/products photo, as is;
 * - no photo: the homepage hero image.
 */
export function productShareImage(product: PhotoSource): { url: string; width: number; height: number; type: string } {
  const file = product.imageFiles[0];
  if (file) {
    return { url: `${cloudinaryBaseUrl}/w_1200,h_630,c_pad,b_white,q_auto,f_jpg/${encodeURIComponent(file)}`, width: 1200, height: 630, type: "image/jpeg" };
  }
  const local = PRODUCT_IMAGES[product.slug.toLowerCase()];
  if (local) return { url: absoluteUrl(local), width: 1200, height: 1200, type: "image/jpeg" };
  return { url: absoluteUrl(DEFAULT_SHARE_IMAGE.path), width: DEFAULT_SHARE_IMAGE.width, height: DEFAULT_SHARE_IMAGE.height, type: "image/jpeg" };
}
