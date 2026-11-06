"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTestimonialAction,
  toggleTestimonialVisibilityAction,
  deleteTestimonialAction,
} from "@/features/testimonials/actions";
import { Star, Plus, Trash2, Eye, EyeOff } from "lucide-react";

type TestimonialItem = {
  id: string;
  name: string;
  content: string;
  rating: number | null;
  isVisible: boolean;
};

export function TestimonialManager({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createTestimonialAction({
        name: name.trim(),
        content: content.trim(),
        rating,
        isVisible: true,
      });

      if (res.success) {
        setName("");
        setContent("");
        router.refresh();
      } else {
        alert(res.error || "Gagal menambahkan testimoni");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentVisible: boolean) => {
    try {
      await toggleTestimonialVisibilityAction(id, !currentVisible);
      router.refresh();
    } catch {
      alert("Gagal mengubah status visibilitas");
    }
  };

  const handleDelete = async (id: string, authorName: string) => {
    const confirmDelete = window.confirm(
      `Hapus testimoni dari "${authorName}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteTestimonialAction(id);
      router.refresh();
    } catch {
      alert("Gagal menghapus ulasan");
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
          <span>Tambah Ulasan Pelanggan Baru</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Nama Pembeli / Pelanggan *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Ibu Rina - Jakarta"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Bintang / Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
              <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
              <option value={3}>⭐⭐⭐ (3 Bintang)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
            Isi Testimoni / Ulasan *
          </label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis ulasan kepuasan pelanggan..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Ulasan"}
        </button>
      </form>

      {/* Testimonials List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-stone-100">
          <h2 className="font-bold text-stone-900 text-base">
            Daftar Ulasan Terdaftar ({testimonials.length})
          </h2>
        </div>

        {testimonials.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {t.name}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleToggle(t.id, t.isVisible)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                      t.isVisible
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200"
                    }`}
                  >
                    {t.isVisible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tampil di Web</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Disembunyikan</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus ulasan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 text-sm">
            Belum ada ulasan testimoni.
          </div>
        )}
      </div>
    </div>
  );
}
