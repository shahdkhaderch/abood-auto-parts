import Image from "next/image";
import Link from "next/link";
import { eyebrow } from "@/components/ui";
import { SECTION_PHOTOS } from "@/lib/showcase-images";

/**
 * Rounded dark banner: engine/parts photo on the left fading into the dark card, text and a white
 * pill button on the right. Photo: SECTION_PHOTOS.banner (lib/showcase-images.ts).
 */
export default function BottomBanner() {
  return (
    // Its own spacing above and below, so it never touches the "why choose us" section.
    <section className="bg-cloud px-4 py-12 sm:py-16 lg:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-banner border border-tile-line bg-header">
        <div aria-hidden="true" className="absolute inset-0 sm:right-auto sm:w-[62%]">
          <Image src={SECTION_PHOTOS.banner} alt="" fill sizes="(min-width: 640px) 62vw, 100vw" className="object-cover object-center" />
          {/* Fade into the card: towards the text (right) on wide screens, from the bottom on phones. */}
          <div className="absolute inset-0 bg-linear-to-t from-header via-header/80 to-header/20 sm:bg-linear-to-l sm:from-header sm:via-header/40 sm:to-transparent" />
        </div>

        <div className="relative flex min-h-[300px] items-end p-6 sm:min-h-[220px] sm:items-center sm:px-12 sm:py-8 lg:min-h-[250px] lg:px-14">
          <div className="max-w-2xl">
            <p className={eyebrow} dir="ltr">Keep your Mercedes in top shape</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.3] text-fg sm:text-4xl">قطع أصلية .. لسيارة تدوم أطول</h2>
            <Link href="/products" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white pe-4 ps-7 text-base font-bold text-ink transition hover:bg-cloud active:scale-[0.98]">
              تصفح جميع القطع
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
