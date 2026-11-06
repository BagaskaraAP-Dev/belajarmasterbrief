import "server-only";
import { db } from "@/lib/db";

export type StoreSettings = {
  id: number;
  name: string;
  tagline: string | null;
  logoUrl: string | null;
  address: string | null;
  mapsEmbed: string | null;
  waNumber: string;
  openHours: string | null;
  socials: Record<string, string>;
  heroTitle: string | null;
  heroText: string | null;
};

export const defaultSettings: StoreSettings = {
  id: 1,
  name: "[ISI] Toko Berkah UMKM",
  tagline: "[ISI] Cita Rasa Asli Pilihan Keluarga Indonesia",
  logoUrl: null,
  address: "[ISI] Jl. Merdeka No. 123, Kelurahan, Kecamatan, Kota Palembang, Sumatera Selatan",
  mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127504.42854974246!2d104.692923!3d-2.990934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75e8e3d83333%3A0x3039d80b220cc80!2sPalembang!5e0!3m2!1sid!2sid!4v1600000000000!5m2!1sid!2sid",
  waNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890",
  openHours: "[ISI] Setiap Hari: 08.00 - 21.00 WIB",
  socials: {
    instagram: "https://instagram.com/[ISI]",
    tiktok: "https://tiktok.com/@[ISI]",
    facebook: "https://facebook.com/[ISI]",
    shopee: "https://shopee.co.id/[ISI]",
    tokopedia: "https://tokopedia.com/[ISI]",
  },
  heroTitle: "[ISI] Nikmati Kelezatan Kuliner Khas Berkualitas",
  heroText: "[ISI] Dibuat dengan bahan baku segar pilihan dan resep istimewa turun-temurun untuk kepuasan pelanggan setia kami.",
};

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const setting = await db.storeSetting.findUnique({
      where: { id: 1 },
    });

    if (!setting) {
      return defaultSettings;
    }

    return {
      ...setting,
      socials: (setting.socials as Record<string, string>) || defaultSettings.socials,
    };
  } catch {
    return defaultSettings;
  }
}
