import Link from "next/link";
import { getStoreSettings } from "@/features/settings/queries";
import { getFeaturedProducts } from "@/features/products/queries";
import { getVisibleTestimonials } from "@/features/testimonials/queries";
import { ProductCard } from "@/components/site/product-card";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  ShoppingBag,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Quote,
  MessageCircle,
} from "lucide-react";

export default async function HomePage() {
  const [settings, featuredProducts, testimonials] = await Promise.all([
    getStoreSettings(),
    getFeaturedProducts(),
    getVisibleTestimonials(),
  ]);

  const waHeroUrl = buildWhatsAppUrl(
    settings.waNumber,
    `Halo ${settings.name}, saya ingin memesan produk kuliner pilihan Anda.`
  );

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {settings.tagline && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs sm:text-sm font-semibold border border-amber-200/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{settings.tagline}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {settings.heroTitle || settings.name}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              {settings.heroText ||
                "Nikmati aneka pilihan kuliner khas nusantara yang diolah higienis dari bahan baku segar berkualitas tinggi dengan resep warisan terbaik."}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/produk"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Lihat Katalog Produk</span>
              </Link>
              <a
                href={waHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Pesan via WhatsApp</span>
              </a>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-stone-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bahan Pilihan Segar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Resep Otentik Khas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pesan Cepat via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Menu Terlaris & Rekomendasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Produk Unggulan Kami
            </h2>
          </div>
          <Link
            href="/produk"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-800 transition group"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-stone-100 rounded-2xl text-stone-500">
            Belum ada produk unggulan yang ditampilkan.
          </div>
        )}
      </section>

      {/* 3. Value Pillars (Keunggulan Usaha) */}
      <section className="bg-stone-100 py-16 border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Kenapa Memilih Kami
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Keunggulan Rasa & Pelayanan
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Kami selalu menjaga komitmen kualitas demi memberikan pengalaman kuliner terbaik bagi setiap pelanggan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900">Bahan Baku Segar</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Diproduksi setiap hari menggunakan bahan segar pilihan tanpa bahan pengawet berbahaya.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900">Cita Rasa Otentik</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Resep rahasia turun-temurun yang konsisten menghasilkan kelezatan khas dan bikin nagih.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900">Higienis & Halal</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Proses pengolahan bersih dan terstandarisasi dengan jaminan kehalalan 100% untuk ketenangan Anda.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
                4
              </div>
              <h3 className="text-base font-bold text-stone-900">Pemesanan Mudah</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Pilih produk, masukkan keranjang, dan kirim rincian pesanan langsung ke WhatsApp admin tanpa ribet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Testimonials */}
      {testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Ulasan Pelanggan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Apa Kata Mereka
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs relative space-y-4"
              >
                <Quote className="w-8 h-8 text-amber-200 absolute top-5 right-5" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-stone-700 text-sm sm:text-base italic leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="pt-2 border-t border-stone-100">
                  <span className="font-bold text-stone-900 text-sm block">
                    {t.name}
                  </span>
                  <span className="text-xs text-stone-400">Pelanggan Terverifikasi</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Location & Hours Brief */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Kunjungi Toko Kami
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold">
                {settings.name}
              </h2>
              <div className="space-y-2 text-sm text-amber-100 pt-2">
                {settings.address && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{settings.address}</span>
                  </div>
                )}
                {settings.openHours && (
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{settings.openHours}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <Link
                href="/kontak"
                className="px-6 py-3.5 rounded-xl bg-white text-stone-900 font-bold text-sm hover:bg-stone-100 transition text-center shadow"
              >
                Lihat Peta & Petunjuk Arah
              </Link>
              <a
                href={waHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition text-center shadow flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Chat Admin Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
