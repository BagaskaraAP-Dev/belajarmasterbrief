"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  content: z.string().min(5, "Ulasan minimal 5 karakter"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isVisible: z.boolean().default(true),
});

export async function createTestimonialAction(
  input: z.infer<typeof testimonialSchema>
) {
  await requireAdmin();

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await db.testimonial.create({
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimoni");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal menambahkan ulasan";
    return { success: false, error: errorMsg };
  }
}

export async function toggleTestimonialVisibilityAction(
  id: string,
  isVisible: boolean
) {
  await requireAdmin();

  try {
    await db.testimonial.update({
      where: { id },
      data: { isVisible },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimoni");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal memperbarui ulasan";
    return { success: false, error: errorMsg };
  }
}

export async function deleteTestimonialAction(id: string) {
  await requireAdmin();

  try {
    await db.testimonial.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimoni");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal menghapus ulasan";
    return { success: false, error: errorMsg };
  }
}
