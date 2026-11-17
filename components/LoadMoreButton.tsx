"use client";

import Link, { useLinkStatus } from "next/link";

function Label() {
  const { pending } = useLinkStatus();
  return <span aria-live="polite">{pending ? "جاري التحميل…" : "عرض المزيد"}</span>;
}

/**
 * "عرض المزيد": a link to the same list with ?show= raised by one batch. It replaces the
 * history entry (so Back leaves the list instead of un-loading it) and keeps the scroll position.
 * The loaded amount stays in the URL, so opening a product and coming back keeps the place.
 * Works without JavaScript too.
 */
export default function LoadMoreButton({ href }: { href: string }) {
  return (
    <div className="mt-6 flex justify-center">
      <Link
        href={href}
        replace
        scroll={false}
        prefetch={false}
        className="inline-flex h-12 min-w-44 items-center justify-center rounded-2xl border-2 border-orange-600 px-8 text-sm font-extrabold text-orange-700 transition hover:bg-orange-600 hover:text-white"
      >
        <Label />
      </Link>
    </div>
  );
}
