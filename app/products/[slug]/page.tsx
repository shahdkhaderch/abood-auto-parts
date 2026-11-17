import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { CATEGORY_LABELS, PART_TYPE_LABELS, productLabel, type Product } from "@/lib/catalog";
import { OFFER_LABEL, productsHref } from "@/lib/filters";
import { getProductBySlug, getProducts } from "@/lib/products";
import { productPath, productWhatsAppLink, site } from "@/lib/site";

// Refresh the sheet data every 5 minutes. New codes added to the sheet are rendered on first visit.
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

// The item code is never shown to visitors (it stays in the URL and the WhatsApp message only).
function describe(p: Product) {
  return [productLabel(p), p.model && `Mercedes ${p.model}${p.chassis ? ` ${p.chassis}` : ""}`, "استفسر عبر واتساب"]
    .filter(Boolean)
    .join(" · ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "القطعة غير موجودة" };

  const title = `${product.name} | ${site.name}`;
  const description = describe(product);
  return {
    title,
    description,
    alternates: { canonical: productPath(product.slug) },
    // og:image comes from ./opengraph-image.tsx
    openGraph: { type: "website", title, description, url: productPath(product.slug), siteName: site.name, locale: "ar_PS" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Model / category link to the matching filtered /products page. No item code here.
  type Value = { text: string; href?: string };
  const details: { label: string; values: Value[]; ltr?: boolean }[] = [
    { label: "الماركة", values: [{ text: "Mercedes-Benz" }], ltr: true },
    { label: "الموديل", values: product.models.map((m) => ({ text: m.label, href: productsHref({ model: m.slug }) })), ltr: true },
    { label: "الشاصي", values: product.chassis ? [{ text: product.chassis }] : [], ltr: true },
    {
      label: "نوع القطعة",
      values: product.partType === "other" ? [] : [{ text: PART_TYPE_LABELS[product.partType] }],
    },
    { label: "القسم", values: [{ text: CATEGORY_LABELS[product.category], href: productsHref({ category: product.category }) }] },
  ].filter((d) => d.values.length > 0);

  return (
    <main className="min-h-screen bg-white px-4 py-6 pb-28 sm:px-6 sm:py-10 sm:pb-10">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="مسار التنقل" className="mb-5 flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-orange-600 transition">الرئيسية</Link>
          <span aria-hidden="true">‹</span>
          <Link href="/products" className="hover:text-orange-600 transition">القطع</Link>
          <span aria-hidden="true">‹</span>
          <span className="truncate font-semibold text-neutral-800">{productLabel(product)}</span>
        </nav>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-10">
          <ProductImage product={product} variant="page" priority />

          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold text-orange-700">
                {productLabel(product)}
              </span>
              {product.onOffer && (
                <Link href={productsHref({ offer: true })} className="inline-flex w-fit rounded-full bg-orange-600 px-3 py-1 text-xs font-extrabold text-white">
                  {OFFER_LABEL}
                </Link>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-black leading-snug text-neutral-950 sm:text-4xl">{product.name}</h1>

            <dl className="mt-6 divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200">
              {details.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-neutral-500">{d.label}</dt>
                  <dd dir={d.ltr ? "ltr" : undefined} className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-sm font-extrabold text-neutral-900">
                    {d.values.map((v) =>
                      v.href ? (
                        <Link key={v.text} href={v.href} className="text-orange-700 underline decoration-orange-300 underline-offset-4 hover:text-orange-800">
                          {v.text}
                        </Link>
                      ) : (
                        <span key={v.text}>{v.text}</span>
                      ),
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href={productWhatsAppLink(product)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-orange-600 text-lg font-black text-white shadow-[0_12px_30px_rgba(234,88,12,0.35)] transition hover:bg-orange-700 active:scale-[0.99]"
            >
              <WhatsAppIcon size={24} />
              استفسر عن هالقطعة على واتساب
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
