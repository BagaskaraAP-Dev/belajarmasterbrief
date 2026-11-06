"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WaButtonProps = {
  waNumber: string;
  storeName: string;
};

export function FloatingWhatsAppButton({ waNumber, storeName }: WaButtonProps) {
  const greetingText = `Halo ${storeName}, saya tertarik dan ingin bertanya mengenai produk Anda.`;
  const waUrl = buildWhatsAppUrl(waNumber, greetingText);

  return (
    <aside aria-label="Bantuan WhatsApp" className="fixed bottom-5 right-5 z-50 flex items-center group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami via WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 text-white font-medium shadow-lg hover:bg-emerald-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-emerald-400"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="text-sm font-semibold hidden sm:inline-block">
          Pesan via WhatsApp
        </span>
      </a>
    </aside>
  );
}
