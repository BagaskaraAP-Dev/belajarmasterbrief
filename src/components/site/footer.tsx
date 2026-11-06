import Link from "next/link";
import { MapPin, Clock, Phone, ShieldCheck, Heart } from "lucide-react";

type FooterProps = {
  storeName: string;
  tagline: string | null;
  address: string | null;
  openHours: string | null;
  waNumber: string;
  socials: Record<string, string>;
};

export function Footer({
  storeName,
  tagline,
  address,
  openHours,
  waNumber,
  socials,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 sm:pb-12 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
                {storeName.replace(/\[ISI\]/g, "").trim().charAt(0) || "U"}
              </div>
              <span className="text-xl font-bold text-white">{storeName}</span>
            </div>
            {tagline && <p className="text-stone-400 text-sm max-w-md">{tagline}</p>}
            <p className="text-xs text-stone-400 leading-relaxed max-w-md pt-2">
              Menghadirkan produk kuliner UMKM berkualitas terbaik yang diolah dari bahan-bahan pilihan segar dengan standar rasa terpercaya.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:text-amber-400 transition">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-amber-400 transition">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-amber-400 transition">
                  Kontak & Lokasi
                </Link>
              </li>
              <li>
                <Link href="/keranjang" className="hover:text-amber-400 transition">
                  Keranjang Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Informasi Toko
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-stone-400">
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
              {openHours && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{openHours}</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>WhatsApp: {waNumber}</span>
              </div>
            </div>

            {/* Social media links */}
            {socials && Object.keys(socials).length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-stone-400 mb-2 font-medium">Ikuti Kami:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(socials).map(([key, url]) => {
                    if (!url || typeof url !== "string") return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-xs rounded bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 capitalize transition border border-stone-700"
                      >
                        {key}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright and admin link */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p className="flex items-center gap-1">
            <span>© {currentYear} {storeName}. Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>untuk UMKM Indonesia.</span>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-stone-400 hover:text-stone-300 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Login Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
