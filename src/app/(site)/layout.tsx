import { getStoreSettings } from "@/features/settings/queries";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsAppButton } from "@/components/site/wa-button";
import { CartProvider } from "@/lib/cart-context";

export const dynamic = "force-dynamic";

export default async function SiteLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header storeName={settings.name} waNumber={settings.waNumber} />
        <main className="flex-1">{children}</main>
        <Footer
          storeName={settings.name}
          tagline={settings.tagline}
          address={settings.address}
          openHours={settings.openHours}
          waNumber={settings.waNumber}
          socials={settings.socials}
        />
        <FloatingWhatsAppButton
          waNumber={settings.waNumber}
          storeName={settings.name}
        />
      </div>
    </CartProvider>
  );
}
