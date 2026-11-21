import type { Metadata } from "next";
import FavoritesList from "@/components/FavoritesList";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "المفضلة | عبود عبد ربه" };
export const revalidate = 300;

// Favourites live in this browser only (lib/favorites.ts); the list is picked on the client from the catalogue.
export default async function FavoritesPage() {
  const products = await getProducts();
  return (
    <main className="min-h-[60vh] bg-page px-4 py-8 sm:py-12 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-extrabold text-fg sm:text-3xl">المفضلة</h1>
        <FavoritesList products={products} />
      </div>
    </main>
  );
}
