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
    <main className="min-h-screen bg-white px-4 py-6 pb-28 sm:px-6 sm:py-8 sm:pb-8">
      <A1Hero />

      <section id="products" className="mx-auto mt-10 max-w-6xl scroll-mt-32 sm:mt-14">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-neutral-950 sm:text-3xl">قطع مرسيدس</h2>
            <p className="mt-1 text-sm text-neutral-500">اختر القطعة واستفسر عنها مباشرة عبر واتساب</p>
          </div>
          {products.length > 0 && (
            <Link href="/products" className="shrink-0 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-extrabold text-orange-700 hover:bg-orange-100 transition">
              عرض كل القطع ‹
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {products.slice(0, show).map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 4} />
              ))}
            </div>
            {moreHref && <LoadMoreButton href={moreHref} />}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
            <p className="font-bold text-neutral-800">القطع غير متوفرة حالياً على الموقع.</p>
            <p className="mt-1 text-sm text-neutral-500">تواصل معنا على واتساب وبنساعدك تلاقي القطعة.</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-orange-600 px-5 text-sm font-extrabold text-white hover:bg-orange-700 transition"
            >
              تواصل واتساب
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
