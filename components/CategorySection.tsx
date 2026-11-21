import BrowseCards from "@/components/BrowseCards";
import PartIcon from "@/components/PartIcon";
import SectionTitle from "@/components/SectionTitle";
import type { Category } from "@/lib/catalog";
import { productsHref, type Facet } from "@/lib/filters";
import { CATEGORY_PHOTOS } from "@/lib/showcase-images";

/**
 * "تصفح حسب الفئة": one card per category that has products (from the sheet), linking to
 * /products?category=…  Images from lib/showcase-images.ts (public/categories/).
 */
export default function CategorySection({ categories }: { categories: Facet[] }) {
  if (categories.length === 0) return null;
  return (
    <section aria-labelledby="categories-title" className="bg-linear-to-b from-page to-header py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionTitle id="categories-title" label="Shop by category" title="تصفح حسب الفئة" />
        <BrowseCards
          eager
          gridCols="md:grid-cols-3 lg:grid-cols-6"
          sizes="(min-width: 1024px) 16vw, (min-width: 768px) 30vw, 42vw"
          items={categories.map((c) => ({
            href: productsHref({ category: c.value }),
            label: c.label,
            image: CATEGORY_PHOTOS[c.value as Category],
            fallback: <PartIcon type={c.value as Category} size={64} strokeWidth={2} />,
          }))}
        />
      </div>
    </section>
  );
}
