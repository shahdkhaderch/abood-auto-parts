import type { Metadata, Viewport } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import IntroSplash from "@/components/IntroSplash";
import { INTRO_KEY } from "@/lib/intro";
import { getNavData } from "@/lib/filters";
import { getProducts } from "@/lib/products";
import { site, siteUrl } from "@/lib/site";

// Arabic typeface for every Arabic text on the site: a soft, elegant Naskh, chosen as the closest free
// match to the "Bobby Arabic" look the owner asked for (Bobby itself is a paid font; its trial is not for live sites).
// Highest weight is 700, so font-extrabold renders as 700.
const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Latin text: model names ("C Class", "AMG C205") and the small uppercase English labels.
// It comes first in the font stack but only covers Latin, so Arabic letters fall through to Naskh.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  // No generated Arial-based fallback: Arial has Arabic letters and would catch the Arabic text before Naskh.
  adjustFontFallback: false,
  fallback: [],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "abood-parts - موقع قطع سيارات",
  description: "موقع عرض قطع مرسيدس و التواصل عبر واتساب",
  icons: { icon: "/favicon.ico" },
  openGraph: { siteName: site.name, locale: "ar_PS", type: "website" },
};

// Browser UI colour = the header token (--color-header).
export const viewport: Viewport = { themeColor: "#383c44" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Only models/categories/offers that have products are shown in the navigation.
  const nav = getNavData(await getProducts());

  return (
    // suppressHydrationWarning: the inline script below may add data-intro-seen to <html> before React hydrates.
    <html lang="ar" dir="rtl" className={`${naskh.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-page font-sans text-fg antialiased">
        {/* Intro already played in this browser session → hide it before first paint (see IntroSplash). */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("${INTRO_KEY}")==="1")document.documentElement.setAttribute("data-intro-seen","")}catch(e){}` }} />
        <IntroSplash />
        <Navbar nav={nav} />
        {children}
        <Footer nav={nav} />
        <MobileBottomNav />
      </body>
    </html>
  );
}
