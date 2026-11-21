import Image from "next/image";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { OFFER_LABEL, productsHref, type NavData } from "@/lib/filters";
import { phoneLink, site, whatsappLink } from "@/lib/site";

const social = "flex h-11 w-11 items-center justify-center rounded-full border border-field-line bg-field text-fg transition hover:border-mist";
const footLink = "text-mist transition hover:text-fg";

function IconPhone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Footer({ nav }: { nav: NavData }) {
  // Category / offer links only appear once the sheet has products for them.
  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "جميع القطع" },
    { href: "/about", label: "عن الشركة" },
    { href: "/contact", label: "تواصل معنا" },
    ...nav.categories.map((c) => ({ href: productsHref({ category: c.value }), label: c.label })),
    ...(nav.offerCount > 0 ? [{ href: productsHref({ offer: true }), label: OFFER_LABEL }] : []),
  ];

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-tile-line bg-night pb-20 text-fg sm:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1.1fr] lg:px-6">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image src="/abood-mark.png" alt={site.name} width={60} height={60} className="h-15 w-15 object-contain" />
            <div>
              <div className="text-lg font-bold">{site.name}</div>
              <div className="text-sm text-mist">{site.tagline}</div>
            </div>
          </div>
          <p className="max-w-sm text-[15px] leading-[1.9] text-mist">
            متجر متخصص في بيع قطع مرسيدس الأصلية والمستعملة بجودة ممتازة وأسعار منافسة مع التوصيل إلى جميع أنحاء فلسطين.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold">روابط سريعة</h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[15px]">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={footLink}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold">تواصل معنا</h3>
          <ul className="space-y-3 text-[15px]">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`${footLink} flex items-center gap-3`}>
                <span className="text-fg"><WhatsAppIcon size={18} /></span>واتساب
              </a>
            </li>
            <li>
              <a href={phoneLink} className={`${footLink} flex items-center gap-3`}>
                <span className="text-fg"><IconPhone /></span><span dir="ltr">{site.phoneDisplay}</span>
              </a>
            </li>
            <li className="flex items-start gap-3 text-mist">
              <span className="mt-0.5 text-fg"><IconPin /></span>{site.location}
            </li>
            <li className="flex items-start gap-3 text-mist">
              <span className="mt-0.5 text-fg"><IconClock /></span>
              <span>ساعات الدوام: {site.openingHours}</span>
            </li>
          </ul>

          <div className="mt-6 flex gap-2">
            <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="واتساب" className={social}><WhatsAppIcon /></a>
            <a href={site.facebookUrl} target="_blank" rel="noreferrer" aria-label="فيسبوك" className={social}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M22 12A10 10 0 1 0 10.4 21.9v-7H7.9V12h2.5V9.7c0-2.4 1.4-3.8 3.6-3.8 1 0 2.1.2 2.1.2v2.3H15c-1.2 0-1.6.7-1.6 1.5V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12" />
              </svg>
            </a>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="إنستغرام" className={social}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-tile-line px-4 py-4 text-center text-sm text-mist">© جميع الحقوق محفوظة - {site.name}</div>
    </footer>
  );
}
