import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LoadMoreButton from "@/components/LoadMoreButton";
import ProductCard from "@/components/ProductCard";
import SearchForm from "@/components/SearchForm";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { applyFilters, getFacets, parseFilters, productsHref, SHOW_STEP, type ProductFilters } from "@/lib/filters";
import { getProducts } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const title = f.q ? `نتائج البحث عن «${f.q}» | ${site.name}` : `كل القطع | ${site.name}`;
  return { title, description: "تصفح قطع مرسيدس حسب الموديل والقسم واستفسر عبر واتساب", alternates: { canonical: "/products" } };
}

function Chip({ href, active, label, ltr }: { href: string; active: boolean; label: string; ltr?: boolean }) {
  return (
    <Link
      href={href}
      scroll={false}
      // Each chip is a dynamic /products render; don't prefetch them all.
      prefetch={false}
      aria-current={active ? "true" : undefined}
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-sm font-bold transition",
        active ? "border-orange-600 bg-orange-600 text-white" : "border-neutral-200 bg-white text-neutral-800 hover:border-orange-300 hover:bg-orange-50",
      ].join(" ")}
    >
      <span dir={ltr ? "ltr" : undefined}>{label}</span>
    </Link>
  );
}

function FilterRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <div className="shrink-0 pt-2 text-xs font-extrabold text-neutral-500 sm:w-20">{title}</div>
      {/* Scrolls sideways on mobile, wraps on desktop */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">{children}</div>
    </div>
  );
}

export default async function ProductsPage({ searchParams }: Props) {
  const products = await getProducts();
  const f = parseFilters(await searchParams);
  const results = applyFilters(products, f);

  // Options respect every other active filter (and the search), so a chip never leads to 0 results.
  const modelFacets = getFacets(applyFilters(products, f, "model")).models;
  const categoryFacets = getFacets(applyFilters(products, f, "category")).categories;

  // Only show categories that exist in the sheet at all.
  const all = getFacets(products);
  // Changing a filter starts again from the first batch (show is reset).
  const with_ = (patch: Partial<ProductFilters>) => productsHref({ ...f, show: SHOW_STEP, ...patch });
  const shown = results.slice(0, f.show);
  const moreHref = results.length > f.show ? productsHref({ ...f, show: f.show + SHOW_STEP }) : null;
  const hasFilters = Boolean(f.model || f.type || f.category || f.offer);
  const modelLabel = all.models.find((m) => m.value === f.model)?.label;

  const categoryLabel = all.categories.find((c) => c.value === f.category)?.label;
  const heading = f.q
    ? `نتائج البحث عن «${f.q}»`
    : modelLabel
      ? `قطع مرسيدس ${modelLabel}${categoryLabel ? ` - ${categoryLabel}` : ""}`
      : (categoryLabel ?? "كل القطع");

  return (
    <main className="min-h-screen bg-white px-4 py-6 pb-28 sm:px-6 sm:py-8 sm:pb-10">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="مسار التنقل" className="mb-4 flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-orange-600 transition">الرئيسية</Link>
          <span aria-hidden="true">‹</span>
          <span className="font-semibold text-neutral-800">القطع</span>
        </nav>

        {/* No counts anywhere on the site (owner decision). */}
        <h1 className="mb-5 text-2xl font-black text-neutral-950 sm:text-3xl">{heading}</h1>

        <Suspense fallback={null}>
          <SearchForm keepFilters className="mb-5 max-w-2xl" />
        </Suspense>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
          <FilterRow title="الموديل">
            <Chip href={with_({ model: "" })} active={!f.model} label="الكل" />
            {modelFacets.map((m) => (
              <Chip key={m.value} href={with_({ model: f.model === m.value ? "" : m.value })} active={f.model === m.value} label={m.label} ltr />
            ))}
          </FilterRow>

          {all.categories.length > 0 && (
            <FilterRow title="القسم">
              <Chip href={with_({ category: "" })} active={!f.category} label="الكل" />
              {categoryFacets.map((c) => (
                <Chip key={c.value} href={with_({ category: f.category === c.value ? "" : c.value })} active={f.category === c.value} label={c.label} />
              ))}
            </FilterRow>
          )}

          {(hasFilters || f.q) && (
            <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-3 text-sm font-bold">
              {hasFilters && <Link href={productsHref({ q: f.q })} scroll={false} className="text-orange-700 hover:underline">مسح الفلاتر</Link>}
              {f.q && <Link href={productsHref({ ...f, q: "", show: SHOW_STEP })} scroll={false} className="text-orange-700 hover:underline">مسح البحث</Link>}
              {hasFilters && f.q && <Link href="/products" className="text-neutral-500 hover:underline">مسح الكل</Link>}
            </div>
          )}
        </div>

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {shown.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 4} />
              ))}
            </div>
            {moreHref && <LoadMoreButton href={moreHref} />}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
            <div className="text-4xl" aria-hidden="true">🔍</div>
            <p className="mt-3 text-lg font-black text-neutral-900">ما لقينا قطع مطابقة{f.q ? ` لـ «${f.q}»` : ""}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-neutral-500">
              جرّب كلمة ثانية أو امسح الفلاتر. وإذا ما لقيت اللي بدك إياه، ابعتلنا على واتساب وبنساعدك تلاقيها.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {(hasFilters || f.q) && (
                <Link href="/products" className="inline-flex h-11 items-center rounded-2xl border border-neutral-300 bg-white px-5 text-sm font-extrabold text-neutral-800 hover:border-orange-300 hover:bg-orange-50 transition">
                  عرض كل القطع
                </Link>
              )}
              <a
                href={whatsappLink(f.q ? `مرحبا، بدور على قطعة: ${f.q}` : undefined)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-orange-600 px-5 text-sm font-extrabold text-white hover:bg-orange-700 transition"
              >
                <WhatsAppIcon />
                اسألنا على واتساب
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
