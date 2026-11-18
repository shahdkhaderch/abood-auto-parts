import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { productLabel, type Product } from "@/lib/catalog";
import { productPath, productWhatsAppLink } from "@/lib/site";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0">
      <Link href={productPath(product.slug)} className="relative flex flex-1 flex-col">
        <ProductImage product={product} priority={priority} />
        {product.onOffer && (
          <span className="absolute bottom-2 left-2 rounded-md bg-accent px-2 py-0.5 text-sm font-bold text-card shadow-sm">عرض</span>
        )}
        <div className="flex flex-1 flex-col gap-2 border-t border-line p-3 sm:p-4">
          <span className="w-fit rounded-md bg-surface px-2 py-0.5 text-sm font-medium leading-6 text-ink-soft">{productLabel(product)}</span>
          <h3 className="line-clamp-2 min-h-[3.4em] text-base font-bold leading-[1.7] text-ink transition group-hover:text-accent-text">{product.name}</h3>
          {product.models.length > 0 && (
            <div className="mt-auto flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
              {product.models.map((m) => (
                <span key={m.slug} dir="ltr">{m.label}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <a
          href={productWhatsAppLink(product)}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-whatsapp text-sm font-bold text-ink transition hover:bg-whatsapp-hover active:scale-[0.98] sm:text-base"
        >
          <WhatsAppIcon />
          استفسر واتساب
        </a>
      </div>
    </article>
  );
}
