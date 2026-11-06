"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  sort: z.coerce.number().int().default(0),
});

export async function createCategoryAction(input: z.infer<typeof categorySchema>) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    const created = await db.category.create({
      data: parsed.data,
    });

    revalidatePath("/produk");
    revalidatePath("/admin/kategori");

    return { success: true, categoryId: created.id };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal membuat kategori baru";
    return { success: false, error: errorMsg };
  }
}

export async function updateCategoryAction(
  id: string,
  input: z.infer<typeof categorySchema>
) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await db.category.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/produk");
    revalidatePath("/admin/kategori");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal memperbarui kategori";
    return { success: false, error: errorMsg };
  }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();

  try {
    await db.category.delete({
      where: { id },
    });

    revalidatePath("/produk");
    revalidatePath("/admin/kategori");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal menghapus kategori";
    return { success: false, error: errorMsg };
  }
}
