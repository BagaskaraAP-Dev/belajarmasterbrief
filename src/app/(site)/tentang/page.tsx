import { getStoreSettings } from "@/features/settings/queries";
import Link from "next/link";
import { Sparkles, Heart, Award, Users, CheckCircle2, ArrowRight } from "lucide-react";

export default async function AboutPage() {
  const settings = await getStoreSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 sm:space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Mengenal Lebih Dekat</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
          Cerita & Perjalanan Kami
        </h1>
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Dedikasi tulus dari dapur UMKM lokal untuk menyajikan hidangan lezat penuh kehangatan keluarga.
        </p>
      </div>

      {/* Story Section */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
          Awal Mula Berdirinya {settings.name}
        </h2>
        <p>
          Berawal dari kecintaan keluarga kami terhadap aneka kuliner khas tradisional yang otentik dan kaya rasa, {settings.name} hadir sebagai wujud nyata komitmen kami melestarikan cita rasa warisan leluhur Indonesia.
        </p>
        <p>
          Kami percaya bahwa makanan bukan sekadar pengisi perut, melainkan sarana mempererat silaturahmi, menghangatkan momen kebersamaan, dan menghadirkan kenangan manis bagi setiap orang yang menikmatinya. Oleh karena itu, setiap sajian kami olah dengan sepenuh hati, kehati-hatian, dan standar kebersihan yang tinggi.
        </p>
        <p>
          Hingga saat ini, kami terus berupaya menghadirkan inovasi kemasan dan varian rasa tanpa sedikit pun mengurangi keaslian bumbu khas yang menjadi ciri utama produk kami.
        </p>
      </div>

      {/* Value Pillars */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-stone-900">Nilai-Nilai Utama Kami</h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Prinsip yang selalu kami pegang teguh dalam setiap proses produksi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900">Kualitas Tanpa Kompromi</h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Hanya memilih bahan baku segar kualitas terbaik tanpa campuran pengawet kimiawi berbahaya.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900">Dibuat Dengan Ketulusan</h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Setiap porsi diracik layaknya hidangan istimewa yang kami sajikan untuk keluarga tercinta di rumah.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900">Mengutamakan Pelanggan</h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Pelayanan ramah, responsif, dan keterbukaan menerima kritik demi terus tumbuh menjadi lebih baik.
            </p>
          </div>
        </div>
      </div>

      {/* Commitments list */}
      <div className="bg-stone-100 rounded-3xl p-6 sm:p-8 space-y-4 border border-stone-200">
        <h3 className="text-base font-bold text-stone-900">Standar Produksi & Kehalalan</h3>
        <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Semua bahan dan bumbu 100% Halal dan bersumber dari pemasok lokal terpercaya.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Peralatan dapur dibersihkan dan disanitasi secara berkala sesuai standar higienitas.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kemasan food-grade aman untuk makanan panas maupun pengiriman ke luar kota.</span>
          </li>
        </ul>
      </div>

      {/* CTA to Products */}
      <div className="text-center pt-4">
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm sm:text-base shadow transition group"
        >
          <span>Jelajahi Produk Pilihan Kami</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
