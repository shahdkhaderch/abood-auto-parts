import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { getNavData } from "@/lib/filters";
import { getProducts } from "@/lib/products";
import { site, siteUrl } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "abood-parts - موقع قطع سيارات",
  description: "موقع عرض قطع مرسيدس و التواصل عبر واتساب",
  icons: { icon: "/favicon.ico" },
  openGraph: { siteName: site.name, locale: "ar_PS", type: "website" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Only models/categories/offers that have products are shown in the navigation.
  const nav = getNavData(await getProducts());

  return (
    <html lang="ar" dir="rtl" className="bg-white">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}>
        <Navbar nav={nav} />
        <div className="pb-24">{children}</div>
        <Footer nav={nav} />
        <MobileBottomNav />
      </body>
    </html>
  );
}