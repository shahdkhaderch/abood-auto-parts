import Link from "next/link";
import BottomBanner from "@/components/BottomBanner";
import CategorySection from "@/components/CategorySection";
import Hero from "@/components/Hero";
import LoadMoreButton from "@/components/LoadMoreButton";
import ModelSection from "@/components/ModelSection";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import WhyChooseUs from "@/components/WhyChooseUs";
import { btnPrimary, btnSecondary, tile } from "@/components/ui";
import { getNavData, parseShow, SHOW_STEP } from "@/lib/filters";
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
  const { categories, models } = getNavData(products);

  return (
    <main className="min-h-screen bg-page">
      <Hero />

      <CategorySection categories={categories} />
      <ModelSection models={models} />

      <section id="products" aria-labelledby="products-title" className="scroll-mt-24 border-t border-tile-line bg-stage py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionTitle id="products-title" label="Our parts" title="قطع مرسيدس" />

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                {products.slice(0, show).map((p, i) => (
                  <ProductCard key={p.slug} product={p} priority={i < 4} />
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {moreHref && <LoadMoreButton href={moreHref} />}
                <Link href="/products" className={btnSecondary}>عرض كل القطع</Link>
              </div>
            </>
          ) : (
            <div className={`${tile} p-8 text-center`}>
              <p className="font-bold text-fg">القطع غير متوفرة حالياً على الموقع.</p>
              <p className="mt-1 text-base text-mist-card">تواصل معنا على واتساب وبنساعدك تلاقي القطعة.</p>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`${btnPrimary} mt-4`}>
                <WhatsAppIcon />
                تواصل واتساب
              </a>
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />
      <BottomBanner />
    </main>
  );
}
