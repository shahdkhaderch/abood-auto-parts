"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { INTRO_KEY } from "@/lib/intro";

/** Matches the CSS timeline in globals.css (.intro): fade-out ends at 1.6 s (0.85 s with reduced motion). */
const TOTAL_MS = 1650;
const TOTAL_REDUCED_MS = 900;

/**
 * Intro overlay, once per browser session (owner request 2026-11-21: simple and smooth): Abood's logo
 * fades in and scales 0.92 → 1 (0.6 s, ease-out), holds ~0.5 s, then the overlay fades out (0.5 s); about
 * 1.6 s in all. The timeline is CSS (globals.css, .intro), so it also ends without JavaScript; this component
 * only marks it as seen and removes it from the DOM. The page renders underneath the whole time.
 * Already seen this session: the inline script in layout.tsx hides it before first paint.
 */
export default function IntroSplash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // storage blocked: the intro just plays (CSS ends it)
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The CSS timeline starts with the page, not with hydration: count from page load (performance.now()),
    // so the overlay leaves the DOM right after its fade-out even when JavaScript arrives late.
    const total = reduced ? TOTAL_REDUCED_MS : TOTAL_MS;
    const t = window.setTimeout(() => setGone(true), seen ? 0 : Math.max(0, total - performance.now()));
    return () => window.clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro fixed inset-0 z-[100] flex items-center justify-center bg-page" aria-hidden="true">
      <Image src="/abood-mark.png" alt="" width={120} height={120} priority className="intro-logo h-[120px] w-[120px] object-contain" />
    </div>
  );
}
