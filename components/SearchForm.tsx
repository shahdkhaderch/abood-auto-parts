"use client";

import Form from "next/form";
import { usePathname, useSearchParams } from "next/navigation";
import { input } from "@/components/ui";

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Dark pill search box: GET form to /products?q=…  The magnifier is the submit button
 * (Enter / the keyboard's search key also submit). Works without JavaScript.
 */
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
        placeholder="ابحث عن قطعة..."
        className={`${input} pr-12 pl-4`}
      />
      <button
        type="submit"
        aria-label="بحث"
        className="absolute inset-y-1 right-1 flex w-10 items-center justify-center rounded-full text-mist transition hover:text-fg"
      >
        <IconSearch />
      </button>
    </Form>
  );
}
