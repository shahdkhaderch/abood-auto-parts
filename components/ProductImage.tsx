import Image from "next/image";
import PartIcon from "@/components/PartIcon";
import ProductGallery from "@/components/ProductGallery";
import ProductPhoto from "@/components/ProductPhoto";
import type { Product } from "@/lib/catalog";
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
  // Square light grey area (#F1F3F6) on cards and the product page: the catalogue photos are square, so nothing is cropped.
  const frame = isPage ? "relative w-full overflow-hidden aspect-square rounded-ui bg-photo" : "relative w-full overflow-hidden aspect-square rounded-photo bg-photo";

  // Card without a photo: only the part icon, centred (the model and name are under the image).
  const cardPlaceholder = (
    <div className={`${frame} flex items-center justify-center text-ink-soft`} role="img" aria-label={product.name}>
      <PartIcon type={product.partType === "other" ? product.category : product.partType} size={56} strokeWidth={2} />
    </div>
  );
  if (!isPage && photos.length === 0) return cardPlaceholder;

  // Light placeholder on the same rounded area as the photos, so photo-less cards keep the rhythm.
  const placeholder = (
    <div className={`${frame} text-ink`} role="img" aria-label={product.name}>
      <div className={["relative flex h-full flex-col", isPage ? "p-6 sm:p-8" : "p-3 sm:p-4"].join(" ")}>
        <div className="flex items-center gap-2">
          <Image
            src="/abood-mark.png"
            alt=""
            width={isPage ? 48 : 28}
            height={isPage ? 48 : 28}
            className={["shrink-0 object-contain", isPage ? "h-12 w-12" : "h-7 w-7"].join(" ")}
          />
          <span className={["truncate font-medium text-ink-soft", isPage ? "text-base" : "hidden text-xs sm:inline"].join(" ")}>{site.name}</span>
        </div>

        {/* center: icon + model (the chassis is never shown as a separate field) */}
        <div className="flex flex-1 items-center justify-center gap-3 sm:gap-4">
          <div className={["flex shrink-0 items-center justify-center rounded-ui border border-ink/10 bg-white text-ink shadow-soft", isPage ? "h-24 w-24 sm:h-28 sm:w-28" : "h-12 w-12 sm:h-14 sm:w-14"].join(" ")}>
            <PartIcon type={product.partType === "other" ? product.category : product.partType} size={isPage ? 72 : 32} strokeWidth={2.2} />
          </div>
          <div dir="ltr" className="min-w-0 text-left leading-tight">
            {product.model && (
              <div className={["truncate font-extrabold tracking-tight text-ink", isPage ? "text-4xl sm:text-5xl" : "text-base sm:text-xl"].join(" ")}>{product.model}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (photos.length === 0) return placeholder;

  // Product page: every photo, as a gallery. Card: the main photo; others on hover / rotating on touch.
  if (isPage) return <ProductGallery photos={photos} alt={product.name} className={frame} fallback={placeholder} />;

  return (
    <ProductPhoto
      photos={photos}
      alt={product.name}
      priority={priority}
      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
      className={frame}
      fallback={cardPlaceholder}
    />
  );
}
