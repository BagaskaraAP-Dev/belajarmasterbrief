"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStoreSettingsAction } from "@/features/settings/actions";
import { Check, AlertCircle, Loader2 } from "lucide-react";

type StoreSettingsData = {
  name: string;
  tagline: string | null;
  address: string | null;
  mapsEmbed: string | null;
  waNumber: string;
  openHours: string | null;
  socials: Record<string, string>;
  heroTitle: string | null;
  heroText: string | null;
};

export function SettingsManager({ initialData }: { initialData: StoreSettingsData }) {
  const router = useRouter();

  const [name, setName] = useState(initialData.name);
  const [tagline, setTagline] = useState(initialData.tagline || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [mapsEmbed, setMapsEmbed] = useState(initialData.mapsEmbed || "");
  const [waNumber, setWaNumber] = useState(initialData.waNumber);
  const [openHours, setOpenHours] = useState(initialData.openHours || "");
  const [heroTitle, setHeroTitle] = useState(initialData.heroTitle || "");
  const [heroText, setHeroText] = useState(initialData.heroText || "");

  const [instagram, setInstagram] = useState(initialData.socials.instagram || "");
  const [tiktok, setTiktok] = useState(initialData.socials.tiktok || "");
  const [shopee, setShopee] = useState(initialData.socials.shopee || "");
  const [tokopedia, setTokopedia] = useState(initialData.socials.tokopedia || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(false);
    setIsSubmitting(true);

    try {
      const res = await updateStoreSettingsAction({
        name,
        tagline: tagline || null,
        address: address || null,
        mapsEmbed: mapsEmbed || null,
        waNumber,
        openHours: openHours || null,
        heroTitle: heroTitle || null,
        heroText: heroText || null,
        socials: {
          instagram,
          tiktok,
          shopee,
          tokopedia,
        },
      });

      if (res.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
        router.refresh();
      } else {
        setErrorMsg(res.error || "Gagal menyimpan pengaturan.");
      }
    } catch {
      setErrorMsg("Terjadi gangguan sistem saat menyimpan pengaturan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-stone-500">
          Perubahan pada halaman ini langsung tampil di situs publik tanpa deploy ulang.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow transition flex items-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs sm:text-sm rounded-2xl border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Pengaturan toko berhasil diperbarui!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 text-xs sm:text-sm rounded-2xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profil Usaha */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-stone-900 text-base">Identitas & Kontak Toko</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Nama Usaha UMKM *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Tagline / Slogan
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Nomor WhatsApp Penerima Pesanan *
            </label>
            <input
              type="text"
              required
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Jam Operasional
            </label>
            <input
              type="text"
              value={openHours}
              onChange={(e) => setOpenHours(e.target.value)}
              placeholder="Setiap Hari: 08.00 - 21.00 WIB"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
            Alamat Fisik Lengkap
          </label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
            URL Embed Google Maps (google.com/maps/embed)
          </label>
          <input
            type="text"
            value={mapsEmbed}
            onChange={(e) => setMapsEmbed(e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Teks Beranda & Hero */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-stone-900 text-base">Teks Utama Beranda (Hero)</h2>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
            Judul Utama Hero
          </label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
            Paragraf Penjelas Hero
          </label>
          <textarea
            rows={3}
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Media Sosial & Marketplace */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-stone-900 text-base">Tautan Medsos & Marketplace</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Link Instagram
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Link TikTok
            </label>
            <input
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              placeholder="https://tiktok.com/@..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Link Shopee
            </label>
            <input
              type="text"
              value={shopee}
              onChange={(e) => setShopee(e.target.value)}
              placeholder="https://shopee.co.id/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Link Tokopedia
            </label>
            <input
              type="text"
              value={tokopedia}
              onChange={(e) => setTokopedia(e.target.value)}
              placeholder="https://tokopedia.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
