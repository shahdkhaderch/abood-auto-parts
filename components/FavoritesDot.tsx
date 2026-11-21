"use client";

import { useFavorites } from "@/lib/favorites";

/** Small red dot on the favourites icon while something is saved. A dot, never a number (decision 5). */
export default function FavoritesDot({ className = "" }: { className?: string }) {
  const has = useFavorites().length > 0;
  if (!has) return null;
  return <span aria-hidden="true" data-testid="fav-dot" className={`pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-red ring-2 ring-header ${className}`} />;
}
