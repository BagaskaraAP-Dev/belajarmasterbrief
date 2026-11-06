export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-4">
          UMKM Digital
        </span>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          [ISI_NAMA_USAHA]
        </h1>
        <p className="text-stone-600 text-sm mb-6">
          Selamat datang di website resmi kami. Katalog produk dan pemesanan WhatsApp segera hadir.
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-stone-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistem Fondasi Aktif (Next.js 16 + Docker)
        </div>
      </div>
    </main>
  );
}
