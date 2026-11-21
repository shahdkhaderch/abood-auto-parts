import type { Metadata } from "next";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { btnPrimaryLg, tile } from "@/components/ui";
import { mapsLink, phoneLink, site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `تواصل معنا | ${site.name}`,
  description: `تواصل مع ${site.name} عبر واتساب أو الهاتف. ${site.location}.`,
  alternates: { canonical: "/contact" },
};

const ic = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const ICONS = {
  phone: <svg {...ic} aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>,
  pin: <svg {...ic} aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  clock: <svg {...ic} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  facebook: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12A10 10 0 1 0 10.4 21.9v-7H7.9V12h2.5V9.7c0-2.4 1.4-3.8 3.6-3.8 1 0 2.1.2 2.1.2v2.3H15c-1.2 0-1.6.7-1.6 1.5V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12" /></svg>,
};

const row = `${tile} flex items-center gap-4 p-4 transition`;
const linkRow = `${row} hover:border-mist active:scale-[0.99]`;
const iconBox = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-field-line bg-field text-fg";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-page px-4 py-8 sm:py-12 lg:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-fg sm:text-4xl">تواصل معنا</h1>
        <p className="mt-3 text-base text-mist">أسرع طريقة: ابعتلنا على واتساب اسم القطعة أو صورتها وبنرد عليك.</p>

        <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`${btnPrimaryLg} mt-6 w-full`}>
          <WhatsAppIcon size={24} />
          تواصل واتساب
        </a>

        <ul className="mt-6 grid gap-3">
          <li>
            <a href={phoneLink} className={linkRow}>
              <span className={iconBox}>{ICONS.phone}</span>
              <span className="flex flex-col">
                <span className="text-sm text-mist-card">الهاتف</span>
                <span dir="ltr" className="text-right text-lg font-bold text-fg">{site.phoneLocal}</span>
              </span>
            </a>
          </li>
          <li>
            <a href={mapsLink} target="_blank" rel="noreferrer" className={linkRow}>
              <span className={iconBox}>{ICONS.pin}</span>
              <span className="flex flex-col">
                <span className="text-sm text-mist-card">العنوان (افتح بخرائط Google)</span>
                <span className="text-base font-bold text-fg">{site.location}</span>
              </span>
            </a>
          </li>
          <li className={row}>
            <span className={iconBox}>{ICONS.clock}</span>
            <span className="flex flex-col">
              <span className="text-sm text-mist-card">ساعات الدوام</span>
              <span className="text-base font-bold text-fg">{site.openingHours}</span>
            </span>
          </li>
          <li>
            <a href={site.facebookUrl} target="_blank" rel="noreferrer" className={linkRow}>
              <span className={iconBox}>{ICONS.facebook}</span>
              <span className="flex flex-col">
                <span className="text-sm text-mist-card">فيسبوك</span>
                <span className="text-base font-bold text-fg">صفحتنا على فيسبوك</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
