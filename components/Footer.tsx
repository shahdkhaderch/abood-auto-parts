import Image from "next/image";
import Link from "next/link";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { OFFER_LABEL, productsHref, type NavData } from "@/lib/filters";
import { site, whatsappLink } from "@/lib/site";

const social = "flex h-11 w-11 items-center justify-center rounded-ui border border-line bg-card text-ink transition hover:border-accent hover:bg-accent-tint";

export default function Footer({ nav }: { nav: NavData }) {
  // Category / offer links only appear once the sheet has products for them.
  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "كل القطع" },
    ...nav.categories.map((c) => ({ href: productsHref({ category: c.value }), label: c.label })),
    ...(nav.offerCount > 0 ? [{ href: productsHref({ offer: true }), label: OFFER_LABEL }] : []),
  ];

  return (
    <footer className="mt-16 text-ink">
      {/* Soft fade from the page background into the footer surface: no hard edge between sections. */}
      <div aria-hidden="true" className="h-16 bg-gradient-to-b from-page to-soft" />

      <div className="bg-soft pb-20 sm:pb-0">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 pt-4 md:grid-cols-3">
          {/* about */}
          <div>
            <div className="mb-4 flex items-center gap-4">
              <Image src="/abood-mark.png" alt={site.name} width={64} height={64} className="h-16 w-16 object-contain" />
              <div>
                <div className="text-lg font-bold">عبود عبد ربه</div>
                <div className="text-sm text-ink-soft">قطع مرسيدس</div>
              </div>
            </div>

            <p className="text-base leading-[1.8] text-ink-soft">
              متجر متخصص في بيع قطع مرسيدس الأصلية والمستعملة
              بجودة ممتازة وأسعار منافسة مع التوصيل إلى جميع أنحاء فلسطين.
            </p>
          </div>

          {/* links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">روابط سريعة</h3>
            <ul className="space-y-2 text-base">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-soft transition hover:text-ink hover:underline hover:decoration-accent hover:decoration-2 hover:underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">تواصل معنا</h3>

            <div className="space-y-2 text-base text-ink-soft">
              <p>{site.location}</p>
              <p>التوصيل متوفر إلى جميع أنحاء فلسطين</p>
            </div>

            {/* social icons */}
            <div className="mt-6 flex gap-2">
              {/* whatsapp */}
              <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="واتساب" className={social}>
                <WhatsAppIcon />
              </a>

              {/* facebook */}
              <a href={site.facebookUrl} target="_blank" rel="noreferrer" aria-label="فيسبوك" className={social}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M22 12A10 10 0 1 0 10.4 21.9v-7H7.9V12h2.5V9.7c0-2.4 1.4-3.8 3.6-3.8 1 0 2.1.2 2.1.2v2.3H15c-1.2 0-1.6.7-1.6 1.5V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12" />
                </svg>
              </a>

              {/* instagram */}
              <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="إنستغرام" className={social}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="border-t border-line px-4 py-4 text-center text-sm text-ink-soft">
          © جميع الحقوق محفوظة - عبود عبد ربه
        </div>
      </div>
    </footer>
  );
}
