"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/features/categories/actions";
import { Plus, Edit2, Trash2, Check, X, FolderTree } from "lucide-react";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  sort: number;
  _count: {
    products: number;
  };
};

export function CategoryManager({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();

  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (val: string) => {
    setNewName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setNewSlug(autoSlug);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createCategoryAction({
        name: newName.trim(),
        slug: newSlug.trim(),
        sort: categories.length + 1,
      });

      if (res.success) {
        setNewName("");
        setNewSlug("");
        router.refresh();
      } else {
        alert(res.error || "Gagal membuat kategori");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  };

  const handleSaveEdit = async (id: string, sort: number) => {
    setIsSubmitting(true);
    try {
      const res = await updateCategoryAction(id, {
        name: editName.trim(),
        slug: editSlug.trim(),
        sort,
      });

      if (res.success) {
        setEditingId(null);
        router.refresh();
      } else {
        alert(res.error || "Gagal memperbarui kategori");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Hapus kategori "${name}"? Produk dalam kategori ini akan menjadi tanpa kategori.`
    );
    if (!confirmDelete) return;

    setIsSubmitting(true);
    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus kategori");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4"
      >
        <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-600" />
          <span>Tambah Kategori Baru</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Nama Kategori *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Camilan Khas"
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
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="camilan-khas"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition disabled:opacity-60"
        >
          {isSubmitting ? "Menambahkan..." : "Tambah Kategori"}
        </button>
      </form>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-stone-100 flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-amber-600" />
          <h2 className="font-bold text-stone-900 text-base">
            Daftar Kategori ({categories.length})
          </h2>
        </div>

        {categories.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {categories.map((cat) => {
              const isEditing = editingId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/50"
                >
                  {isEditing ? (
                    <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-sm w-full sm:w-auto"
                      />
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-sm w-full sm:w-auto"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(cat.id, cat.sort)}
                          className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-2 rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-stone-900 text-sm sm:text-base">
                        {cat.name}
                      </span>
                      <div className="text-xs text-stone-400 mt-0.5">
                        Slug: <code className="text-amber-800">{cat.slug}</code> •{" "}
                        {cat._count.products} produk
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
                        title="Edit Kategori"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 text-sm">
            Belum ada kategori yang dibuat.
          </div>
        )}
      </div>
    </div>
  );
}
