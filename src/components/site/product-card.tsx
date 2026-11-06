"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    isAvailable: boolean;
    isFeatured?: boolean;
    images?: Array<{ path: string; alt: string }>;
    category?: { name: string } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const mainImage = product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.isAvailable) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imagePath: mainImage?.path || null,
      price: product.price,
      variantId: null,
      variantName: null,
      qty: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200">
      {/* Product Image (1:1 Ratio) */}
      <Link href={`/produk/${product.slug}`} className="relative aspect-square w-full bg-stone-100 overflow-hidden block">
        {mainImage?.path && mainImage.path !== "/placeholder-product.jpg" ? (
          <Image
            src={mainImage.path}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <ShoppingBag className="w-10 h-10 mb-1 stroke-1" />
            <span className="text-xs font-medium">Foto produk</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {!product.isAvailable ? (
            <span className="px-2 py-0.5 rounded-md bg-stone-800/90 text-white text-[11px] font-bold backdrop-blur-xs">
              Habis
            </span>
          ) : product.isFeatured ? (
            <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[11px] font-bold shadow-xs">
              Unggulan
            </span>
          ) : null}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {product.category && (
            <span className="text-[11px] font-semibold text-amber-700 tracking-wider uppercase block mb-1">
              {product.category.name}
            </span>
          )}
          <Link
            href={`/produk/${product.slug}`}
            className="font-bold text-sm sm:text-base text-stone-900 line-clamp-2 hover:text-amber-700 transition"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-stone-900 leading-none">
              {formatRupiah(product.price)}
            </div>
            {product.comparePrice && product.comparePrice > product.price && (
              <div className="text-xs text-stone-400 line-through mt-0.5">
                {formatRupiah(product.comparePrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              !product.isAvailable
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white"
                : "bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-xs"
            }`}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Masuk</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>+ Keranjang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
