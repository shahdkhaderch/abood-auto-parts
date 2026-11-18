"use client";

import Form from "next/form";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  /** Keep the current model/type/category/offer filters (used on /products). */
  keepFilters?: boolean;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  className?: string;
};

const FILTER_KEYS = ["model", "type", "category", "offer"] as const;

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** GET form to /products?q=…  Works without JavaScript; with it, navigates client-side. */
export default function SearchForm({ keepFilters = false, autoFocus = false, onSubmitted, className = "" }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();
  const onProducts = pathname === "/products";
  const q = onProducts ? params.get("q") ?? "" : "";

  return (
    <Form action="/products" role="search" onSubmit={() => onSubmitted?.()} className={`relative ${className}`}>
      {keepFilters &&
        FILTER_KEYS.map((k) => {
          const v = params.get(k);
          return v ? <input key={k} type="hidden" name={k} value={v} /> : null;
        })}
      <label htmlFor={keepFilters ? "search-page" : undefined} className="sr-only">
        بحث عن قطعة
      </label>
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-ink-soft">
        <IconSearch />
      </div>
      <input
        // Re-mount when the URL's q changes so the box shows the current search.
        key={q}
        id={keepFilters ? "search-page" : undefined}
        type="search"
        name="q"
        defaultValue={q}
        autoFocus={autoFocus}
        enterKeyHint="search"
        autoComplete="off"
        placeholder="ابحث باسم القطعة أو الموديل..."
        className="h-11 w-full rounded-xl border border-line bg-card pr-10 pl-20 text-base text-ink outline-none transition placeholder:text-ink-soft focus:border-accent focus:ring-2 focus:ring-accent-ring"
      />
      <button
        type="submit"
        className="absolute inset-y-1 left-1 rounded-lg bg-accent px-4 text-sm font-bold text-card transition hover:bg-accent-hover"
      >
        بحث
      </button>
    </Form>
  );
}
