// Lifestyle images in /public used by the homepage sections (not product photos).
// Pure data: no Next.js imports. Replace a file under the same name to change an image.

import type { Category } from "./catalog";

/** Category card images, matched to our categories by meaning. */
export const CATEGORY_PHOTOS: Record<Category, string> = {
  lights: "/categories/headlights.jpg", // أضوية (complete lights)
  emblems: "/categories/turn-signals.jpg", // إشارات (indicators / small lights)
  "light-parts": "/categories/headlight-parts.jpg", // قطع الأضوية (light repair parts)
  parts: "/categories/body-parts.jpg", // قطع بودي وغيار
  exterior: "/categories/exterior-accessories.jpg", // كماليات خارجية
  interior: "/categories/interior-accessories.jpg", // كماليات داخلية
};

/** Model card images, keyed by model slug (modelToSlug of the الموديل value: "M/ML Class" → "m-ml-class").
 * All are shown object-cover / centred in the 4:3 card (clk.jpg and vito.jpg are portrait and get cropped the same way). */
export const MODEL_PHOTOS: Record<string, string> = {
  "a-class": "/models/a-class.jpg",
  "c-class": "/models/c-class.jpg",
  "e-class": "/models/e-class.jpg",
  "g-class": "/models/g-class.jpg",
  "m-ml-class": "/models/m-class.jpg",
  "s-class": "/models/s-class.jpg",
  cla: "/models/cla.jpg",
  clk: "/models/clk.jpg",
  cls: "/models/cls.jpg",
  gla: "/models/gla.jpg",
  glc: "/models/glc.jpg",
  gle: "/models/gle.jpg",
  glk: "/models/glk.jpg",
  vito: "/models/vito.jpg",
};

/** Other homepage images. */
export const SECTION_PHOTOS = {
  why: "/models/s-class.jpg", // "لماذا تختارنا؟" side image
  banner: "/categories/body-parts.jpg", // bottom banner
} as const;
