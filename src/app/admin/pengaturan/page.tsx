import { getStoreSettings } from "@/features/settings/queries";
import { SettingsManager } from "@/components/admin/settings-manager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Pengaturan Toko
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Kelola profil toko, kontak WhatsApp, jam buka, dan tautan media sosial.
        </p>
      </div>

      <SettingsManager
        initialData={{
          name: settings.name,
          tagline: settings.tagline,
          address: settings.address,
          mapsEmbed: settings.mapsEmbed,
          waNumber: settings.waNumber,
          openHours: settings.openHours,
          socials: settings.socials,
          heroTitle: settings.heroTitle,
          heroText: settings.heroText,
        }}
      />
    </div>
  );
}
