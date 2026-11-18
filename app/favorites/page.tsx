import type { Metadata } from "next";
import Link from "next/link";
import { btnPrimary } from "@/components/ui";

export const metadata: Metadata = { title: "المفضلة | عبود عبد ربه" };

// Placeholder: favorites (browser storage, no accounts) is planned but not implemented yet.
export default function FavoritesPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-page px-4 py-16">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-ui border border-line bg-accent-tint text-ink">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21s-7-4.6-9.3-9A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 21.3 12C19 16.4 12 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-ink">المفضلة قريباً</h1>
        <p className="mt-2 text-base text-ink-soft">قريباً بتقدر تحفظ القطع اللي بتعجبك وترجعلها بسهولة.</p>
        <Link href="/products" className={`${btnPrimary} mt-6`}>
          تصفح القطع
        </Link>
      </div>
    </main>
  );
}
