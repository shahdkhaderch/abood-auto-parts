export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          محلات عبود عبدربه لقطع السيارات
        </h1>

        <p className="text-gray-400">
          قطع مرسيدس أصلية ومستعملة – جودة مضمونة
        </p>

        <a
          href="https://wa.me/+972599842238"
          target="_blank"
          className="inline-block bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-400 transition"
        >
          تواصل معنا عبر واتساب
        </a>
      </div>
    </main>
  );
}
