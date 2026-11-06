"use client";

import { useState } from "react";
import { deleteProductAction } from "@/features/products/actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${productName}"?`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const res = await deleteProductAction(productId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus produk");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
      title="Hapus Produk"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
