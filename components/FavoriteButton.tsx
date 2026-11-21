"use client";

import { toggleFavorite, useFavorites } from "@/lib/favorites";

export function HeartIcon({ filled = false, size = 20 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 21.3 12C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/** Heart button: adds / removes the product from the browser's favourites. Colours are set here (idle dark, active white with a red heart, ≥ 3:1); pass size/shape only. */
export default function FavoriteButton({ slug, name, className }: { slug: string; name: string; className: string }) {
  const active = useFavorites().includes(slug);
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(slug)}
      aria-pressed={active}
      aria-label={active ? `إزالة ${name} من المفضلة` : `إضافة ${name} إلى المفضلة`}
      title={active ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      className={[className, active ? "border-white bg-white text-red" : "border-field-line bg-field text-fg hover:border-mist"].join(" ")}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
