import { getStoreSettings } from "@/features/settings/queries";
import { MapsViewer } from "@/components/site/maps-viewer";
import { LocalBusinessJsonLd } from "@/components/site/json-ld";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Metadata } from "next";
import { MapPin, Clock, Phone, MessageCircle, ExternalLink } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contoh-umkm.my.id";

  return {
    title: `Kontak & Alamat Lokasi - ${settings.name}`,
    description: `Hubungi kami via WhatsApp di ${settings.waNumber} atau kunjungi gerai kami di ${settings.address || "kota kami"}.`,
    alternates: {
      canonical: `${siteUrl}/kontak`,
    },
  };
}

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contoh-umkm.my.id";

  const waUrl = buildWhatsAppUrl(
    settings.waNumber,
    `Halo ${settings.name}, saya ingin menanyakan lokasi toko atau memesan produk.`
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <LocalBusinessJsonLd
        name={settings.name}
        description={settings.tagline}
        telephone={settings.waNumber}
        address={settings.address}
        url={`${siteUrl}/kontak`}
        openHours={settings.openHours}
      />

      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
          Kontak & Lokasi
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Silakan hubungi kami via WhatsApp atau kunjungi langsung gerai fisik kami.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Contact Details Cards */}
        <div className="space-y-6">
          {/* WhatsApp Card */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-emerald-950 text-base sm:text-lg">
                  Layanan WhatsApp Resmi
                </h2>
                <p className="text-xs text-emerald-700">Respon cepat setiap jam operasional</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              Paling mudah pesan melalui WhatsApp! Admin kami siap membantu rincian pesanan, konfirmasi ketersediaan menu, dan informasi biaya pengiriman.
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi: {settings.waNumber}</span>
            </a>
          </div>

          {/* Store Info Details */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
            <h2 className="font-bold text-stone-900 text-base">Alamat & Jam Operasional</h2>

            {settings.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                    Alamat Lengkap
                  </span>
                  <p className="text-sm text-stone-800 mt-0.5 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>
            )}

            {settings.openHours && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                    Jam Buka
                  </span>
                  <p className="text-sm text-stone-800 mt-0.5">
                    {settings.openHours}
                  </p>
                </div>
              </div>
            )}

            {/* Socials & Marketplaces */}
            {settings.socials && Object.keys(settings.socials).length > 0 && (
              <div className="pt-4 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2.5">
                  Toko Online & Media Sosial
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(settings.socials).map(([key, url]) => {
                    if (!url || typeof url !== "string") return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-medium capitalize transition"
                      >
                        <span>{key}</span>
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Google Maps Display */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Peta Lokasi
          </h2>
          <MapsViewer
            mapsEmbedUrl={settings.mapsEmbed}
            address={settings.address}
          />
        </div>
      </div>
    </div>
  );
}
