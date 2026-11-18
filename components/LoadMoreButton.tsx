"use client";

import Link, { useLinkStatus } from "next/link";
import { btnSecondary } from "@/components/ui";

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
    <div className="mt-8 flex justify-center">
      <Link
        href={href}
        replace
        scroll={false}
        prefetch={false}
        className={`${btnSecondary} min-w-48 shadow-soft`}
      >
        <Label />
      </Link>
    </div>
  );
}
