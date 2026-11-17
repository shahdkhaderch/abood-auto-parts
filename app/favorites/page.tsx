import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "المفضلة | عبود عبد ربه" };

// Placeholder: favorites (browser storage, no accounts) is planned but not implemented yet.
export default function FavoritesPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white px-4 py-16">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 21.3 12C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-black text-neutral-950">المفضلة قريباً</h1>
        <p className="mt-2 text-sm leading-7 text-neutral-500">قريباً بتقدر تحفظ القطع اللي بتعجبك وترجعلها بسهولة.</p>
        <Link href="/products" className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-orange-600 px-5 text-sm font-extrabold text-white hover:bg-orange-700 transition">
          تصفح القطع
        </Link>
      </div>
    </main>
  );
}
