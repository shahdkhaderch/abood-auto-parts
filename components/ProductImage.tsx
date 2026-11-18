import Image from "next/image";
import PartIcon from "@/components/PartIcon";
import ProductGallery from "@/components/ProductGallery";
import ProductPhoto from "@/components/ProductPhoto";
import { tag } from "@/components/ui";
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
    isPage ? "aspect-square rounded-ui border border-line shadow-soft" : "aspect-[4/3]",
  ].join(" ");

  // Light placeholder on the soft surface, so a grid with many photo-less parts stays calm.
  const placeholder = (
    <div className={`${frame} bg-soft text-ink`} role="img" aria-label={product.name}>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-accent" />

      <div className={["relative flex h-full flex-col", isPage ? "p-6 sm:p-8" : "p-3 sm:p-4"].join(" ")}>
        {/* top row: brand (+ label on the product page) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src="/abood-mark.png"
              alt=""
              width={isPage ? 48 : 28}
              height={isPage ? 48 : 28}
              className={["shrink-0 object-contain", isPage ? "h-12 w-12" : "h-7 w-7"].join(" ")}
            />
            <span className={["truncate font-medium text-ink-soft", isPage ? "text-base" : "hidden text-sm sm:inline"].join(" ")}>{site.name}</span>
          </div>
          {isPage && <span className={tag}>{productLabel(product)}</span>}
        </div>

        {/* center: icon + model/chassis */}
        <div className="flex flex-1 items-center justify-center gap-3 sm:gap-4">
          <div className={["flex shrink-0 items-center justify-center rounded-ui border border-line bg-card text-accent-hover shadow-soft", isPage ? "h-24 w-24 sm:h-28 sm:w-28" : "h-12 w-12 sm:h-14 sm:w-14"].join(" ")}>
            <PartIcon type={product.partType === "other" ? product.category : product.partType} size={isPage ? 72 : 32} strokeWidth={2.5} />
          </div>
          <div dir="ltr" className="min-w-0 text-left leading-tight">
            {product.model && (
              <div className={["truncate font-bold tracking-tight text-ink", isPage ? "text-4xl sm:text-5xl" : "text-base sm:text-xl"].join(" ")}>{product.model}</div>
            )}
            {product.chassis && (
              <div className={["mt-1 inline-block rounded-ui bg-accent-tint font-bold tracking-tight text-ink", isPage ? "px-3 text-3xl sm:text-4xl" : "px-2 text-sm sm:text-base"].join(" ")}>{product.chassis}</div>
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
