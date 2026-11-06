"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTransition } from "react";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
};

type CatalogFiltersProps = {
  categories: CategoryItem[];
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
};

export function CatalogFilters({
  categories,
  currentCategory = "",
  currentSearch = "",
  currentSort = "terbaru",
}: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 on filter changes
    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("q") as string) || "";
    updateFilters("q", q.trim());
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar & Sort Dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:flex-1">
          <input
            type="text"
            name="q"
            defaultValue={currentSearch}
            placeholder="Cari produk pilihan..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {currentSearch && (
            <button
              type="button"
              onClick={() => updateFilters("q", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              aria-label="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 hidden sm:flex">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Urutkan:</span>
          </div>
          <select
            value={currentSort}
            onChange={(e) => updateFilters("sort", e.target.value)}
            className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition font-medium"
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Harga: Rendah ke Tinggi</option>
            <option value="termahal">Harga: Tinggi ke Rendah</option>
            <option value="nama-asc">Nama: A - Z</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => updateFilters("kategori", "")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
            !currentCategory
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          Semua Produk
        </button>
        {categories.map((cat) => {
          const isSelected = currentCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => updateFilters("kategori", cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                isSelected
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {isPending && (
        <div className="text-xs text-amber-700 animate-pulse font-medium">
          Memperbarui katalog...
        </div>
      )}
    </div>
  );
}
