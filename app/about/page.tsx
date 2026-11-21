import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { btnPrimary, btnSecondary, tile } from "@/components/ui";
import { getNavData, productsHref } from "@/lib/filters";
import { getProducts } from "@/lib/products";
import { SECTION_PHOTOS } from "@/lib/showcase-images";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `عن الشركة | ${site.name}`,
  description: `${site.name}: قطع وتعديلات مرسيدس في نابلس. تصفح القطع واستفسر عبر واتساب.`,
  alternates: { canonical: "/about" },
};
export const revalidate = 300;

export default async function AboutPage() {
  // "What we offer" = the categories that have products in the sheet right now.
  const { categories } = getNavData(await getProducts());

  return (
    <main className="min-h-screen bg-page px-4 py-8 sm:py-12 lg:px-6">
      <div className="mx-auto grid max-w-7xl items-start gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold leading-tight text-fg sm:text-4xl">عن {site.name}</h1>
          <p className="mt-4 text-lg leading-[1.9] text-fg/90">
            {site.name} متخصص في قطع وتعديلات مرسيدس في نابلس: قطع مرسيدس الأصلية والمستعملة بجودة ممتازة وأسعار منافسة، مع التوصيل إلى جميع أنحاء فلسطين.
          </p>
          <p className="mt-3 text-base leading-[1.9] text-mist">تصفح القطع على الموقع، ولما تلاقي اللي بدك إياه ابعتلنا على واتساب وبنرد عليك بسرعة.</p>
          <p className="mt-3 text-base text-fg">
            <span className="font-bold">ساعات الدوام: </span>
            {site.openingHours}
          </p>

          {categories.length > 0 && (
            <section aria-labelledby="offer-title" className="mt-8">
              <h2 id="offer-title" className="mb-3 text-xl font-extrabold text-fg">شو بنوفر</h2>
              <ul className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <li key={c.value}>
                    <Link href={productsHref({ category: c.value })} className={`${tile} flex h-full items-center px-4 py-3 text-base font-bold text-fg transition hover:border-mist active:scale-[0.98]`}>
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btnPrimary}>
              <WhatsAppIcon size={20} />
              تواصل واتساب
            </a>
            <Link href="/products" className={btnSecondary}>تصفح القطع</Link>
          </div>
        </div>

        <div className={`${tile} relative aspect-[4/3] overflow-hidden`}>
          <Image src={SECTION_PHOTOS.banner} alt={`قطع مرسيدس - ${site.name}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
        </div>
      </div>
    </main>
  );
}
