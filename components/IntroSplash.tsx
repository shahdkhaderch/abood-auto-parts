"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { INTRO_KEY } from "@/lib/intro";

/** Shown at least this long (from the first paint), so the logo animation is seen calmly. */
const MIN_MS = 2500;
const MIN_REDUCED_MS = 1000;
/** Latest start of the fade (after first paint), so the overlay is gone by 6 s even on slow connections.
 * Same value as the CSS fallback delay in globals.css, which covers JavaScript that has not arrived yet. */
const MAX_MS = 5400;
/** Fade-out length: keep in sync with .intro-leave in globals.css. */
const FADE_MS = 600;
const FADE_REDUCED_MS = 250;

/** Resolves when the image has loaded (or failed) and is decoded, so it paints at once when the overlay lifts. */
function imageReady(img: HTMLImageElement): Promise<void> {
  const decode = () => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve());
  if (img.complete && img.naturalWidth > 0) return decode();
  return new Promise((resolve) => {
    img.addEventListener("load", () => void decode().then(() => resolve()), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

/**
 * Intro overlay, once per browser session: Abood's logo fades in and scales 0.92 → 1, then the overlay
 * fades out (0.6 s) and is removed from the DOM.
 *
 * It stays until the images above the fold are loaded and decoded — every <img data-intro-wait> (the hero
 * photo and the category cards just under it, which load eagerly while the overlay is up) — but at least
 * 2.5 s, and gone by 6 s after the first paint (the fade starts at 5.4 s at the latest). Pages without such images (e.g. a first visit to /products)
 * just wait the minimum. Without JavaScript (or before it arrives on a slow connection) the CSS starts the same fade at 5.4 s and lets clicks through.
 * Reduced motion: no scaling, at least 1 s, quick fade. Already seen this session: hidden before first paint
 * by the inline script in layout.tsx and removed straight away.
 */
export default function IntroSplash() {
  const [phase, setPhase] = useState<"show" | "leave" | "gone">("show");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // storage blocked: the intro just plays
    }
    const timers: number[] = [];
    if (seen) {
      timers.push(window.setTimeout(() => setPhase("gone"), 0));
      return () => timers.forEach(clearTimeout);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fade = reduced ? FADE_REDUCED_MS : FADE_MS;
    // Count from the first paint (when the overlay appeared), not from hydration, which can be late on slow phones.
    const paint = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? performance.now();
    const at = (ms: number) => Math.max(0, paint + ms - performance.now());

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setPhase("leave");
      timers.push(window.setTimeout(() => setPhase("gone"), fade));
    };

    timers.push(window.setTimeout(finish, at(MAX_MS)));
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-intro-wait]"));
    Promise.all(images.map(imageReady)).then(() => timers.push(window.setTimeout(finish, at(reduced ? MIN_REDUCED_MS : MIN_MS))));

    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`intro fixed inset-0 z-[100] flex items-center justify-center bg-page${phase === "leave" ? " intro-leave" : ""}`} aria-hidden="true">
      <Image src="/abood-mark.png" alt="" width={120} height={120} priority className="intro-logo h-[120px] w-[120px] object-contain" />
    </div>
  );
}
