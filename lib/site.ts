// Single source of truth for business/contact details and the public site URL.
// Confirm with the owner before changing any of these values.

export const site = {
  name: "عبود عبد ربه",
  tagline: "قطع مرسيدس",
  whatsappNumber: "972599842238",
  defaultWhatsAppMessage: "مرحبا، بدي استفسر عن قطع مرسيدس.",
  facebookUrl: "https://www.facebook.com/profile.php?id=61575819384981",
  instagramUrl: "https://www.instagram.com/abood_abdrabu_parts/",
  location: "شارع الحسبة - مقابل كازية كنعان",
} as const;

/** Public base URL without a trailing slash, e.g. "https://abood-auto-parts.vercel.app". */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

/** Product photos on Cloudinary. The sheet column "صور مرجعية" holds the file name only. */
export const cloudinaryBaseUrl = "https://res.cloudinary.com/uw678pyp/image/upload";

/** "173-w213-….jpg" → "https://res.cloudinary.com/uw678pyp/image/upload/173-w213-….jpg" (no version number). */
export function cloudinaryImageUrl(fileName: string): string {
  return `${cloudinaryBaseUrl}/${encodeURIComponent(fileName)}`;
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function whatsappLink(message: string = site.defaultWhatsAppMessage): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productPath(slug: string): string {
  return `/products/${slug}`;
}

// The item code is never shown to customers (owner decision), so it is not in the message.
export function productWhatsAppLink(p: { name: string; model: string; slug: string }): string {
  const message = [
    "مرحبا، بدي استفسر عن هالقطعة:",
    p.name,
    `الموديل: ${p.model}`,
    absoluteUrl(productPath(p.slug)),
  ].join("\n");
  return whatsappLink(message);
}
