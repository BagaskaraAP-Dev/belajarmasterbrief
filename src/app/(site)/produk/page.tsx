import { getCategories, getProducts } from "@/features/products/queries";
import { getStoreSettings } from "@/features/settings/queries";
import { ProductCard } from "@/components/site/product-card";
import { CatalogFilters } from "@/components/site/catalog-filters";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contoh-umkm.my.id";

  return {
    title: `Katalog Produk & Menu - ${settings.name}`,
    description: `Jelajahi seluruh daftar menu kuliner dan produk pilihan dari ${settings.name}. Pesan mudah dan cepat via WhatsApp.`,
    alternates: {
      canonical: `${siteUrl}/produk`,
    },
  };
}

type SearchParams = Promise<{
  kategori?: string;
  q?: string;
  sort?: "terbaru" | "termurah" | "termahal" | "nama-asc";
  page?: string;
}>;

export default async function ProductsCatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.kategori || "";
  const currentSearch = resolvedParams.q || "";
  const currentSort = resolvedParams.sort || "terbaru";
  const currentPage = parseInt(resolvedParams.page || "1", 10) || 1;

  const [categories, { products, totalPages, totalCount }] = await Promise.all([
    getCategories(),
    getProducts({
      category: currentCategory,
      query: currentSearch,
      sort: currentSort,
      page: currentPage,
      limit: 12,
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Katalog Produk
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Temukan aneka pilihan makanan dan minuman segar berkualitas kami. Total {totalCount} produk tersedia.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <CatalogFilters
        categories={categories}
        currentCategory={currentCategory}
        currentSearch={currentSearch}
        currentSort={currentSort}
      />

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-stone-100 rounded-3xl border border-dashed border-stone-300 space-y-3">
          <p className="font-bold text-stone-700 text-base sm:text-lg">
            Tidak ada produk yang cocok dengan pencarian Anda.
          </p>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau pilih kategori lainnya.
          </p>
          <div className="pt-2">
            <Link
              href="/produk"
              className="inline-block px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs sm:text-sm hover:bg-amber-700 transition"
            >
              Reset Filter & Pencarian
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Navigasi halaman katalog" className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-stone-200">
          <Link
            href={`/produk?page=${Math.max(1, currentPage - 1)}${
              currentCategory ? `&kategori=${currentCategory}` : ""
            }${currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""}${
              currentSort ? `&sort=${currentSort}` : ""
            }`}
            aria-disabled={currentPage <= 1}
            className={`p-2.5 rounded-xl border border-stone-200 flex items-center justify-center transition ${
              currentPage <= 1
                ? "pointer-events-none opacity-40 bg-stone-100 text-stone-400"
                : "bg-white text-stone-700 hover:bg-stone-50 hover:border-amber-400"
            }`}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <span className="text-xs sm:text-sm font-semibold text-stone-700 px-4">
            Halaman {currentPage} dari {totalPages}
          </span>

          <Link
            href={`/produk?page=${Math.min(totalPages, currentPage + 1)}${
              currentCategory ? `&kategori=${currentCategory}` : ""
            }${currentSearch ? `&q=${encodeURIComponent(currentSearch)}` : ""}${
              currentSort ? `&sort=${currentSort}` : ""
            }`}
            aria-disabled={currentPage >= totalPages}
            className={`p-2.5 rounded-xl border border-stone-200 flex items-center justify-center transition ${
              currentPage >= totalPages
                ? "pointer-events-none opacity-40 bg-stone-100 text-stone-400"
                : "bg-white text-stone-700 hover:bg-stone-50 hover:border-amber-400"
            }`}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </nav>
      )}
    </div>
  );
}
