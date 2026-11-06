"use client";

import { useCart } from "@/lib/cart-context";
import { formatRupiah } from "@/lib/format";
import { createOrderAction } from "@/features/orders/actions";
import Link from "next/link";
import { useState } from "react";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice, totalItems, isLoaded } =
    useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderCode: string;
    waUrl: string;
  } | null>(null);

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-stone-500">
        <div className="animate-pulse">Memuat keranjang belanja...</div>
      </div>
    );
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-stone-900">
            Keranjang Belanja Masih Kosong
          </h1>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Yuk pilih menu favorit Anda di katalog dan kumpulkan di keranjang ini.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow transition"
          >
            <span>Mulai Belanja</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage("Silakan isi nama lengkap pemesan.");
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      setErrorMessage("Silakan isi nomor WhatsApp aktif minimal 9 digit.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createOrderAction({
        customerName,
        customerPhone,
        address,
        note,
        hp_website: honeypot,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          qty: i.qty,
        })),
      });

      if (!result.success || !result.waUrl) {
        setErrorMessage(result.error || "Gagal memproses pesanan. Silakan coba kembali.");
        setIsSubmitting(false);
        return;
      }

      // Success: clear cart and redirect to wa.me
      clearCart();
      setOrderSuccess({
        orderCode: result.orderCode!,
        waUrl: result.waUrl,
      });

      // Automatically redirect browser to WhatsApp
      window.location.href = result.waUrl;
    } catch {
      setErrorMessage("Terjadi gangguan jaringan saat memproses pesanan.");
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-sm text-stone-600">
            Nomor Pesanan: <strong className="text-amber-800">{orderSuccess.orderCode}</strong>
          </p>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Halaman WhatsApp sedang dibuka otomatis untuk meneruskan pesanan Anda ke admin kami. Jika aplikasi WhatsApp tidak terbuka otomatis, silakan klik tombol di bawah:
          </p>
        </div>

        <div className="pt-2">
          <a
            href={orderSuccess.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>Buka WhatsApp Sekarang</span>
          </a>
        </div>

        <div className="pt-4">
          <Link href="/produk" className="text-xs font-semibold text-stone-500 hover:text-stone-800">
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Keranjang Belanja
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Periksa kembali rincian produk pesanan Anda sebelum mengirim ke WhatsApp toko.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <Link
                    href={`/produk/${item.productSlug}`}
                    className="font-bold text-sm sm:text-base text-stone-900 hover:text-amber-700 transition"
                  >
                    {item.productName}
                  </Link>

                  {item.variantName && (
                    <span className="text-xs text-amber-700 font-medium block">
                      Varian: {item.variantName}
                    </span>
                  )}

                  <div className="text-xs sm:text-sm font-semibold text-stone-600 pt-1">
                    {formatRupiah(item.price)} × {item.qty} ={" "}
                    <strong className="text-stone-900">
                      {formatRupiah(item.price * item.qty)}
                    </strong>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2.5 shrink-0">
                  <div className="flex items-center bg-stone-50 rounded-lg border border-stone-200 p-0.5">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-stone-600 hover:bg-stone-200"
                      aria-label="Kurangi"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-stone-600 hover:bg-stone-200"
                      aria-label="Tambah"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-400 hover:text-red-600 text-xs flex items-center gap-1 transition p-1"
                    aria-label={`Hapus ${item.productName}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/produk"
              className="text-xs sm:text-sm font-semibold text-amber-700 hover:underline"
            >
              ← Tambah Produk Lain
            </Link>
            <button
              onClick={clearCart}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>

        {/* Right: Checkout Details Form */}
        <div className="lg:col-span-5 bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-6">
          <h2 className="text-base font-bold text-stone-900">
            Rincian Pemesanan
          </h2>

          {/* Subtotal Summary */}
          <div className="space-y-2 border-b border-stone-200 pb-4 text-xs sm:text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Total Item ({totalItems} pcs)</span>
              <span>{formatRupiah(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Perkiraan Ongkos Kirim</span>
              <span className="italic text-stone-500">Dikonfirmasi via WA</span>
            </div>
            <div className="flex justify-between font-extrabold text-base sm:text-lg text-stone-900 pt-2 border-t border-stone-200">
              <span>Subtotal Produk</span>
              <span className="text-amber-800">{formatRupiah(totalPrice)}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCheckout} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Anti-spam honeypot field - invisible to humans */}
            <div style={{ display: "none" }} aria-hidden="true">
              <label htmlFor="hp_website">Jangan isi bagian ini</label>
              <input
                id="hp_website"
                type="text"
                name="hp_website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="customerName"
                className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1"
              >
                Nama Lengkap *
              </label>
              <input
                id="customerName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label
                htmlFor="customerPhone"
                className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1"
              >
                Nomor WhatsApp *
              </label>
              <input
                id="customerPhone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1"
              >
                Alamat Kirim / Nomor Meja (Opsional)
              </label>
              <textarea
                id="address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Mawar No. 12, RT 01/RW 02..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label
                htmlFor="note"
                className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1"
              >
                Catatan Pesanan (Opsional)
              </label>
              <input
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Sambal dipisah, tanpa sedotan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm sm:text-base shadow flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Memproses Pesanan...</span>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Kirim Pesanan ke WhatsApp</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-stone-400 text-center leading-relaxed">
            Pesanan akan disimpan otomatis dan diteruskan langsung ke WhatsApp toko kami. Tanpa biaya admin tambahan.
          </p>
        </div>
      </div>
    </div>
  );
}
