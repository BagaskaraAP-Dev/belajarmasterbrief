import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "[ISI] Toko Berkah UMKM",
    short_name: "UMKM Store",
    description: "Katalog produk kuliner nusantara berkualitas tinggi dan pemesanan via WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#b45309",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
