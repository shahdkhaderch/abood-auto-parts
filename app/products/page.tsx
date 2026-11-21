import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LoadMoreButton from "@/components/LoadMoreButton";
import ProductCard from "@/components/ProductCard";
import SearchForm from "@/components/SearchForm";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { btnPrimary, btnSecondary, chip, chipActive, chipIdle, panel, textLink, tile } from "@/components/ui";
import { applyFilters, getFacets, parseFilters, productsHref, SHOW_STEP, type ProductFilters } from "@/lib/filters";
import { getProducts } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const title = f.q ? `نتائج البحث عن «${f.q}» | ${site.name}` : `كل القطع | ${site.name}`;
  return { title, description: "تصفح قطع مرسيدس حسب الموديل والقسم واستفسر عبر واتساب", alternates: { canonical: "/products" } };
}

function Chip({ href, active, label, ltr, wide }: { href: string; active: boolean; label: string; ltr?: boolean; wide?: boolean }) {
  return (
    <Link
      href={href}
      scroll={false}
      // Each chip is a dynamic /products render; don't prefetch them all.
      prefetch={false}
      aria-current={active ? "true" : undefined}
      className={[
        chip,
        active ? chipActive : chipIdle,
        // Model chips: similar widths on phones, one equal grid cell each from 1024px.
        wide ? "min-w-[5.5rem] justify-center whitespace-nowrap lg:w-full lg:min-w-0" : "",
      ].join(" ")}
    >
      <span dir={ltr ? "ltr" : undefined}>{label}</span>
    </Link>
  );
}

function FilterRow({ title, children, rows }: { title: string; children: React.ReactNode[]; rows?: boolean }) {
  // rows: the chips split into two balanced rows (first row gets the extra one). Below 1024px both rows
  // scroll sideways together; from 1024px they are two grids with the same columns, so the chips line up.
  const half = Math.ceil(children.length / 2);
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <div className="shrink-0 text-sm font-bold text-fg sm:w-20 sm:pt-2">{title}</div>
      {rows ? (
        <div className="-mx-4 min-w-0 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-1 lg:overflow-visible">
          <div className="flex w-max flex-col gap-2 lg:w-full">
            {[children.slice(0, half), children.slice(half)].filter((r) => r.length > 0).map((r, i) => (
              <div key={i} className="flex gap-2 lg:grid" style={{ gridTemplateColumns: `repeat(${half}, minmax(0, 1fr))` }}>
                {r}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Scrolls sideways on mobile, wraps on desktop
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">{children}</div>
      )}
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
    <main className="min-h-screen bg-stage px-4 py-6 sm:py-10 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="مسار التنقل" className="mb-4 flex items-center gap-2 text-sm text-mist">
          <Link href="/" className="transition hover:text-fg">الرئيسية</Link>
          <span aria-hidden="true">‹</span>
          <span className="font-medium text-fg">القطع</span>
        </nav>

        {/* No counts anywhere on the site (owner decision). */}
        <h1 className="mb-6 text-3xl font-extrabold text-fg sm:text-4xl">{heading}</h1>

        <Suspense fallback={null}>
          <SearchForm keepFilters className="mb-4 max-w-2xl" />
        </Suspense>

        <div className={`${panel} mb-8 flex flex-col gap-4 p-4 sm:p-5`}>
          <FilterRow title="الموديل" rows>
            {[
              <Chip key="" href={with_({ model: "" })} active={!f.model} label="الكل" wide />,
              ...modelFacets.map((m) => (
                <Chip key={m.value} href={with_({ model: f.model === m.value ? "" : m.value })} active={f.model === m.value} label={m.label} ltr wide />
              )),
            ]}
          </FilterRow>

          {all.categories.length > 0 && (
            <FilterRow title="القسم">
              {[
                <Chip key="" href={with_({ category: "" })} active={!f.category} label="الكل" />,
                ...categoryFacets.map((c) => (
                  <Chip key={c.value} href={with_({ category: f.category === c.value ? "" : c.value })} active={f.category === c.value} label={c.label} />
                )),
              ]}
            </FilterRow>
          )}

          {(hasFilters || f.q) && (
            <div className="flex flex-wrap gap-4 border-t border-tile-line pt-4 text-base">
              {hasFilters && <Link href={productsHref({ q: f.q })} scroll={false} className={textLink}>مسح الفلاتر</Link>}
              {f.q && <Link href={productsHref({ ...f, q: "", show: SHOW_STEP })} scroll={false} className={textLink}>مسح البحث</Link>}
              {hasFilters && f.q && <Link href="/products" className="text-mist underline decoration-dim decoration-2 underline-offset-4 transition hover:text-fg">مسح الكل</Link>}
            </div>
          )}
        </div>

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {shown.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 4} />
              ))}
            </div>
            {moreHref && <div className="mt-8 flex justify-center"><LoadMoreButton href={moreHref} /></div>}
          </>
        ) : (
          <div className={`${tile} px-6 py-12 text-center`}>
            <div className="text-4xl" aria-hidden="true">🔍</div>
            <p className="mt-4 text-lg font-bold text-fg">ما لقينا قطع مطابقة{f.q ? ` لـ «${f.q}»` : ""}</p>
            <p className="mx-auto mt-2 max-w-md text-base text-mist-card">
              جرّب كلمة ثانية أو امسح الفلاتر. وإذا ما لقيت اللي بدك إياه، ابعتلنا على واتساب وبنساعدك تلاقيها.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {(hasFilters || f.q) && (
                <Link href="/products" className={btnSecondary}>
                  عرض كل القطع
                </Link>
              )}
              <a
                href={whatsappLink(f.q ? `مرحبا، بدور على قطعة: ${f.q}` : undefined)}
                target="_blank"
                rel="noreferrer"
                className={btnPrimary}
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
