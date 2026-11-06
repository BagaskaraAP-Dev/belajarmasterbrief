"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

type GalleryImage = {
  path: string;
  alt: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex];

  if (!images || images.length === 0) {
    return (
      <div className="aspect-4/3 w-full bg-stone-100 rounded-2xl flex flex-col items-center justify-center text-stone-400 border border-stone-200">
        <ShoppingBag className="w-16 h-16 stroke-1 mb-2" />
        <span className="text-sm font-medium">Foto produk belum tersedia</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Large Display (4:3 Ratio) */}
      <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
        {activeImage.path && activeImage.path !== "/placeholder-product.jpg" ? (
          <Image
            src={activeImage.path}
            alt={activeImage.alt || productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
            <ShoppingBag className="w-16 h-16 stroke-1 mb-2" />
            <span className="text-sm font-medium">Foto produk</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                activeIndex === idx
                  ? "border-amber-600 ring-2 ring-amber-600/30"
                  : "border-stone-200 opacity-70 hover:opacity-100"
              }`}
              aria-label={`Lihat foto ${idx + 1}`}
            >
              <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                Foto {idx + 1}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
