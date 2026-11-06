import { db } from "@/lib/db";
import { CategoryManager } from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sort: "asc" },
    include: {
      _count: {
        select: { products: { where: { deletedAt: null } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Kelola Kategori Produk
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Atur pengelompokan menu dan produk toko Anda agar pembeli mudah mencari produk.
        </p>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
