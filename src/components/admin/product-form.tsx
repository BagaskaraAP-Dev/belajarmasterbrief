"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createProductAction,
  updateProductAction,
  uploadProductImageAction,
  type ProductFormValues,
} from "@/features/products/actions";
import {
  Upload,
  Trash2,
  Plus,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductFormProps = {
  initialData?: ProductFormValues & { id: string };
  categories: CategoryOption[];
};

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [price, setPrice] = useState<number | string>(initialData?.price ?? "");
  const [comparePrice, setComparePrice] = useState<number | string>(
    initialData?.comparePrice ?? ""
  );
  const [stock, setStock] = useState<number | string>(
    initialData?.stock ?? ""
  );
  const [isAvailable, setIsAvailable] = useState(
    initialData?.isAvailable ?? true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured ?? false
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [variants, setVariants] = useState<
    Array<{ name: string; priceDiff: number }>
  >(initialData?.variants || []);

  const [images, setImages] = useState<
    Array<{ path: string; alt: string; width: number; height: number; sort: number }>
  >(initialData?.images || []);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto slug generation from name if creating new product
  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generatedSlug);
    }
  };

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadProductImageAction(formData);
      if (res.success && res.image) {
        setImages((prev) => [
          ...prev,
          {
            path: res.image.path,
            alt: name || "Foto Produk",
            width: res.image.width,
            height: res.image.height,
            sort: prev.length,
          },
        ]);
      } else {
        setErrorMessage(res.error || "Gagal mengunggah gambar");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  // Add Variant
  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { name: "", priceDiff: 0 }]);
  };

  const handleUpdateVariant = (
    index: number,
    field: "name" | "priceDiff",
    val: string | number
  ) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: val } : v
      )
    );
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const payload: ProductFormValues = {
      name,
      slug,
      description,
      price: Number(price),
      comparePrice: comparePrice !== "" ? Number(comparePrice) : null,
      stock: stock !== "" ? Number(stock) : null,
      isAvailable,
      isFeatured,
      categoryId: categoryId || null,
      variants,
      images,
    };

    try {
      let res;
      if (initialData?.id) {
        res = await updateProductAction(initialData.id, payload);
      } else {
        res = await createProductAction(payload);
      }

      if (res.success) {
        router.push("/admin/produk");
        router.refresh();
      } else {
        setErrorMessage(res.error || "Gagal menyimpan data produk.");
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage("Terjadi gangguan sistem saat menyimpan produk.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/produk"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Produk</span>
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow transition flex items-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Simpan Produk</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 text-xs sm:text-sm rounded-2xl border border-red-200 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-stone-900 text-base">Informasi Pokok</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Nama Produk *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Pempek Kulit Crispy"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Slug URL *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="pempek-kulit-crispy"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Harga Jual (Rp) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Harga Coret (Opsional Rp)
            </label>
            <input
              type="number"
              min={0}
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              placeholder="30000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
            Deskripsi Produk Lengkap *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan komposisi bahan, rasa, dan keunggulan produk ini..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Stock & Switch status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Stok (Kosongkan jika tidak dilacak)
            </label>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="50"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isAvailable"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="isAvailable" className="text-xs font-bold text-stone-800">
              Produk Siap Dijual (Tersedia)
            </label>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-stone-800">
              Tampilkan di Produk Unggulan
            </label>
          </div>
        </div>
      </div>

      {/* Product Images Uploader */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-900 text-base">Foto Produk (Maks 5)</h2>
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition">
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>+ Upload Foto</span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isUploading || images.length >= 5}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group bg-stone-50"
              >
                <Image
                  src={img.path}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                  title="Hapus foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">
            Belum ada foto yang diunggah. Format didukung: JPEG, PNG, WebP (maks 5MB). Foto akan di-convert otomatis ke WebP super cepat tanpa data privasi EXIF.
          </p>
        )}
      </div>

      {/* Product Variants */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-900 text-base">Varian Produk</h2>
          <button
            type="button"
            onClick={handleAddVariant}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Varian</span>
          </button>
        </div>

        {variants.length > 0 ? (
          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nama Varian (mis. Ukuran L, Level 3)"
                  value={v.name}
                  onChange={(e) =>
                    handleUpdateVariant(idx, "name", e.target.value)
                  }
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="w-36">
                  <input
                    type="number"
                    placeholder="Selisih (+/- Rp)"
                    value={v.priceDiff}
                    onChange={(e) =>
                      handleUpdateVariant(
                        idx,
                        "priceDiff",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(idx)}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">
            Opsional: Tambahkan pilihan varian ukuran atau level pedas jika produk ini memiliki opsi pilihan.
          </p>
        )}
      </div>
    </form>
  );
}
