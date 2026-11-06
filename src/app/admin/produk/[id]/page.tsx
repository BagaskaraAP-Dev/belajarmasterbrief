import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sort: "asc" } },
        variants: true,
      },
    }),
    db.category.findMany({
      orderBy: { sort: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Edit Produk: {product.name}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Perbarui rincian harga, foto, atau status ketersediaan produk ini.
        </p>
      </div>

      <ProductForm
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          isAvailable: product.isAvailable,
          isFeatured: product.isFeatured,
          stock: product.stock,
          categoryId: product.categoryId,
          variants: product.variants.map((v) => ({
            name: v.name,
            priceDiff: v.priceDiff,
          })),
          images: product.images.map((img) => ({
            path: img.path,
            alt: img.alt,
            width: img.width,
            height: img.height,
            sort: img.sort,
          })),
        }}
        categories={categories}
      />
    </div>
  );
}
