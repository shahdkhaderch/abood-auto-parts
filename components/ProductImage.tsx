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
    isPage ? "aspect-square rounded-[28px]" : "aspect-[4/3]",
  ].join(" ");

  const placeholder = (
    <div className={`${frame} bg-neutral-950 text-white`} role="img" aria-label={product.name}>
      {/* background glow, matching the hero's dark slide */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(249,115,22,0.35),transparent_45%),radial-gradient(circle_at_10%_95%,rgba(249,115,22,0.18),transparent_40%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-l from-orange-500 to-orange-600" />

      <div className={["relative flex h-full flex-col", isPage ? "p-6 sm:p-8" : "p-3 sm:p-4"].join(" ")}>
        {/* top row: brand + part type */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Image
              src="/abood-logo.png"
              alt=""
              width={isPage ? 48 : 28}
              height={isPage ? 48 : 28}
              className={["shrink-0 rounded-xl object-cover ring-1 ring-white/15", isPage ? "h-12 w-12" : "h-7 w-7"].join(" ")}
            />
            <span className={["truncate font-bold text-white/80", isPage ? "text-sm" : "text-[10px] sm:text-xs"].join(" ")}>{site.name}</span>
          </div>
          <span className={["shrink-0 rounded-full bg-orange-500/15 font-extrabold text-orange-400 ring-1 ring-orange-500/30", isPage ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-[10px] sm:text-xs"].join(" ")}>
            {productLabel(product)}
          </span>
        </div>

        {/* center: icon + model/chassis */}
        <div className="flex flex-1 items-center justify-center gap-3 sm:gap-5">
          <div className={["flex shrink-0 items-center justify-center rounded-2xl bg-white/5 text-orange-500 ring-1 ring-white/10", isPage ? "h-24 w-24 sm:h-28 sm:w-28" : "h-12 w-12 sm:h-14 sm:w-14"].join(" ")}>
            <PartIcon type={product.partType === "other" ? product.category : product.partType} size={isPage ? 72 : 36} />
          </div>
          <div dir="ltr" className="min-w-0 text-left leading-none">
            {product.model && (
              <div className={["truncate font-black tracking-tight", isPage ? "text-4xl sm:text-5xl" : "text-lg sm:text-2xl"].join(" ")}>{product.model}</div>
            )}
            {product.chassis && (
              <div className={["mt-1 font-black tracking-tight text-orange-500", isPage ? "text-3xl sm:text-4xl" : "text-base sm:text-xl"].join(" ")}>{product.chassis}</div>
            )}
          </div>
        </div>

        {/* bottom: product name */}
        <div className={["line-clamp-1 text-center font-bold text-white/70", isPage ? "text-base sm:text-lg" : "text-[10px] sm:text-xs"].join(" ")}>{product.name}</div>
      </div>
    </div>
  );

  if (photos.length === 0) return placeholder;

  // Product page: every photo, as a gallery. Card: the main (first) photo only.
  if (isPage) return <ProductGallery photos={photos} alt={product.name} className={frame} fallback={placeholder} />;

  return (
    <ProductPhoto
      src={photos[0]}
      alt={product.name}
      priority={priority}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
      className={frame}
      fallback={placeholder}
    />
  );
}
