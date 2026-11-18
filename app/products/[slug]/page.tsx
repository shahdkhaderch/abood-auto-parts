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
    <main className="min-h-screen bg-surface px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="مسار التنقل" className="mb-6 flex min-w-0 items-center gap-2 text-sm text-ink-soft">
          <Link href="/" className="shrink-0 transition hover:text-accent-text">الرئيسية</Link>
          <span aria-hidden="true">‹</span>
          <Link href="/products" className="shrink-0 transition hover:text-accent-text">القطع</Link>
          <span aria-hidden="true">‹</span>
          <span className="truncate font-medium text-ink">{productLabel(product)}</span>
        </nav>

        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <ProductImage product={product} variant="page" priority />

          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex w-fit rounded-md bg-card px-3 py-1 text-sm font-bold text-ink-soft ring-1 ring-line">
                {productLabel(product)}
              </span>
              {product.onOffer && (
                <Link href={productsHref({ offer: true })} className="inline-flex w-fit rounded-md bg-accent px-3 py-1 text-sm font-bold text-card transition hover:bg-accent-hover">
                  {OFFER_LABEL}
                </Link>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-[1.45] text-ink sm:text-3xl lg:text-4xl">{product.name}</h1>

            <dl className="mt-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-card shadow-xs">
              {details.map((d) => (
                <div key={d.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-base text-ink-soft">{d.label}</dt>
                  <dd dir={d.ltr ? "ltr" : undefined} className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-base font-bold text-ink">
                    {d.values.map((v) =>
                      v.href ? (
                        <Link key={v.text} href={v.href} className="text-accent-text underline decoration-accent-ring underline-offset-4 hover:text-accent-hover hover:decoration-accent-text">
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
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 text-lg font-bold text-ink shadow-md transition hover:bg-whatsapp-hover active:scale-[0.99]"
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
