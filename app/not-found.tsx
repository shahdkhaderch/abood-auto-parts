import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/components/ui";

// 404 for unknown pages and product codes that are not in the sheet.
export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-page px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-extrabold text-fg sm:text-3xl">الصفحة غير موجودة</h1>
        <p className="mt-3 text-base text-mist">الرابط اللي فتحته مش موجود أو القطعة ما عادت معروضة.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/products" className={btnPrimary}>تصفح القطع</Link>
          <Link href="/" className={btnSecondary}>الرئيسية</Link>
        </div>
      </div>
    </main>
  );
}
