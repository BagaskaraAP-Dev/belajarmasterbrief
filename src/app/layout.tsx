import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

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
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

