import { db } from "@/lib/db";
import { formatRupiah, formatDate } from "@/lib/format";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Package,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const [
    todayOrdersCount,
    weekOrdersCount,
    outOfStockCount,
    totalProductsCount,
    recentOrders,
  ] = await Promise.all([
    db.order.count({
      where: { createdAt: { gte: startOfDay } },
    }),
    db.order.count({
      where: { createdAt: { gte: startOfWeek } },
    }),
    db.product.count({
      where: {
        deletedAt: null,
        OR: [{ isAvailable: false }, { stock: 0 }],
      },
    }),
    db.product.count({
      where: { deletedAt: null },
    }),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Ringkasan Toko
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Pantau performa penjualan dan status operasional toko Anda hari ini.
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase">Pesanan Hari Ini</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {todayOrdersCount}
          </div>
          <p className="text-[11px] text-stone-400">Total order masuk sejak 00.00</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase">Pesanan 7 Hari</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {weekOrdersCount}
          </div>
          <p className="text-[11px] text-stone-400">Performa pesanan minggu ini</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase">Produk Habis</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {outOfStockCount}
          </div>
          <p className="text-[11px] text-stone-400">Perlu diisi ulang (restock)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase">Total Produk</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {totalProductsCount}
          </div>
          <p className="text-[11px] text-stone-400">Menu terdaftar di katalog</p>
        </div>
      </div>

      {/* 5 Recent Orders */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-stone-900 text-base">
              5 Pesanan Terbaru
            </h2>
            <p className="text-xs text-stone-500">Daftar pesanan terakhir via WhatsApp</p>
          </div>
          <Link
            href="/admin/pesanan"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Kode Order</th>
                  <th className="py-3 px-4">Pembeli</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {o.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{o.customerName}</div>
                      <div className="text-xs text-stone-400">{o.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {formatRupiah(o.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          o.status === "BARU"
                            ? "bg-amber-100 text-amber-800"
                            : o.status === "DIPROSES"
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "SELESAI"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-500">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/${o.customerPhone}?text=Halo%20${encodeURIComponent(
                          o.customerName
                        )}%2C%20kami%20dari%20toko%20terkait%20pesanan%20${o.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chat WA</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 text-xs sm:text-sm">
            Belum ada pesanan yang masuk.
          </div>
        )}
      </div>
    </div>
  );
}
