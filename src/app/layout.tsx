import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "[ISI_NAMA_USAHA] - Website Resmi",
  description: "Website resmi [ISI_NAMA_USAHA]. Katalog produk terbaik dan pemesanan praktis via WhatsApp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
