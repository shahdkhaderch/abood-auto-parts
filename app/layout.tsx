import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { getNavData } from "@/lib/filters";
import { getProducts } from "@/lib/products";
import { site, siteUrl } from "@/lib/site";

// Arabic-first typeface (also covers Latin model names such as "C Class").
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "abood-parts - موقع قطع سيارات",
  description: "موقع عرض قطع مرسيدس و التواصل عبر واتساب",
  icons: { icon: "/favicon.ico" },
  openGraph: { siteName: site.name, locale: "ar_PS", type: "website" },
};

// Browser UI colour = the page background token (--color-page).
export const viewport: Viewport = { themeColor: "#fafaf8" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Only models/categories/offers that have products are shown in the navigation.
  const nav = getNavData(await getProducts());

  return (
    <html lang="ar" dir="rtl" className={plexArabic.variable}>
      <body className="bg-page font-sans text-ink antialiased">
        <Navbar nav={nav} />
        {children}
        <Footer nav={nav} />
        <MobileBottomNav />
      </body>
    </html>
  );
}
