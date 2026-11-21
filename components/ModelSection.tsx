import BrowseCards from "@/components/BrowseCards";
import PartIcon from "@/components/PartIcon";
import SectionTitle from "@/components/SectionTitle";
import { productsHref, type Facet } from "@/lib/filters";
import { MODEL_PHOTOS } from "@/lib/showcase-images";

/**
 * "تصفح حسب الموديل": one card per model that has products (already in display order:
 * "… Class" models first, then the others), linking to /products?model=…  Same cards as the
 * categories. Images from lib/showcase-images.ts (public/models/); a model without an image
 * gets the car icon.
 */
export default function ModelSection({ models }: { models: Facet[] }) {
  if (models.length === 0) return null;
  return (
    <section aria-labelledby="models-title" className="bg-header pb-10 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionTitle id="models-title" label="Shop by model" title="تصفح حسب الموديل" />
        <BrowseCards
          gridCols="md:grid-cols-4 lg:grid-cols-7"
          sizes="(min-width: 1024px) 14vw, (min-width: 768px) 23vw, 42vw"
          items={models.map((m) => ({
            href: productsHref({ model: m.value }),
            label: m.label,
            ltr: true,
            image: MODEL_PHOTOS[m.value],
            fallback: <PartIcon type="front-bumper" size={64} strokeWidth={2} />,
          }))}
        />
      </div>
    </section>
  );
}
