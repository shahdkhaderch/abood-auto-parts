"use client";

import Image from "next/image";
import Link from "next/link";
import { btnPrimary, card } from "@/components/ui";
import { whatsappLink } from "@/lib/site";
import { useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 6000;
// Screen-reader labels for the dots, in words (no numbers are shown anywhere on the site).
const SLIDE_ORDINALS = ["الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة"];

// Every slide sits on a light token (page / card / soft) with ink text and a soft-orange button.
// No dark backgrounds, overlays or gradients anywhere in the hero.
const slides = [
  { id: 1, title: "محلات عبود عبد ربه", subtitle: "قطع مرسيدس أصلية ومستعملة بجودة ممتازة", button: "تصفح القطع", type: "image" },
  { id: 2, title: "خبرة وثقة في عالم مرسيدس", subtitle: "نوفر لك القطعة المناسبة لسيارتك بسرعة ودقة واهتمام", button: "تواصل معنا", type: "trust" },
  { id: 3, title: "التوصيل إلى جميع أنحاء فلسطين", subtitle: "اطلب القطعة التي تحتاجها وسنتابع معك مباشرة عبر واتساب", button: "اطلب الآن", type: "delivery" },
  { id: 4, title: "كل ما تحتاجه لسيارتك في مكان واحد", subtitle: "كماليات داخلية وخارجية، أضوية، وعروض لمختلف موديلات مرسيدس", button: "ابدأ التصفح", type: "range" },
];

type SlideText = { title: string; subtitle: string; button: string };

const titleClass = "mb-4 text-2xl font-bold leading-[1.4] text-ink sm:text-3xl lg:text-5xl lg:leading-[1.3]";
const subtitleClass = "mb-6 max-w-[34rem] text-base leading-[1.8] text-ink-soft lg:text-lg";
// Short soft-orange rule above each heading: a light highlight, never a background.
const AccentRule = () => <span aria-hidden="true" className="mb-4 block h-1 w-12 rounded-ui bg-accent" />;

export default function A1Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance every 6s; paused while hovered or touched. Restarts after any slide change.
  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setCurrent((prev) => (prev + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [current, paused]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setPaused(false);
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrent((prev) => (prev + 1) % slides.length);
      else setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => { setPaused(false); touchStartX.current = null; }}
          className={`relative h-[480px] overflow-hidden ${card} sm:h-[440px] lg:h-[480px]`}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              data-slide={index}
              className={[
                "absolute inset-0 transition-all duration-700",
                current === index ? "z-10 translate-x-0 opacity-100" : "pointer-events-none z-0 translate-x-6 opacity-0",
              ].join(" ")}
            >
              {slide.type === "image" && <ImageSlide slide={slide} />}
              {slide.type === "trust" && <TrustSlide slide={slide} />}
              {slide.type === "delivery" && <DeliverySlide slide={slide} />}
              {slide.type === "range" && <RangeSlide slide={slide} />}
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                onMouseEnter={() => setCurrent(index)}
                className={[
                  "h-2 rounded-ui transition-all duration-300",
                  current === index ? "w-8 bg-accent-hover" : "w-2 bg-ink-soft/30 hover:bg-accent",
                ].join(" ")}
                aria-label={`الشريحة ${SLIDE_ORDINALS[index] ?? ""}`.trim()}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Slide 1: the shop photo, shown whole (object-contain), never cropped or darkened.
 * On the page token because the photo's own off-white edges (#f4–#fa) match it.
 * Note: the photo file itself contains a black car, a dark road band and bright orange stripes; that is image content, not styling.
 */
function ImageSlide({ slide }: { slide: SlideText }) {
  return (
    <div className="flex h-full w-full flex-col bg-page sm:grid sm:grid-cols-[0.9fr_1.1fr] sm:items-center sm:gap-6 sm:px-8 lg:px-12">
      <div className="hidden text-right sm:block">
        <AccentRule />
        <h1 className={titleClass}>{slide.title}</h1>
        <p className={subtitleClass}>{slide.subtitle}</p>
        <Link href="/products" className={btnPrimary}>{slide.button}</Link>
      </div>

      {/* Mobile: portrait photo (it carries the title itself) with the button under it. */}
      <h1 className="sr-only sm:hidden">{slide.title}</h1>
      <div className="relative min-h-0 flex-1 sm:hidden">
        <Image src="/slider/A1-1M.png" alt="محلات عبود عبد ربه لقطع المرسيدس" fill sizes="100vw" className="object-contain" priority />
      </div>
      <div className="flex shrink-0 justify-center pb-12 pt-4 sm:hidden">
        <Link href="/products" className={btnPrimary}>{slide.button}</Link>
      </div>

      <div className="relative hidden h-[78%] sm:block">
        <Image src="/slider/A1-1D.png" alt="محلات عبود عبد ربه لقطع المرسيدس" fill sizes="(min-width: 1152px) 640px, 55vw" className="object-contain" priority />
      </div>
    </div>
  );
}

function InfoCard({ title, text, on = "card" }: { title: string; text: string; on?: "card" | "soft" }) {
  // On a white slide the cards are soft grey; on a soft slide they are white. Same radius/border either way.
  return (
    <div className={["rounded-ui border border-line p-4 lg:p-6", on === "card" ? "bg-soft" : "bg-card shadow-soft"].join(" ")}>
      <div className="mb-2 text-base font-bold text-ink">{title}</div>
      <div className="text-sm leading-[1.8] text-ink-soft lg:text-base">{text}</div>
    </div>
  );
}

/** Slide 2: white (card) background, four feature cards on the soft tone. */
function TrustSlide({ slide }: { slide: SlideText }) {
  return (
    <div className="h-full w-full bg-card">
      <div className="grid h-full items-center gap-8 px-6 pb-12 sm:grid-cols-2 sm:px-8 sm:pb-0 lg:px-12">
        <div className="text-right">
          <AccentRule />
          <h2 className={titleClass}>{slide.title}</h2>
          <p className={subtitleClass}>{slide.subtitle}</p>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btnPrimary}>{slide.button}</a>
        </div>

        <div className="hidden grid-cols-2 gap-4 sm:grid">
          <InfoCard title="قطع أصلية" text="اختيارات متنوعة لمختلف موديلات مرسيدس" />
          <InfoCard title="دقة في الاختيار" text="نساعدك في الوصول للقطعة المناسبة بسهولة" />
          <InfoCard title="خدمة سريعة" text="تواصل مباشر عبر واتساب للطلب والاستفسار" />
          <InfoCard title="ثقة وجودة" text="خبرة واهتمام في عالم السيارات ومرسيدس" />
        </div>
      </div>
    </div>
  );
}

/** Slide 3: soft grey background, white cards (the middle one highlighted with the orange tint border). */
function DeliverySlide({ slide }: { slide: SlideText }) {
  return (
    <div className="h-full w-full bg-soft">
      <div className="grid h-full items-center gap-8 px-6 pb-12 sm:grid-cols-[1.1fr_0.9fr] sm:px-8 sm:pb-0 lg:px-12">
        <div className="text-right">
          <AccentRule />
          <h2 className={titleClass}>التوصيل إلى جميع أنحاء فلسطين</h2>
          <p className={subtitleClass}>
            اطلب القطعة التي تحتاجها وسنتابع معك مباشرة عبر واتساب، مع خدمة توصيل سريعة ومرتبة إلى مختلف المناطق.
          </p>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btnPrimary}>{slide.button}</a>
        </div>

        <div className="hidden items-center justify-center sm:flex">
          <div className="grid w-full max-w-[22rem] gap-4">
            <InfoCard on="soft" title="خدمة التوصيل" text="نوصل طلبك بسرعة إلى جميع أنحاء فلسطين" />
            <div className="rounded-ui border border-accent bg-accent-tint p-4 lg:p-6">
              <div className="mb-2 text-base font-bold text-ink">طلب مباشر</div>
              <div className="text-sm leading-[1.8] text-ink lg:text-base">تواصل معنا عبر واتساب وحدد القطعة التي تحتاجها بسهولة</div>
            </div>
            <InfoCard on="soft" title="متابعة سريعة" text="نساعدك في تأكيد الطلب والمتابعة حتى وصوله" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Slide 4: white background, orange-tint category chips and soft feature cards. */
function RangeSlide({ slide }: { slide: SlideText }) {
  const chip = "rounded-ui border border-accent bg-accent-tint px-3 py-1 text-sm font-medium text-ink";
  return (
    <div className="h-full w-full bg-card">
      <div className="grid h-full items-center gap-8 px-6 pb-12 sm:grid-cols-[1.1fr_0.9fr] sm:px-8 sm:pb-0 lg:px-12">
        <div className="text-right">
          <AccentRule />
          <h2 className={titleClass}>{slide.title}</h2>
          <p className={subtitleClass}>{slide.subtitle}</p>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className={chip}>كماليات داخلية</span>
            <span className={chip}>كماليات خارجية</span>
            <span className={chip}>أضوية السيارة</span>
            <span className={chip}>عروض</span>
          </div>

          <Link href="/products" className={btnPrimary}>{slide.button}</Link>
        </div>

        <div className="hidden items-center justify-center sm:flex">
          <div className="grid w-full max-w-[23rem] grid-cols-2 gap-4">
            <InfoCard title="موديلات متعددة" text="خدمة لمجموعة واسعة من موديلات مرسيدس" />
            <InfoCard title="واتساب مباشر" text="تواصل أسرع وأسهل لطلب القطع" />
            <InfoCard title="أقسام متنوعة" text="كماليات، أضوية، وعروض مختلفة" />
            <InfoCard title="جودة ممتازة" text="اختيارات أصلية ومستعملة بحالة ممتازة" />
          </div>
        </div>
      </div>
    </div>
  );
}
