import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { Product } from "@/lib/catalog";
import { productPath, productWhatsAppLink } from "@/lib/site";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-orange-300 hover:shadow-md">
      <Link href={productPath(product.slug)} className="relative flex flex-1 flex-col">
        <ProductImage product={product} priority={priority} />
        {product.onOffer && (
          <span className="absolute bottom-3 left-3 rounded-full bg-orange-600 px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow">عرض</span>
        )}
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <h3 className="line-clamp-2 text-sm font-extrabold leading-6 text-neutral-900 group-hover:text-orange-600 transition">{product.name}</h3>
          <div className="mt-auto flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-neutral-500">
            {product.models.map((m) => (
              <span key={m.slug} dir="ltr" className="rounded-lg bg-orange-50 px-2 py-0.5 text-orange-700">{m.label}</span>
            ))}
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <a
          href={productWhatsAppLink(product)}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 text-sm font-extrabold text-white transition hover:bg-orange-700 active:scale-[0.98]"
        >
          <WhatsAppIcon />
          استفسر واتساب
        </a>
      </div>
    </article>
  );
}
