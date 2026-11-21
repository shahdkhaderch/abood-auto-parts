import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { tile } from "@/components/ui";

export type BrowseItem = {
  href: string;
  label: string;
  /** Lifestyle image (object-cover). Without one, `fallback` is shown on a white area. */
  image?: string;
  fallback?: ReactNode;
  /** Latin labels (model names) read left-to-right. */
  ltr?: boolean;
};

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Row of dark browse cards (categories, models): image on top, name bottom-right, small round
 * chevron button bottom-left. Scrolls sideways on phones; a grid from 768px (`gridCols` sets the columns).
 */
export default function BrowseCards({ items, gridCols, sizes, eager = false }: { items: BrowseItem[]; gridCols: string; sizes: string; eager?: boolean }) {
  // eager: the first row just under the hero (categories). Loaded right away, and the intro overlay waits for them
  // (data-intro-wait, see IntroSplash), so they are already there when the site appears. Other rows stay lazy.
  return (
    <div className={`-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:gap-4 md:mx-0 md:grid md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden ${gridCols}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          prefetch={false}
          className={`${tile} group flex w-[42%] shrink-0 snap-start flex-col p-2.5 transition duration-300 hover:-translate-y-1 hover:border-mist/40 active:scale-[0.97] active:border-mist sm:w-[30%] md:w-auto`}
        >
          <div className={["relative aspect-[4/3] overflow-hidden rounded-[10px]", item.image ? "bg-header" : "bg-white"].join(" ")}>
            {item.image ? (
              <Image src={item.image} alt="" fill sizes={sizes} loading={eager ? "eager" : "lazy"} data-intro-wait={eager ? "" : undefined} className="object-cover object-center transition duration-500 group-hover:scale-105" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink">{item.fallback}</div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 px-1 pb-0.5 pt-3">
            <span dir={item.ltr ? "ltr" : undefined} className="text-sm font-bold leading-snug text-fg lg:text-[15px]">{item.label}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-field-line bg-field text-fg transition group-hover:bg-white group-hover:text-ink">
              <Chevron />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
