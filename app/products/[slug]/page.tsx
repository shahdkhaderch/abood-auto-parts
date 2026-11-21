import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import ProductName from "@/components/ProductName";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { badge, btnPrimaryLg, tile, textLink } from "@/components/ui";
import { CATEGORY_LABELS, labelRepeatsName, PART_TYPE_LABELS, productLabel, type Product } from "@/lib/catalog";
import { OFFER_LABEL, productsHref } from "@/lib/filters";
import { photosFirst } from "@/lib/product-images";
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
  return [productLabel(p), p.model && `Mercedes ${p.model}`, "استفسر عبر واتساب"]
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

/** Up to 4 other parts for the same model: with a photo first, then same category first, in sheet order. */
function relatedProducts(product: Product, all: Product[]): Product[] {
  const models = new Set(product.models.map((m) => m.slug));
  const sameModel = all.filter((p) => p.slug !== product.slug && p.models.some((m) => models.has(m.slug)));
  return photosFirst([...sameModel.filter((p) => p.category === product.category), ...sameModel.filter((p) => p.category !== product.category)]).slice(0, 4);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = relatedProducts(product, await getProducts());
  const showLabel = !labelRepeatsName(productLabel(product), product.name);

  // Model / category link to the matching filtered /products page. No item code here.
  type Value = { text: string; href?: string };
  const details: { label: string; values: Value[]; ltr?: boolean }[] = [
    { label: "الماركة", values: [{ text: "Mercedes-Benz" }], ltr: true },
    { label: "الموديل", values: product.models.map((m) => ({ text: m.label, href: productsHref({ model: m.slug }) })), ltr: true },
    {
      label: "نوع القطعة",
      values: product.partType === "other" ? [] : [{ text: PART_TYPE_LABELS[product.partType] }],
    },
    { label: "القسم", values: [{ text: CATEGORY_LABELS[product.category], href: productsHref({ category: product.category }) }] },
  ].filter((d) => d.values.length > 0);

  return (
    <main className="min-h-screen bg-page px-4 py-6 sm:py-10 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="مسار التنقل" className="mb-6 flex min-w-0 items-center gap-2 text-sm text-mist">
          <Link href="/" className="shrink-0 transition hover:text-fg">الرئيسية</Link>
          <span aria-hidden="true">‹</span>
          <Link href="/products" className="shrink-0 transition hover:text-fg">القطع</Link>
          <span aria-hidden="true">‹</span>
          <span className="truncate font-medium text-fg"><ProductName name={product.name} /></span>
        </nav>

        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <div className={`${tile} self-start p-2.5`}>
          <ProductImage product={product} variant="page" priority />
          </div>

          <div className="flex flex-col">
            {/* The label chip is only shown when the name doesn't already start with the same words. */}
            {(showLabel || product.onOffer) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {showLabel && <span className="inline-flex w-fit items-center rounded-full border border-field-line bg-field px-3 py-0.5 text-sm font-medium leading-6 text-mist">{productLabel(product)}</span>}
                {product.onOffer && (
                  <Link href={productsHref({ offer: true })} className={badge}>
                    {OFFER_LABEL}
                  </Link>
                )}
              </div>
            )}
            <h1 className="text-2xl font-extrabold leading-[1.45] text-fg sm:text-3xl lg:text-4xl"><ProductName name={product.name} /></h1>

            <dl className={`${tile} mt-6 divide-y divide-tile-line overflow-hidden`}>
              {details.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-base text-mist-card">{d.label}</dt>
                  <dd dir={d.ltr ? "ltr" : undefined} className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-base font-bold text-fg">
                    {d.values.map((v) =>
                      v.href ? (
                        <Link key={v.text} href={v.href} className={textLink}>
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
              className={`${btnPrimaryLg} mt-6 w-full`}
            >
              <WhatsAppIcon size={24} />
              استفسر عن هالقطعة على واتساب
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-12 border-t border-tile-line pt-8 sm:mt-16">
            <h2 id="related-title" className="mb-5 text-xl font-extrabold text-fg sm:text-2xl">قطع مشابهة</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
