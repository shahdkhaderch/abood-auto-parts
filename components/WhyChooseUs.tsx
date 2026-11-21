import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import { SECTION_PHOTOS } from "@/lib/showcase-images";

// Thin-line icons (1.5 stroke), drawn here so they stay consistent.
const icon = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONS = {
  quality: (
    <svg {...icon} aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6Z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></svg>
  ),
  value: (
    <svg {...icon} aria-hidden="true"><path d="M3 12.5V4a1 1 0 0 1 1-1h8.5L21 11.5 12.5 20Z" /><circle cx="8" cy="8" r="1.4" /></svg>
  ),
  chat: (
    <svg {...icon} aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z" /><path d="M9 10.5h6M9 13.5h4" /></svg>
  ),
  expert: (
    <svg {...icon} aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8a1.8 1.8 0 0 0 2.6 2.6l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.4-.4-2.3Z" /></svg>
  ),
};

const POINTS: { icon: keyof typeof ICONS; lines: [string, string] }[] = [
  { icon: "quality", lines: ["قطع أصلية وتجارية", "بجودة مضمونة"] },
  { icon: "value", lines: ["أسعار منافسة", "ومناسبة"] },
  { icon: "chat", lines: ["استفسار سريع", "عبر واتساب"] },
  { icon: "expert", lines: ["خبرة في قطع", "وتعديلات المرسيدس"] },
];

/** Faint abstract circles and lines behind the section (decorative, no logos). */
function Watermark() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/2 h-[720px] w-[720px] -translate-y-1/2 text-ink/[0.05]" viewBox="0 0 400 400" fill="none" stroke="currentColor">
      <circle cx="200" cy="200" r="190" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="140" strokeWidth="1" />
      <circle cx="200" cy="200" r="90" strokeWidth="0.8" />
      <path d="M10 200h380M200 10v380M66 66l268 268" strokeWidth="0.8" />
    </svg>
  );
}

/**
 * "لماذا تختارنا؟" (also the target of "عن الشركة" in the header): light section, four light cards
 * in a row, and on wide screens a dark car-front photo on the right with a diagonal edge.
 * Photo: SECTION_PHOTOS.why (lib/showcase-images.ts).
 */
export default function WhyChooseUs() {
  return (
    <section id="why" aria-labelledby="why-title" className="relative scroll-mt-24 overflow-hidden bg-cloud">
      <Watermark />

      {/* Photo on the right edge, its left side cut diagonally (narrow at the top, wide at the bottom). */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[30%] [clip-path:polygon(32%_0,100%_0,100%_100%,0_100%)] lg:block">
        <Image src={SECTION_PHOTOS.why} alt="" fill sizes="30vw" className="object-cover object-center" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-6">
        <div className="lg:mr-[26%]">
          <SectionTitle id="why-title" label="Why choose us" title="لماذا تختارنا؟" tone="light" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {POINTS.map((p) => (
              <div key={p.icon} className="flex flex-col items-center gap-3 rounded-ui bg-cloud-card px-3 py-6 text-center shadow-soft">
                <span className="text-ink">{ICONS[p.icon]}</span>
                <p className="text-sm leading-relaxed sm:text-[15px]">
                  <span className="block font-bold text-ink">{p.lines[0]}</span>
                  <span className="block text-ink-soft">{p.lines[1]}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phones/tablets: the photo as a band under the cards, diagonal top edge. */}
      <div aria-hidden="true" className="relative h-44 [clip-path:polygon(0_22%,100%_0,100%_100%,0_100%)] sm:h-60 lg:hidden">
        <Image src={SECTION_PHOTOS.why} alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>
    </section>
  );
}
