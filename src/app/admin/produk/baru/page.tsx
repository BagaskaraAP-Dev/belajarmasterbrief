import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const categories = await db.category.findMany({
    orderBy: { sort: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Tambah Produk Baru
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Isi formulir berikut untuk menambahkan produk baru ke katalog toko Anda.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
