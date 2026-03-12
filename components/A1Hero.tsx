"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  { id: 1, title: "محلات عبود عبد ربه", subtitle: "قطع مرسيدس أصلية ومستعملة بجودة ممتازة", button: "تصفح القطع", type: "image" },
  { id: 2, title: "خبرة وثقة في عالم مرسيدس", subtitle: "نوفر لك القطعة المناسبة لسيارتك بسرعة ودقة واهتمام", button: "تواصل معنا", type: "design-dark" },
  { id: 3, title: "التوصيل إلى جميع أنحاء فلسطين", subtitle: "اطلب القطعة التي تحتاجها وسنتابع معك مباشرة عبر واتساب", button: "اطلب الآن", type: "design-light" },
  { id: 4, title: "كل ما تحتاجه لسيارتك في مكان واحد", subtitle: "كماليات داخلية وخارجية، أضوية، وعروض لمختلف موديلات مرسيدس", button: "ابدأ التصفح", type: "design-mix" },
];

export default function A1Hero() {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isHovering) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isHovering]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current) return;

    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const part = rect.width / slides.length;
    const next = Math.min(slides.length - 1, Math.max(0, Math.floor(x / part)));

    if (next !== current) setCurrent(next);
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-6 sm:pt-6">
        <div
          ref={wrapRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          className="relative h-[460px] overflow-hidden rounded-[20px] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:h-[520px] sm:rounded-[28px]"
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={[
                "absolute inset-0 transition-all duration-700",
                current === index ? "z-10 translate-x-0 opacity-100" : "pointer-events-none z-0 translate-x-6 opacity-0",
              ].join(" ")}
            >
              {slide.type === "image" && <ImageSlide slide={slide} />}
              {slide.type === "design-dark" && <DarkSlide slide={slide} />}
              {slide.type === "design-light" && <LightSlide slide={slide} />}
              {slide.type === "design-mix" && <MixSlide slide={slide} />}
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-2 sm:bottom-4">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                onMouseEnter={() => setCurrent(index)}
                className={[
                  "h-2 rounded-full transition-all duration-300",
                  current === index ? "w-8 bg-orange-500" : "w-2 bg-white/50 hover:bg-white/80",
                ].join(" ")}
                aria-label={`slide-${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageSlide({ slide }: { slide: { title: string; subtitle: string; button: string } }) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 block sm:hidden">
        <Image src="/slider/A1-1M.png" alt="A1 mobile" fill className="object-cover object-top" priority />
      </div>

      <div className="absolute inset-0 hidden sm:block">
        <Image src="/slider/A1-1D.png" alt="A1 desktop" fill className="object-cover" priority />
      </div>

      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/25 to-transparent sm:from-black/60 sm:via-black/20 sm:to-transparent" />

      <div className="absolute inset-0 flex items-start pt-8 sm:items-center sm:pt-0">
        <div className="mr-auto w-full max-w-[620px] px-5 text-right text-white sm:px-10">
          <h1 className="mb-3 text-2xl font-black leading-tight sm:text-5xl">{slide.title}</h1>
          <p className="mb-5 max-w-[520px] text-xs leading-6 text-white/85 sm:mb-6 sm:text-lg sm:leading-7">{slide.subtitle}</p>
          <div className="flex justify-end">
            <a
              href="#offers"
              className="inline-flex items-center rounded-2xl bg-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_30px_rgba(249,115,22,0.35)] transition hover:bg-orange-600 sm:px-6 sm:py-3 sm:text-sm"
            >
              {slide.button}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkSlide({ slide }: { slide: { title: string; subtitle: string; button: string } }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.10),transparent_30%)]" />
      <div className="absolute left-[-80px] top-[60px] h-[280px] w-[280px] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-[-70px] right-[-20px] h-[260px] w-[260px] rounded-full bg-white/5 blur-3xl" />

      <div className="grid h-full items-center gap-8 px-5 sm:grid-cols-2 sm:px-10">
        <div className="order-2 hidden sm:block sm:order-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-3 text-sm font-extrabold text-white">قطع أصلية</div>
              <div className="text-xs leading-6 text-white/70">اختيارات متنوعة لمختلف موديلات مرسيدس</div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-3 text-sm font-extrabold text-white">دقة في الاختيار</div>
              <div className="text-xs leading-6 text-white/70">نساعدك في الوصول للقطعة المناسبة بسهولة</div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-3 text-sm font-extrabold text-white">خدمة سريعة</div>
              <div className="text-xs leading-6 text-white/70">تواصل مباشر عبر واتساب للطلب والاستفسار</div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-3 text-sm font-extrabold text-white">ثقة وجودة</div>
              <div className="text-xs leading-6 text-white/70">خبرة واهتمام في عالم السيارات ومرسيدس</div>
            </div>
          </div>
        </div>

        <div className="order-1 text-right sm:order-2">
          <h2 className="mb-3 text-2xl font-black leading-tight text-white sm:mb-4 sm:text-5xl">{slide.title}</h2>
          <p className="mb-5 max-w-[520px] text-xs leading-6 text-white/80 sm:mb-6 sm:text-lg sm:leading-7">{slide.subtitle}</p>

          <a
            href="https://wa.me/972599842238"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-2xl bg-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_30px_rgba(249,115,22,0.35)] transition hover:bg-orange-600 sm:px-6 sm:py-3 sm:text-sm"
          >
            {slide.button}
          </a>
        </div>
      </div>
    </div>
  );
}

function LightSlide({ slide }: { slide: { title: string; subtitle: string; button: string } }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f8f5ef]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.06),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.05),transparent_20%)]" />

      <div className="grid h-full items-center gap-8 px-5 sm:grid-cols-[1.1fr_0.9fr] sm:px-12">
        <div className="text-right">
          <h2 className="mb-3 text-2xl font-black leading-tight text-neutral-950 sm:mb-4 sm:text-5xl">
            التوصيل إلى جميع أنحاء فلسطين
          </h2>

          <p className="mb-5 max-w-[560px] text-xs leading-6 text-neutral-600 sm:mb-6 sm:text-base sm:leading-8">
            اطلب القطعة التي تحتاجها وسنتابع معك مباشرة عبر واتساب، مع خدمة توصيل سريعة ومرتبة إلى مختلف المناطق.
          </p>

          <div className="flex justify-end">
            <a
              href="https://wa.me/972599842238"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-2xl bg-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_30px_rgba(249,115,22,0.25)] transition hover:bg-orange-600 sm:px-6 sm:py-3 sm:text-sm"
            >
              {slide.button}
            </a>
          </div>
        </div>

        <div className="hidden items-center justify-center sm:flex">
          <div className="grid w-full max-w-[360px] gap-4">
            <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
              <div className="mb-2 text-sm font-extrabold text-neutral-950">خدمة التوصيل</div>
              <div className="text-sm leading-7 text-neutral-600">نوصل طلبك بسرعة إلى جميع أنحاء فلسطين</div>
            </div>

            <div className="rounded-[28px] border border-orange-200 bg-orange-50 p-5 shadow-sm">
              <div className="mb-2 text-sm font-extrabold text-neutral-950">طلب مباشر</div>
              <div className="text-sm leading-7 text-neutral-700">تواصل معنا عبر واتساب وحدد القطعة التي تحتاجها بسهولة</div>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm">
              <div className="mb-2 text-sm font-extrabold text-neutral-950">متابعة سريعة</div>
              <div className="text-sm leading-7 text-neutral-600">نساعدك في تأكيد الطلب والمتابعة حتى وصوله</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MixSlide({ slide }: { slide: { title: string; subtitle: string; button: string } }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_18%)]" />
      <div className="absolute left-[-40px] bottom-[-60px] h-[220px] w-[220px] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute right-[-20px] top-[-30px] h-[180px] w-[180px] rounded-full bg-white/5 blur-3xl" />

      <div className="grid h-full items-center gap-8 px-5 sm:grid-cols-[1fr_1.1fr] sm:px-12">
        <div className="hidden items-center justify-center sm:flex">
          <div className="grid w-full max-w-[370px] grid-cols-2 gap-4">
            <div className="rounded-[26px] bg-white p-5 text-right text-neutral-950 shadow-lg">
              <div className="mb-2 text-sm font-black">موديلات متعددة</div>
              <div className="text-xs leading-6 text-neutral-600">خدمة لمجموعة واسعة من موديلات مرسيدس</div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 text-right text-white">
              <div className="mb-2 text-sm font-black">واتساب مباشر</div>
              <div className="text-xs leading-6 text-white/75">تواصل أسرع وأسهل لطلب القطع</div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/5 p-5 text-right text-white">
              <div className="mb-2 text-sm font-black">أقسام متنوعة</div>
              <div className="text-xs leading-6 text-white/75">كماليات، أضوية، وعروض مختلفة</div>
            </div>

            <div className="rounded-[26px] bg-white p-5 text-right text-neutral-950 shadow-lg">
              <div className="mb-2 text-sm font-black">جودة ممتازة</div>
              <div className="text-xs leading-6 text-neutral-600">اختيارات أصلية ومستعملة بحالة ممتازة</div>
            </div>
          </div>
        </div>

        <div className="text-right text-white">
          <h2 className="mb-4 text-2xl font-black leading-tight sm:text-5xl">{slide.title}</h2>
          <p className="mb-5 max-w-[560px] text-xs leading-6 text-white/80 sm:mb-6 sm:text-lg sm:leading-7">{slide.subtitle}</p>

          <div className="mb-5 flex flex-nowrap justify-end gap-2 overflow-x-auto sm:mb-6">
            <span className="rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold sm:px-4 sm:py-2 sm:text-xs">كماليات داخلية</span>
            <span className="rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold sm:px-4 sm:py-2 sm:text-xs">كماليات خارجية</span>
            <span className="rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold sm:px-4 sm:py-2 sm:text-xs">أضوية السيارة</span>
            <span className="rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold sm:px-4 sm:py-2 sm:text-xs">عروض</span>
          </div>

          <a
            href="#offers"
            className="inline-flex items-center rounded-2xl bg-orange-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_30px_rgba(249,115,22,0.35)] transition hover:bg-orange-600 sm:px-6 sm:py-3 sm:text-sm"
          >
            {slide.button}
          </a>
        </div>
      </div>
    </div>
  );
}