"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Touch screens have no hover, so there the photos rotate on their own at this interval. */
const ROTATE_MS = 3000;

type Props = {
  /** All photos of the product, main first. */
  photos: string[];
  alt: string;
  sizes: string;
  priority?: boolean;
  className: string;
  /** Shown instead when no photo loads (e.g. the files are missing on Cloudinary). */
  fallback: ReactNode;
};

/**
 * Product card photo, nothing on top of it. Main photo: object-contain + multiply, so the white of the
 * catalogue shot takes the colour of the light image area (no white box). Further photos are usually car /
 * lifestyle shots: object-cover, edge to edge.
 * With 2+ photos: on hover-capable devices the second photo cross-fades in while the card (a `group`)
 * is hovered; on touch devices the photos rotate every 3 s while the card is on screen (not with
 * reduced motion, not in a background tab, and only to photos that have loaded).
 */
export default function ProductPhoto({ photos, alt, sizes, priority, className, fallback }: Props) {
  const [broken, setBroken] = useState<string[]>([]);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [step, setStep] = useState(0); // bumped by the rotation timer
  const boxRef = useRef<HTMLDivElement>(null);

  const list = photos.filter((p) => !broken.includes(p));
  const multi = list.length > 1;
  // Rotate only through photos that have loaded (the main one is always eligible), so a
  // half-loaded photo never fades in.
  const ready = list.filter((p, i) => i === 0 || loaded.includes(p));
  const currentSrc = ready.length ? ready[step % ready.length] : undefined;

  useEffect(() => {
    const el = boxRef.current;
    if (!multi || !el) return;
    const touchOnly = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touchOnly || reduced) return;

    let timer: number | undefined;
    const tick = () => {
      if (!document.hidden) setStep((s) => s + 1);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        timer = entry.isIntersecting ? window.setInterval(tick, ROTATE_MS) : undefined;
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [multi]);

  if (list.length === 0) return fallback;

  return (
    <div ref={boxRef} className={className}>
      {list.map((src, i) => {
        const shown = src === currentSrc;
        // Hover swap (Tailwind's group-hover only applies on devices that can hover).
        const hover = !multi ? "" : i === 0 ? "group-hover:opacity-0" : i === 1 ? "group-hover:opacity-100" : "";
        return (
          <Image
            key={src}
            src={src}
            alt={shown ? alt : ""}
            aria-hidden={shown ? undefined : true}
            fill
            priority={priority && i === 0}
            sizes={sizes}
            className={[i === 0 ? "object-contain mix-blend-multiply" : "object-cover", "transition-opacity duration-500", shown ? "opacity-100" : "opacity-0", hover].join(" ")}
            onLoad={() => setLoaded((l) => (l.includes(src) ? l : [...l, src]))}
            onError={() => setBroken((b) => (b.includes(src) ? b : [...b, src]))}
          />
        );
      })}
    </div>
  );
}
