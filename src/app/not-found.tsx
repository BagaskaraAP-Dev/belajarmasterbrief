import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Maaf, halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau tautan yang Anda tuju salah ketik.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/produk"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition"
          >
            <span>Lihat Katalog Produk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
