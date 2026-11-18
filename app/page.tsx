import Link from "next/link";
import A1Hero from "@/components/A1Hero";
import LoadMoreButton from "@/components/LoadMoreButton";
import ProductCard from "@/components/ProductCard";
import { parseShow, SHOW_STEP } from "@/lib/filters";
import { getProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/site";

// Rendered per request because of ?show=; the sheet fetch itself is cached for 5 minutes
// (PRODUCTS_REVALIDATE_SECONDS in lib/products.ts).

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Home({ searchParams }: Props) {
  const [products, sp] = await Promise.all([getProducts(), searchParams]);
  // The grid shows SHOW_STEP products, plus SHOW_STEP more per "عرض المزيد" (kept in ?show=).
  const show = parseShow(sp.show);
  const moreHref = products.length > show ? `/?show=${show + SHOW_STEP}` : null;

  return (
    <main className="min-h-screen bg-surface px-4 py-4 sm:px-6 sm:py-6">
      <A1Hero />

      <section id="products" className="mx-auto mt-10 max-w-6xl scroll-mt-32 sm:mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">قطع مرسيدس</h2>
            <p className="mt-1 text-base text-ink-soft">اختر القطعة واستفسر عنها مباشرة عبر واتساب</p>
          </div>
          {products.length > 0 && (
            <Link href="/products" className="shrink-0 rounded-lg px-2 py-1 text-base font-bold text-accent-text transition hover:bg-accent-soft">
              عرض كل القطع ‹
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {products.slice(0, show).map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 4} />
              ))}
            </div>
            {moreHref && <LoadMoreButton href={moreHref} />}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-line-strong bg-card p-8 text-center">
            <p className="font-bold text-ink">القطع غير متوفرة حالياً على الموقع.</p>
            <p className="mt-1 text-base text-ink-soft">تواصل معنا على واتساب وبنساعدك تلاقي القطعة.</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-whatsapp px-6 text-base font-bold text-ink transition hover:bg-whatsapp-hover"
            >
              تواصل واتساب
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
