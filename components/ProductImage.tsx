import Image from "next/image";
import PartIcon from "@/components/PartIcon";
import ProductGallery from "@/components/ProductGallery";
import ProductPhoto from "@/components/ProductPhoto";
import { productLabel, type Product } from "@/lib/catalog";
import { getProductPhotos } from "@/lib/product-images";
import { site } from "@/lib/site";

type Props = {
  product: Product;
  variant?: "card" | "page";
  priority?: boolean;
};

/** Cloudinary photos from the sheet (or a local one) if present, otherwise a designed placeholder. */
export default function ProductImage({ product, variant = "card", priority = false }: Props) {
  const photos = getProductPhotos(product);
  const isPage = variant === "page";
  const frame = [
    "relative w-full overflow-hidden",
    isPage ? "aspect-square rounded-xl border border-line" : "aspect-[4/3]",
  ].join(" ");

  // Light placeholder so a grid with many photo-less parts stays calm to browse.
  const placeholder = (
    <div className={`${frame} bg-surface text-ink`} role="img" aria-label={product.name}>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-accent" />

      <div className={["relative flex h-full flex-col", isPage ? "p-6 sm:p-8" : "p-3 sm:p-4"].join(" ")}>
        {/* top row: brand + part type */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src="/abood-logo.png"
              alt=""
              width={isPage ? 48 : 24}
              height={isPage ? 48 : 24}
              className={["shrink-0 rounded-lg object-cover", isPage ? "h-12 w-12" : "h-6 w-6"].join(" ")}
            />
            <span className={["truncate font-medium text-ink-soft", isPage ? "text-base" : "hidden text-sm sm:inline"].join(" ")}>{site.name}</span>
          </div>
          {isPage && (
            <span className="shrink-0 rounded-md bg-card px-3 py-1 text-sm font-bold text-ink-soft ring-1 ring-line">{productLabel(product)}</span>
          )}
        </div>

        {/* center: icon + model/chassis */}
        <div className="flex flex-1 items-center justify-center gap-3 sm:gap-4">
          <div className={["flex shrink-0 items-center justify-center rounded-xl bg-card text-accent-text ring-1 ring-line", isPage ? "h-24 w-24 sm:h-28 sm:w-28" : "h-12 w-12 sm:h-14 sm:w-14"].join(" ")}>
            <PartIcon type={product.partType === "other" ? product.category : product.partType} size={isPage ? 72 : 32} strokeWidth={2.5} />
          </div>
          <div dir="ltr" className="min-w-0 text-left leading-tight">
            {product.model && (
              <div className={["truncate font-bold tracking-tight text-ink", isPage ? "text-4xl sm:text-5xl" : "text-base sm:text-xl"].join(" ")}>{product.model}</div>
            )}
            {product.chassis && (
              <div className={["font-bold tracking-tight text-accent-text", isPage ? "mt-1 text-3xl sm:text-4xl" : "text-sm sm:text-lg"].join(" ")}>{product.chassis}</div>
            )}
          </div>
        </div>

        {/* bottom: product name (page only; the card shows it underneath) */}
        {isPage && <div className="line-clamp-1 text-center text-lg font-medium text-ink-soft">{product.name}</div>}
      </div>
    </div>
  );

  if (photos.length === 0) return placeholder;

  // Product page: every photo, as a gallery. Card: the main (first) photo, second on hover.
  if (isPage) return <ProductGallery photos={photos} alt={product.name} className={frame} fallback={placeholder} />;

  return (
    <ProductPhoto
      src={photos[0]}
      hoverSrc={photos[1]}
      alt={product.name}
      priority={priority}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
      className={frame}
      fallback={placeholder}
    />
  );
}
