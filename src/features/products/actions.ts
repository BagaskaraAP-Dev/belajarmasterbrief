"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { processAndSaveImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Nama produk minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  price: z.coerce.number().int().positive("Harga harus berupa angka positif"),
  comparePrice: z.coerce.number().int().positive().optional().nullable(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  stock: z.coerce.number().int().nonnegative().optional().nullable(),
  categoryId: z.string().nullable().optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        priceDiff: z.coerce.number().int().default(0),
      })
    )
    .default([]),
  images: z
    .array(
      z.object({
        path: z.string().min(1),
        alt: z.string().min(1),
        width: z.coerce.number().int().default(800),
        height: z.coerce.number().int().default(800),
        sort: z.coerce.number().int().default(0),
      })
    )
    .default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export async function uploadProductImageAction(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, error: "Tidak ada berkas yang diunggah" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await processAndSaveImage(buffer);
    return { success: true, image: result };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal memproses gambar";
    return { success: false, error: errorMsg };
  }
}

export async function createProductAction(input: ProductFormValues) {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { variants, images, ...data } = parsed.data;

  try {
    // Generate slug uniqueness check
    const existing = await db.product.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      data.slug = `${data.slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const created = await db.product.create({
      data: {
        ...data,
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            priceDiff: v.priceDiff,
          })),
        },
        images: {
          create: images.map((img, idx) => ({
            path: img.path,
            alt: img.alt,
            width: img.width,
            height: img.height,
            sort: img.sort ?? idx,
          })),
        },
      },
    });

    revalidatePath("/produk");
    revalidatePath("/");
    revalidatePath("/admin/produk");

    return { success: true, productId: created.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Gagal membuat produk";
    return { success: false, error: errorMsg };
  }
}

export async function updateProductAction(
  productId: string,
  input: ProductFormValues
) {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { variants, images, ...data } = parsed.data;

  try {
    await db.product.update({
      where: { id: productId },
      data: {
        ...data,
      },
    });

    // Re-create variants
    await db.productVariant.deleteMany({ where: { productId } });
    if (variants.length > 0) {
      await db.productVariant.createMany({
        data: variants.map((v) => ({
          productId,
          name: v.name,
          priceDiff: v.priceDiff,
        })),
      });
    }

    // Re-create images
    await db.productImage.deleteMany({ where: { productId } });
    if (images.length > 0) {
      await db.productImage.createMany({
        data: images.map((img, idx) => ({
          productId,
          path: img.path,
          alt: img.alt,
          width: img.width,
          height: img.height,
          sort: img.sort ?? idx,
        })),
      });
    }

    revalidatePath("/produk");
    revalidatePath(`/produk/${data.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/produk");

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Gagal mengubah produk";
    return { success: false, error: errorMsg };
  }
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();

  try {
    // Soft delete
    await db.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/produk");
    revalidatePath("/");
    revalidatePath("/admin/produk");

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menghapus produk";
    return { success: false, error: errorMsg };
  }
}
