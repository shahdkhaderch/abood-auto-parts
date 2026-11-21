import { getImageProps } from "next/image";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { btnOutline, btnPrimary } from "@/components/ui";
import { whatsappLink } from "@/lib/site";

// Owner's photos: the same studio shot cut for desktop (1672×941) and phones (1080×608), both 16:9.
const ALT = "سيارة مرسيدس";
const desktop = getImageProps({ src: "/hero/hero-main.jpg", alt: ALT, width: 1672, height: 941, sizes: "(min-width: 1024px) 62vw, 100vw", priority: true }).props;
const mobile = getImageProps({ src: "/hero/hero-main-mobile.jpg", alt: ALT, width: 1080, height: 608, sizes: "100vw", priority: true }).props;

/**
 * Static hero (owner request 2026-11-21: one hero, no slider).
 * - Phones / tablets (< 1024px): the photo at its natural 16:9 ratio, full width (the car is never cropped),
 *   and the text block below it on the page background.
 * - Desktop: a full-width dark band, 70vh (480–720px). The car fills ~15–92% of the photo's width, so a
 *   full-width crop leaves no empty area for text; instead the whole 16:9 photo sits on the left ≤62% of
 *   the band with its edges faded into the band (.hero-photo-fade), and the text block is on the right,
 *   never over the car.
 * Art direction with <picture>: hero-main.jpg from 1024px, hero-main-mobile.jpg below. Both load eagerly.
 */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-page lg:bg-header">
      <div className="relative lg:flex lg:h-[70vh] lg:max-h-[720px] lg:min-h-[480px] lg:items-center">
        <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[62%] lg:items-center">
          <picture className="block w-full">
            <source media="(min-width: 1024px)" srcSet={desktop.srcSet} sizes={desktop.sizes} />
            <img {...mobile} alt={ALT} className="hero-photo-fade block aspect-video h-auto w-full object-cover lg:max-h-[720px] lg:object-contain lg:object-left" />
          </picture>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-0">
          <div className="max-w-xl lg:w-[34%] lg:max-w-none">
            <p className="text-sm font-bold text-mist sm:text-base">عبود عبد ربه لقطع المرسيدس</p>
            <h1 id="hero-title" className="mt-3 text-3xl font-extrabold leading-[1.3] text-fg sm:text-4xl xl:text-5xl">كل قطع مرسيدس بمكان واحد</h1>
            <p className="mt-4 text-lg leading-[1.8] text-fg/85 xl:text-xl">قطع أصلية وتعديلات بجودة عالية… واسأل عن أي قطعة عبر واتساب</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className={btnPrimary}>تصفح القطع</Link>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btnOutline}>
                <WhatsAppIcon size={20} />
                تواصل واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
