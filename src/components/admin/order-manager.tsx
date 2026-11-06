"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah, formatDate } from "@/lib/format";
import {
  updateOrderStatusAction,
  deleteOldOrdersAction,
} from "@/features/orders/actions";
import {
  MessageCircle,
  Clock,
  MapPin,
  FileText,
  Trash2,
} from "lucide-react";

type OrderItem = {
  id: string;
  productName: string;
  variantName: string | null;
  unitPrice: number;
  qty: number;
};

type OrderData = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  address: string | null;
  note: string | null;
  total: number;
  status: "BARU" | "DIPROSES" | "SELESAI" | "BATAL";
  createdAt: Date | string;
  items: OrderItem[];
};

export function OrderManager({
  orders,
  initialFilter = "SEMUA",
}: {
  orders: OrderData[];
  initialFilter?: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState(initialFilter);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredOrders =
    filter === "SEMUA"
      ? orders
      : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (
    orderId: string,
    newStatus: "BARU" | "DIPROSES" | "SELESAI" | "BATAL"
  ) => {
    setIsUpdating(orderId);
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Gagal mengubah status pesanan");
      }
    } finally {
      setIsUpdating(null);
    }
  };

  const handlePurgeOldOrders = async () => {
    const confirmPurge = window.confirm(
      "Apakah Anda yakin ingin menghapus semua riwayat pesanan yang lebih dari 90 hari sesuai kebijakan privasi (UU PDP)?"
    );
    if (!confirmPurge) return;

    try {
      const res = await deleteOldOrdersAction(90);
      if (res.success) {
        alert(`Berhasil membersihkan ${res.count} pesanan lawas.`);
        router.refresh();
      }
    } catch {
      alert("Gagal membersihkan pesanan lawas.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top filter tabs and purge button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["SEMUA", "BARU", "DIPROSES", "SELESAI", "BATAL"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                filter === st
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-600 hover:bg-stone-200 border border-stone-200"
              }`}
            >
              {st === "SEMUA" ? "Semua Pesanan" : st}
            </button>
          ))}
        </div>

        <button
          onClick={handlePurgeOldOrders}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-700 font-semibold self-end sm:self-center transition"
          title="Bersihkan data pembeli yang lebih dari 90 hari (UU PDP)"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Pesanan &gt; 90 Hari (UU PDP)</span>
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base sm:text-lg text-stone-900">
                      {order.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        order.status === "BARU"
                          ? "bg-amber-100 text-amber-800"
                          : order.status === "DIPROSES"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "SELESAI"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {/* Status selector & WA Button */}
                <div className="flex items-center gap-2.5 self-start sm:self-center">
                  <select
                    value={order.status}
                    disabled={isUpdating === order.id}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value as "BARU" | "DIPROSES" | "SELESAI" | "BATAL"
                      )
                    }
                    className="py-1.5 px-3 rounded-lg border border-stone-300 text-xs font-semibold bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="BARU">Status: BARU</option>
                    <option value="DIPROSES">Status: DIPROSES</option>
                    <option value="SELESAI">Status: SELESAI</option>
                    <option value="BATAL">Status: BATAL</option>
                  </select>

                  <a
                    href={`https://wa.me/${order.customerPhone}?text=Halo%20${encodeURIComponent(
                      order.customerName
                    )}%2C%20kami%20dari%20toko%20ingin%20mengonfirmasi%20pesanan%20Anda%20dengan%20nomor%20${
                      order.code
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                    <span>Buka Chat WA</span>
                  </a>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Data Pembeli
                  </span>
                  <div className="font-bold text-stone-900 mt-0.5">
                    {order.customerName}
                  </div>
                  <div className="text-xs text-stone-600">
                    No. WA: {order.customerPhone}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Alamat Kirim & Catatan
                  </span>
                  <div className="text-xs text-stone-700 mt-0.5">
                    {order.address ? (
                      <span className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{order.address}</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">
                        Tanpa alamat khusus (Takeaway/Meja)
                      </span>
                    )}
                  </div>
                  {order.note && (
                    <div className="text-xs text-stone-500 mt-1 italic flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-stone-400" />
                      <span>Catatan: {order.note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Rincian Item Produk
                </span>
                <div className="divide-y divide-stone-100 text-xs sm:text-sm">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-2 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-stone-900">
                          {item.productName}
                        </span>
                        {item.variantName && (
                          <span className="text-xs text-amber-700 ml-1.5 font-medium">
                            ({item.variantName})
                          </span>
                        )}
                        <span className="text-xs text-stone-400 ml-2">
                          × {item.qty}
                        </span>
                      </div>
                      <div className="font-semibold text-stone-900">
                        {formatRupiah(item.unitPrice * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total footer */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-sm font-bold text-stone-900">
                <span>Total Pesanan</span>
                <span className="text-base sm:text-lg text-amber-800">
                  {formatRupiah(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-sm">
          Tidak ada pesanan dengan status &ldquo;{filter}&rdquo;.
        </div>
      )}
    </div>
  );
}
