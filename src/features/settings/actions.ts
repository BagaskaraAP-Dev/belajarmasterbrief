"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const storeSettingsSchema = z.object({
  name: z.string().min(2, "Nama toko minimal 2 karakter"),
  tagline: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  mapsEmbed: z.string().optional().nullable(),
  waNumber: z.string().min(9, "Nomor WhatsApp minimal 9 digit"),
  openHours: z.string().optional().nullable(),
  socials: z.record(z.string(), z.string()).default({}),
  heroTitle: z.string().optional().nullable(),
  heroText: z.string().optional().nullable(),
});

export async function updateStoreSettingsAction(
  input: z.infer<typeof storeSettingsSchema>
) {
  await requireAdmin();

  const parsed = storeSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await db.storeSetting.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: {
        id: 1,
        ...parsed.data,
      },
    });

    revalidatePath("/");
    revalidatePath("/kontak");
    revalidatePath("/tentang");
    revalidatePath("/admin/pengaturan");

    return { success: true };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Gagal menyimpan pengaturan toko";
    return { success: false, error: errorMsg };
  }
}
