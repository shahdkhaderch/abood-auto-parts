"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import PhotoBadge from "@/components/PhotoBadge";

type Props = {
  photos: string[];
  alt: string;
  /** Classes for the main image frame (size, aspect, rounding). */
  className: string;
  /** Shown when no photo loads at all. */
  fallback: ReactNode;
};

// Labels in words: no numbers are shown anywhere on the site (owner decision).
const ORDINALS = ["الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة", "السابعة", "الثامنة", "التاسعة", "العاشرة"];
const ordinal = (i: number) => ORDINALS[i] ?? "التالية";

/**
 * Product page gallery: main image (swipe between photos on touch, scroll-snap) with thumbnails
 * under it. Every photo carries the brand badge. Photos that fail to load are dropped; if none
 * loads, the placeholder is shown.
 */
export default function ProductGallery({ photos, alt, className, fallback }: Props) {
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const visible = photos.filter((p) => !failed.has(p));
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Follow the slide in view (swipe, trackpad, or thumbnail click).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || visible.length < 2) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root: track, threshold: 0.6 },
    );
    slideRefs.current.slice(0, visible.length).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [visible.length]);

  if (visible.length === 0) return fallback;
  const current = Math.min(active, visible.length - 1);

  const goTo = (i: number) => {
    setActive(i);
    slideRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className={`${className} bg-white`}>
        <div
          ref={trackRef}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-roledescription="carousel"
          aria-label={alt}
        >
          {visible.map((src, i) => (
            <div
              key={src}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-index={i}
              className="relative h-full w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={`الصورة ${ordinal(i)}`}
            >
              <Image
                src={src}
                alt={i === 0 ? alt : `${alt} - الصورة ${ordinal(i)}`}
                fill
                priority={i === 0}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-contain"
                onError={() => setFailed((s) => new Set(s).add(src))}
              />
              <PhotoBadge variant="page" />
            </div>
          ))}
        </div>
      </div>

      {visible.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="صور القطعة">
          {visible.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`عرض الصورة ${ordinal(i)}`}
              onClick={() => goTo(i)}
              className={[
                "relative h-16 w-16 overflow-hidden rounded-xl border bg-white transition sm:h-20 sm:w-20",
                i === current ? "border-orange-500 ring-2 ring-orange-500/40" : "border-neutral-200 opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
