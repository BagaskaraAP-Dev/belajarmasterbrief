"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Minus, Plus, ShoppingBag, MessageCircle, Check } from "lucide-react";

type Variant = {
  id: string;
  name: string;
  priceDiff: number;
};

type ProductOrderBoxProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    isAvailable: boolean;
    stock?: number | null;
    variants: Variant[];
    imagePath?: string | null;
  };
  waNumber: string;
};

export function ProductOrderBox({ product, waNumber }: ProductOrderBoxProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const currentUnitPrice = product.price + (selectedVariant?.priceDiff || 0);
  const currentTotalPrice = currentUnitPrice * qty;

  const handleAddToCart = () => {
    if (!product.isAvailable) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imagePath: product.imagePath || null,
      price: currentUnitPrice,
      variantId: selectedVariant?.id || null,
      variantName: selectedVariant?.name || null,
      qty,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const variantText = selectedVariant ? ` (Varian: ${selectedVariant.name})` : "";
    const message = `Halo, saya ingin pesan langsung produk berikut:\n\n- ${product.name}${variantText}\n- Jumlah: ${qty}\n- Total: ${formatRupiah(currentTotalPrice)}\n\nMohon info ketersediaan dan ongkos kirim. Terima kasih!`;
    const url = buildWhatsAppUrl(waNumber, message);
    window.open(url, "_blank");
  };

  return (
    <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-6">
      {/* Price display */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          {formatRupiah(currentUnitPrice)}
        </span>
        {product.comparePrice && product.comparePrice > product.price && (
          <span className="text-sm text-stone-400 line-through">
            {formatRupiah(product.comparePrice + (selectedVariant?.priceDiff || 0))}
          </span>
        )}
      </div>

      {/* Stock & Availability info */}
      <div>
        {product.isAvailable ? (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-700">
              {product.stock !== null && product.stock !== undefined
                ? `Stok tersedia: ${product.stock} pcs`
                : "Produk Tersedia"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-xs font-semibold text-red-700">
              Stok Habis Sementara
            </span>
          </div>
        )}
      </div>

      {/* Variant Selector */}
      {product.variants.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Pilih Varian
          </label>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                    isSelected
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-white text-stone-700 border-stone-200 hover:border-amber-400"
                  }`}
                >
                  <span>{v.name}</span>
                  {v.priceDiff !== 0 && (
                    <span className="ml-1 opacity-90 text-[11px]">
                      ({v.priceDiff > 0 ? "+" : ""}{formatRupiah(v.priceDiff)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
          Jumlah Pesanan
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-stone-200 p-1">
            <button
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              disabled={qty <= 1 || !product.isAvailable}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Kurangi jumlah"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-bold text-stone-900 text-sm">
              {qty}
            </span>
            <button
              onClick={() =>
                setQty((prev) =>
                  product.stock ? Math.min(product.stock, prev + 1) : prev + 1
                )
              }
              disabled={
                !product.isAvailable ||
                (product.stock !== null &&
                  product.stock !== undefined &&
                  qty >= product.stock)
              }
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Tambah jumlah"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-stone-500">
            Total Subtotal: <strong className="text-stone-900">{formatRupiah(currentTotalPrice)}</strong>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-sm ${
            !product.isAvailable
              ? "bg-stone-300 text-stone-500 cursor-not-allowed"
              : isAdded
              ? "bg-emerald-600 text-white"
              : "bg-amber-600 hover:bg-amber-700 active:scale-98 text-white"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              <span>Berhasil Ditambahkan ke Keranjang</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>+ Tambah ke Keranjang</span>
            </>
          )}
        </button>

        <button
          onClick={handleDirectWhatsApp}
          disabled={!product.isAvailable}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-98 border border-emerald-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Pesan Langsung via WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
