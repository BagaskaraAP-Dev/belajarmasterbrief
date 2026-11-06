import { db } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, ShoppingBag } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    where: { deletedAt: null },
    include: {
      category: true,
      images: {
        orderBy: { sort: "asc" },
      },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Kelola Produk
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Total {products.length} produk terdaftar di database.
          </p>
        </div>

        <Link
          href="/admin/produk/baru"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Produk Baru</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Foto & Nama Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga Pokok</th>
                  <th className="py-3 px-4">Stok / Status</th>
                  <th className="py-3 px-4">Unggulan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {products.map((p) => {
                  const mainImage = p.images[0];
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-stone-100 relative overflow-hidden shrink-0 border border-stone-200">
                            {mainImage?.path &&
                            mainImage.path !== "/placeholder-product.jpg" ? (
                              <Image
                                src={mainImage.path}
                                alt={mainImage.alt || p.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <ShoppingBag className="w-5 h-5 stroke-1" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block">
                              {p.name}
                            </span>
                            <span className="text-xs text-stone-400">
                              Slug: {p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-medium">
                          {p.category?.name || "Tanpa Kategori"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {formatRupiah(p.price)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            p.isAvailable
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.isAvailable ? "Tersedia" : "Habis"}
                        </span>
                        {p.stock !== null && (
                          <span className="text-xs text-stone-400 ml-1.5">
                            ({p.stock} pcs)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {p.isFeatured ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
                            Ya
                          </span>
                        ) : (
                          <span className="text-stone-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/produk/${p.id}`}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-stone-100 transition"
                            title="Edit Produk"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteProductButton
                            productId={p.id}
                            productName={p.name}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-stone-400 text-sm">
            Belum ada produk yang terdaftar. Silakan tambah produk baru.
          </div>
        )}
      </div>
    </div>
  );
}
