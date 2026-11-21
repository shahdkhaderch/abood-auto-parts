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

/** The main photo (product card, WhatsApp preview), or null for the placeholder. */
export function getProductPhoto(product: PhotoSource): string | null {
  return getProductPhotos(product)[0] ?? null;
}

export function isRemotePhoto(src: string): boolean {
  return /^https?:\/\//.test(src);
}

