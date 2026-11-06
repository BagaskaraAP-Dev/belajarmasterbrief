"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

type MapsViewerProps = {
  mapsEmbedUrl?: string | null;
  address?: string | null;
};

export function MapsViewer({ mapsEmbedUrl, address }: MapsViewerProps) {
  const [showMap, setShowMap] = useState(false);

  // Validate Google Maps embed URL for security
  const isValidUrl =
    mapsEmbedUrl &&
    (mapsEmbedUrl.startsWith("https://www.google.com/maps/embed") ||
      mapsEmbedUrl.startsWith("https://maps.google.com/maps"));

  if (!isValidUrl) {
    return (
      <div className="aspect-16/9 w-full bg-stone-100 rounded-2xl flex flex-col items-center justify-center text-stone-400 p-6 text-center border border-stone-200">
        <MapPin className="w-10 h-10 mb-2 stroke-1 text-stone-400" />
        <p className="text-sm font-medium text-stone-600">Peta Lokasi Toko</p>
        <p className="text-xs text-stone-400 mt-1 max-w-sm">
          {address || "Alamat toko dapat dilihat pada rincian informasi di samping."}
        </p>
      </div>
    );
  }

  if (!showMap) {
    return (
      <div className="aspect-16/9 w-full bg-stone-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-stone-200 space-y-3">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-stone-900 text-sm sm:text-base">
            Peta Lokasi Google Maps
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            Klik tombol di bawah untuk memuat peta interaktif.
          </p>
        </div>
        <button
          onClick={() => setShowMap(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-xs transition"
        >
          Tampilkan Peta Lokasi
        </button>
      </div>
    );
  }

  return (
    <div className="aspect-16/9 w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative">
      <iframe
        src={mapsEmbedUrl!}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Peta Lokasi Google Maps"
        className="w-full h-full"
      />
    </div>
  );
}
