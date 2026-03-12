"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-black text-white">

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">

        {/* about */}
        <div>
          <div className="mb-4 flex items-center gap-3">

            <img
              src="/abood-logo.png"
              alt="عبود عبد ربه"
              className="h-16 w-16 rounded-2xl object-cover"
            />

            <div>
              <div className="text-lg font-extrabold">
                عبود عبد ربه
              </div>

              <div className="text-sm text-neutral-400">
                قطع مرسيدس
              </div>
            </div>

          </div>

          <p className="text-sm leading-7 text-neutral-400">
            متجر متخصص في بيع قطع مرسيدس الأصلية والمستعملة
            بجودة ممتازة وأسعار منافسة مع التوصيل إلى جميع أنحاء فلسطين.
          </p>

        </div>


        {/* links */}
        <div>

          <h3 className="mb-4 text-lg font-extrabold">
            روابط سريعة
          </h3>

          <ul className="space-y-3 text-sm text-neutral-400">

            <li>
              <Link href="/" className="hover:text-orange-500 transition">
                الرئيسية
              </Link>
            </li>

            <li>
              <Link href="#interior" className="hover:text-orange-500 transition">
                كماليات داخلية
              </Link>
            </li>

            <li>
              <Link href="#exterior" className="hover:text-orange-500 transition">
                كماليات خارجية
              </Link>
            </li>

            <li>
              <Link href="#lights" className="hover:text-orange-500 transition">
                أضوية السيارة
              </Link>
            </li>

            <li>
              <Link href="#offers" className="hover:text-orange-500 transition">
                العروض
              </Link>
            </li>

          </ul>

        </div>


        {/* contact */}
        <div>

          <h3 className="mb-4 text-lg font-extrabold">
            تواصل معنا
          </h3>

          <div className="space-y-3 text-sm text-neutral-400">

            <p>
              شارع الحسبة - مقابل كازية كنعان
            </p>

            <p>
              التوصيل متوفر إلى جميع أنحاء فلسطين
            </p>

          </div>

          {/* social icons */}

          <div className="mt-6 flex gap-4">

            {/* whatsapp */}
            <a
              href="https://wa.me/972599842238"
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 hover:bg-orange-500 transition"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M20.5 3.5A11.8 11.8 0 0 0 12 .1C5.6.1.4 5.3.4 11.7c0 2 .5 4 1.5 5.7L.1 23.9l6.7-1.7a11.8 11.8 0 0 0 5.2 1.3h.1c6.4 0 11.6-5.2 11.6-11.6 0-3.1-1.2-6-3.2-8zM12 21.3c-1.7 0-3.4-.5-4.8-1.4l-.3-.2-4 .9.9-3.9-.2-.3a9.6 9.6 0 1 1 8.4 4.9zm5.3-7.2c-.3-.2-1.6-.8-1.9-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.6-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.6.1-.1.3-.3.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.6-.4-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7 0 1.6 1.2 3.2 1.3 3.4.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.4z"/>
              </svg>
            </a>

            {/* facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61575819384981"
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 hover:bg-orange-500 transition"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M22 12A10 10 0 1 0 10.4 21.9v-7H7.9V12h2.5V9.7c0-2.4 1.4-3.8 3.6-3.8 1 0 2.1.2 2.1.2v2.3H15c-1.2 0-1.6.7-1.6 1.5V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12"/>
              </svg>
            </a>

            {/* instagram */}
            <a
              href="https://www.instagram.com/abood_abdrabu_parts/"
              target="_blank"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 hover:bg-orange-500 transition"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
              </svg>
            </a>

          </div>

        </div>

      </div>


      {/* bottom */}
      <div className="border-t border-neutral-800 py-4 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} جميع الحقوق محفوظة - عبود عبد ربه
      </div>

    </footer>
  );
}