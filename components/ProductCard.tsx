import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import ProductImage from "@/components/ProductImage";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { badge, btnPrimaryCard, card } from "@/components/ui";
import { productLines, type Product } from "@/lib/catalog";
import { productPath, productWhatsAppLink } from "@/lib/site";

/** Thin outline three-pointed star in a circle: small decorative hint that the parts are for Mercedes. */
function StarMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 h-7 w-7 shrink-0 text-mist-card opacity-70">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1" />
      <path d="M12 1.5 13.91 10.9 21.09 17.25 12 14.2 2.91 17.25 10.09 10.9Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Product card: square light image area, then three lines parsed from the name (model tokens as written in the name, Arabic part
 * name, years — a missing one is skipped), a small outline star beside them, and the buttons row (white WhatsApp pill + favourite heart). Every line is clamped to
 * one line and the details block has a fixed min-height; cards stretch to the row height with the buttons pinned to the bottom.
 * Works in server and client trees (the favourites page renders it on the client).
 */
export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  // Same three lines as the WhatsApp message (lib/catalog.ts productLines): never the item code.
  const parsed = productLines(product);
  const model = parsed.model;

  return (
    <article className={`group relative flex h-full flex-col p-1.5 sm:p-3 ${card} transition duration-300 hover:-translate-y-1 hover:border-mist/50 active:scale-[0.98] active:border-mist motion-reduce:hover:translate-y-0`}>
      {/* The link stretches over the whole card (after:inset-0); the WhatsApp and heart buttons sit above it. */}
      <Link href={productPath(product)} className="flex flex-col after:absolute after:inset-0 after:z-0 after:rounded-card after:content-['']" aria-label={product.name}>
        <ProductImage product={product} priority={priority} />

        {/* Fixed height for three lines, so a card with fewer lines keeps the same rhythm. */}
        <div className="flex min-h-[4.75rem] items-start gap-2 px-1 pt-3 sm:min-h-[5.25rem] sm:px-1.5">
          <div className="min-w-0 flex-1">
            {model && (
              <p dir="ltr" className="truncate text-right text-base font-extrabold leading-6 text-fg sm:text-xl sm:leading-7">
                {model}
              </p>
            )}
            {parsed.part && <p className="truncate text-sm leading-6 text-fg/90 sm:text-base">{parsed.part}</p>}
            {parsed.years && (
              <p className="flex items-center gap-1.5 text-xs leading-5 text-mist-card sm:text-sm">
                <CalendarIcon />
                <span dir="ltr" className="truncate">{parsed.years}</span>
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <StarMark />
            {product.onOffer && <span className={badge}>عرض</span>}
          </div>
        </div>
      </Link>


      <div className="relative z-10 mt-auto flex items-center gap-1.5 pt-3 sm:gap-2 sm:pt-4">
        <a href={productWhatsAppLink(product)} target="_blank" rel="noreferrer" className={btnPrimaryCard}>
          <WhatsAppIcon size={16} />
          استفسر واتساب
        </a>
        <FavoriteButton slug={product.slug} name={product.name} className="inline-flex h-10 w-9 shrink-0 items-center justify-center rounded-ui border transition max-[374px]:w-8 sm:h-11 sm:w-11" />
      </div>
    </article>
  );
}
