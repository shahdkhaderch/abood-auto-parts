"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/FavoriteButton";
import ProductCard from "@/components/ProductCard";
import { btnPrimary } from "@/components/ui";
import type { Product } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";
import { photosFirst } from "@/lib/product-images";

/** The favourited products (newest first, photo-less ones last). Slugs no longer in the sheet are skipped silently. */
export default function FavoritesList({ products }: { products: Product[] }) {
  const slugs = useFavorites();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const list = photosFirst(slugs.map((s) => bySlug.get(s)).filter((p): p is Product => !!p));

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-sm py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-field-line bg-field text-fg">
          <HeartIcon size={28} />
        </div>
        <p className="mt-4 text-xl font-extrabold text-fg">ما في قطع بالمفضلة لسا</p>
        <p className="mt-2 text-base text-mist">اضغط على القلب بأي قطعة عشان تحفظها هون وترجعلها بسهولة.</p>
        <Link href="/products" className={`${btnPrimary} mt-6`}>
          تصفح القطع
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      {list.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
